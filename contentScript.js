const displaySchema = () => {
  // Remove existing iframe
  document.getElementById('schema-iframe')?.remove()
  ;(async () => {
    const treeStructure = parseHtmlDocumentInBrowser()
    const container = document.getElementsByTagName('body')[0]

    const schema = generateSchema(treeStructure)

    // Add a container with a header
    const tree = htmlStringToDomElement(`
          <h3>Schema</h3>
          <div></div>      
    `)

    tree.querySelector('div').appendChild(schema)

    // Create an iframe
    const iframe = document.createElement('iframe')
    iframe.id = 'schema-iframe'
    iframe.style.position = 'fixed'
    iframe.style.top = '10%'
    iframe.style.left = '10%'
    iframe.style.width = '80%'
    iframe.style.height = '80%'
    iframe.style.zIndex = '10000'
    iframe.style.border = 'none'
    iframe.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)'
    iframe.style.borderRadius = '8px'

    // Append the iframe to the body
    document.body.appendChild(iframe)

    // Access the iframe's document and write the content
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document
    iframeDoc.open()
    iframeDoc.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Schema Output</title>
        <link rel="stylesheet" type="text/css" href="${chrome.runtime.getURL('iframeStyles.css')}">
      </head>
      <body>
        <h1>HTML Schema</h1>
        <button id="close-schema-iframe">Close</button>
        <button id="expand-schema">Expand</button>
        <button id="collapse-schema">Collapse</button>
        <div id="schema-content"></div>
        <script src="${chrome.runtime.getURL('iframeScript.js')}"></script>
      </body>
      </html>
    `)
    iframeDoc.close()

    // Insert the schema into the iframe's content
    const schemaContainer = iframeDoc.getElementById('schema-content')
    schemaContainer.appendChild(schema)
  })()
}
