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

function extendSelectionToWord() {
  let selection = document.getSelection()
  selection.modify('move', 'backward', 'word')
  selection.modify('extend', 'forward', 'word')
}

function toggleVisibility(className, isVisible) {
  if (isVisible) {
    document
      .querySelectorAll(`.${className}`)
      .forEach((el) => el.classList.remove('hidden'))
  } else {
    document
      .querySelectorAll(`.${className}`)
      .forEach((el) => el.classList.add('hidden'))
  }
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('Side panel DOM content loaded')

  chrome.contextMenus.create({
    id: 'mdn-consult',
    title: 'Search MDN for "%s"',
    contexts: ['selection'],
    documentUrlPatterns: [
      `chrome-extension://${chrome.runtime.id}/side_panel/sidepanel.html`,
    ],
  })

  document.addEventListener('contextmenu', extendSelectionToWord)

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

  chrome.runtime.sendMessage({ action: 'displaySchema' })

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
      console.log('Regenerating schema')
      chrome.runtime.sendMessage({ action: 'displaySchema' })
    })

  document
    .getElementById('display-attribute')
    .addEventListener('change', function () {
      console.log(document.getElementById('display-attribute').checked)
      toggleVisibility(
        'attribute',
        document.getElementById('display-attribute').checked
      )
    })

  document
    .getElementById('display-element-text')
    .addEventListener('change', function () {
      toggleVisibility(
        'element-text',
        document.getElementById('display-element-text').checked
      )
    })
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'updateSchema') {
    displaySchema(message.schema)
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
