document.addEventListener('DOMContentLoaded', () => {
  console.log('Side panel DOM content loaded')
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
  schemaContainer.innerHTML = `${schemaHTML}`
}

function displayTitle(title) {
  const titleContainer = document.getElementById('title-content')
  titleContainer.innerHTML = `Page: ${title}`
}
