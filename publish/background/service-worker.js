const tabData = new Map()

chrome.tabs.onRemoved.addListener((tabId) => {
  tabData.delete(tabId)
})

chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ tabId: tab.id })
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message received:', message)
  switch (message.action) {
    case 'displaySchema':
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentTab = tabs[0]
        if (!isWebPage(currentTab.url)) {
          chrome.runtime.sendMessage({
            action: 'notWebPage',
            tabId: currentTab.id,
            url: currentTab.url,
          })
          return
        }
        const currentTabData = tabData.get(currentTab.id)
        if (
          currentTabData &&
          currentTabData.url === currentTab.url &&
          currentTabData.schema
        ) {
          // Schema exists and matches the page, send it to the sidepanel
          chrome.runtime.sendMessage({
            action: 'updateSchema',
            schema: tabData.get(currentTab.id).schema,
            tabId: currentTab.id,
          })
        } else {
          // No schema or schema out of date, attempt to (re)generate one
          chrome.scripting.executeScript(
            {
              target: { tabId: currentTab.id },
              function: generateAndSendSchema,
            },
            (results) => {
              if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError)
                chrome.runtime.sendMessage({
                  action: 'noSchema',
                  tabId: currentTab.id,
                  error: chrome.runtime.lastError.message,
                })
              } else if (results && results[0]) {
                const schemaData = results[0].result
                tabData.set(currentTab.id, {
                  schema: schemaData,
                  url: currentTab.url,
                })
                chrome.runtime.sendMessage({
                  action: 'updateSchema',
                  schema: schemaData,
                  tabId: currentTab.id,
                })
              }
            }
          )
        }

        // Generate and send title
        chrome.scripting.executeScript(
          {
            target: { tabId: currentTab.id },
            function: generateTitle,
          },
          (results) => {
            if (chrome.runtime.lastError) {
              console.error(chrome.runtime.lastError)
            } else if (results && results[0]) {
              chrome.runtime.sendMessage({
                action: 'updateTitle',
                title: results[0].result,
                tabId: currentTab.id,
              })
            }
          }
        )
      })
      break
    case 'highlightElement':
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript(
          {
            target: { tabId: tabs[0].id },
            func: sendFlashRequest,
            args: [message.elementId],
          },
          (results) => {
            if (chrome.runtime.lastError) {
              console.error(chrome.runtime.lastError)
            }
          }
        )
      })
      break
  }
})

function sendFlashRequest(elementId) {
  flashElement(elementId)
}

function generateAndSendSchema() {
  const treeStructure = parseHtmlDocumentInBrowser()
  const schemaHtml = generateSchemaHtml(treeStructure)
  return schemaHtml.outerHTML
}

function generateTitle() {
  return getTitle()
}

function isWebPage(url) {
  return (
    url !== undefined && (url.startsWith('http:') || url.startsWith('https:'))
  )
}
