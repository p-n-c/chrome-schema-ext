let currentTabId = null

function openOrReloadWindow(url, windowName) {
  const parsedUrl = new URL(url)
  const baseUrl = `${parsedUrl.protocol}//${parsedUrl.hostname}`
  const existingWindow = window.open('', windowName)
  if (existingWindow) {
    existingWindow.location.href = url
  } else {
    window.open(url, windowName)
  }
}

function extendSelectionToWord(selection) {
  selection.modify('move', 'backward', 'word')
  selection.modify('extend', 'forward', 'word')
}

document.addEventListener('DOMContentLoaded', () => {
  chrome.contextMenus.create({
    // TODO check if it's already there
    id: 'mdn-consult',
    title: 'Search MDN for "%s"',
    contexts: ['selection'],
    documentUrlPatterns: [
      `chrome-extension://${chrome.runtime.id}/side_panel/sidepanel.html`,
    ],
  })

  // Only select the whole word on right click if it's a tag
  document.addEventListener('contextmenu', () => {
    let selection = document.getSelection()
    if (selection.anchorNode.parentElement.classList.contains('tag')) {
      extendSelectionToWord(selection)
    }
  })

  chrome.contextMenus.onClicked.addListener(function (info) {
    switch (info.menuItemId) {
      case 'mdn-consult':
        const selection = document.getSelection()
        selectedText = selection.toString()
        openOrReloadWindow(
          `https://developer.mozilla.org/en-US/docs/Web/HTML/Element/${selectedText}`,
          'mdn-from-sidepanel'
        )
      // Maybe remove the selection once the MDN is displayed?
      // selection.removeAllRanges()
    }
  })

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    currentTabId = tabs[0].id
    chrome.runtime.sendMessage({ action: 'displaySchema' })
  })

  document
    .getElementById('expand-schema')
    .addEventListener('click', function () {
      document
        .querySelectorAll('details')
        .forEach((details) => (details.open = true))
    })

  document
    .getElementById('collapse-schema')
    .addEventListener('click', function () {
      document
        .querySelectorAll('details')
        .forEach((details) => (details.open = false))
    })

  document
    .getElementById('regenerate-schema')
    .addEventListener('click', function () {
      chrome.runtime.sendMessage({ action: 'displaySchema' })
    })
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.tabId !== currentTabId) return

  if (message.action === 'updateSchema') {
    displaySchema(message.schema)
    document.querySelectorAll('.highlight-button').forEach((el) => {
      el.addEventListener('click', function (event) {
        chrome.runtime.sendMessage({
          action: 'highlightElement',
          elementId: event.target.id,
        })
      })
    })

    // Restore open state
    document.querySelectorAll('details').forEach((details) => {
      details.addEventListener('toggle', function () {
        chrome.runtime.sendMessage({
          action: 'updateOpenState',
          tabId: currentTabId,
          elementId: this.querySelector('summary span.tag').id,
          isOpen: this.open,
        })
      })

      const elementId = details.querySelector('summary span.tag').id
      chrome.runtime.sendMessage(
        {
          action: 'getOpenState',
          tabId: currentTabId,
          elementId,
        },
        (response) => {
          if (response && response.isOpen) {
            details.open = true
          }
        }
      )
    })
  }
  if (message.action === 'updateTitle') {
    displayTitle(message.title)
  }
})

function displaySchema(schemaHTML) {
  const schemaContainer = document.getElementById('schema-content')
  if (schemaHTML === null)
    schemaContainer.innerHTML = 'Refresh page and hit Regenerate ↺'
  else schemaContainer.innerHTML = `${schemaHTML}`
}

function displayTitle(title) {
  const titleContainer = document.getElementById('title-content')
  if (title === null)
    titleContainer.innerHTML = 'Error: Extension loaded after page'
  else titleContainer.innerHTML = `Page: ${title}`
}

// Listen for tab changes
chrome.tabs.onActivated.addListener((activeInfo) => {
  currentTabId = activeInfo.tabId
  chrome.runtime.sendMessage({ action: 'displaySchema' })
})
