let currentTabId = null

document.addEventListener('DOMContentLoaded', () => {
  chrome.contextMenus.create(
    {
      id: 'mdn-consult',
      title: 'Search MDN for "%s"',
      contexts: ['selection'],
      documentUrlPatterns: [
        `chrome-extension://${chrome.runtime.id}/side_panel/sidepanel.html`,
      ],
    },
    () => {
      if (chrome.runtime.lastError) {
        // The menu item already exists, we can safely ignore this error
      }
    }
  )

  document.addEventListener('contextmenu', () => {
    let selection = document.getSelection()
    if (selection.anchorNode.parentElement.classList.contains('tag')) {
      extendSelectionToWord(selection)
    }
  })

  chrome.contextMenus.onClicked.addListener(function (info) {
    if (info.menuItemId === 'mdn-consult') {
      const selection = document.getSelection()
      const selectedText = selection.toString()
      openOrReloadWindow(
        `https://developer.mozilla.org/en-US/docs/Web/HTML/Element/${selectedText}`,
        'mdn-from-sidepanel'
      )
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
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.tabId !== currentTabId) return

  switch (message.action) {
    case 'updateSchema':
      displaySchema(message.schema)
      document.querySelectorAll('.highlight-button').forEach((el) => {
        el.addEventListener('click', function (event) {
          chrome.runtime.sendMessage({
            action: 'highlightElement',
            elementId: event.target.id,
          })
        })
      })
      break
    case 'noSchema':
      displayNoSchema(message.error)
      break
    case 'notWebPage':
      displayNotWebPage(message.url)
      break
    case 'updateTitle':
      displayTitle(message.title)
      break
  }
})

function displaySchema(schemaHTML) {
  const schemaContainer = document.getElementById('schema-content')
  if (schemaHTML === null) {
    schemaContainer.innerHTML = 'Refresh page to regenerate schema'
    disablePanel(true)
  } else {
    schemaContainer.innerHTML = `${schemaHTML}`
    disablePanel(false)
  }
}

function displayNoSchema(error) {
  const schemaContainer = document.getElementById('schema-content')
  schemaContainer.innerHTML = `Unable to generate schema for this page. ${error ? `Error: ${error}` : 'Try refreshing the page.'}`
  disablePanel(true)
}

function displayNotWebPage(url) {
  const schemaContainer = document.getElementById('schema-content')
  schemaContainer.innerHTML = `Schema generation is not available for this type of page (${url}). Only HTTP and HTTPS pages are supported.`
  displayTitle('N/A')
  disablePanel(true)
}

function displayTitle(title) {
  const titleContainer = document.getElementById('title-content')
  if (title === null) {
    titleContainer.innerHTML = 'Error: Extension loaded after page'
  } else {
    titleContainer.innerHTML = `Page: ${title}`
  }
}

function disablePanel(isDisabled) {
  document.body.style.pointerEvents = isDisabled ? 'none' : 'auto'
  document.body.style.opacity = isDisabled ? '0.5' : '1'
}

// Listen for tab changes
chrome.tabs.onActivated.addListener((activeInfo) => {
  currentTabId = activeInfo.tabId
  chrome.runtime.sendMessage({ action: 'displaySchema' })
})

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tabId === currentTabId && changeInfo.status === 'complete') {
    chrome.runtime.sendMessage({ action: 'displaySchema' })
  }
})

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
