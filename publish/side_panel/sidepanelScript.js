document.addEventListener('DOMContentLoaded', () => {
  console.log('Side panel DOM content loaded')
  console.log(`${chrome.runtime.id}`)

  chrome.contextMenus.create({
    id: 'mdn-consult',
    title: 'Check MDN',
    contexts: ['selection'],
    documentUrlPatterns: [
      `chrome-extension://${chrome.runtime.id}/side_panel/sidepanel.html`,
    ],
  })

  document.addEventListener('contextmenu', function (e) {
    const caretPosition = document.caretPositionFromPoint(e.clientX, e.clientY)
    const range = document.createRange()
    range.setStart(caretPosition.offsetNode, caretPosition.offset)
    range.setEnd(caretPosition.offsetNode, caretPosition.offset)
    if (range) {
      range.expand('word')
      const selection = window.getSelection()
      selection.removeAllRanges()
      selection.addRange(range)
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
