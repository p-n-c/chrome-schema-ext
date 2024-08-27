document.getElementById('generate-schema').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: () => {
        const treeStructure = parseHtmlDocumentInBrowser()
        const container = document.getElementById('schema')
        if (container) {
          const schema = generateSchema(treeStructure)
          container.appendChild(schema)
        } else {
          console.error("Element with id 'schema' not found.")
        }
      },
    })
  })
})
