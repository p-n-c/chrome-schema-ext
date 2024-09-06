chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed')
})

chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ tabId: tab.id })
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message received:', message)
  if (message.action === 'displaySchema') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          function: generateAndSendSchema,
        },
        (results) => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError)
          } else if (results && results[0]) {
            chrome.runtime.sendMessage({
              action: 'updateSchema',
              schema: results[0].result,
            })
          }
        }
      )
    })
  }
})

function generateAndSendSchema() {
  const treeStructure = parseHtmlDocumentInBrowser()
  const schemaHtml = generateSchemaHtml(treeStructure)
  return schemaHtml.outerHTML
}
