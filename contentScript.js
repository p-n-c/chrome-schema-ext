chrome.runtime.onMessage.addListener((request) => {
  if (request.action === 'generateSchema') {

const treeElements = [
  'a',
  'address',
  'article',
  'aside',
  'blockquote',
  'button',
  'caption',
  'details',
  'dialog',
  'div',
  'dd',
  'dl',
  'dt',
  'fieldset',
  'figcaption',
  'figure',
  'footer',
  'form',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'header',
  'hgroup',
  'img',
  'input',
  'label',
  'legend',
  'li',
  'main',
  'menu',
  'nav',
  'ol',
  'option',
  'output',
  'picture',
  'p',
  'pre',
  'progress',
  'search',
  'select',
  'summary',
  'table',
  'td',
  'textarea',
  'tfoot',
  'th',
  'thead',
  'ul',
]

const treeElementsWithText = [
  'a',
  'button',
  'caption',
  'details',
  'figcaption',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'label'
]

const htmlStringToDomElement = (htmlString) => {
  const container = document.createElement('div')
  container.innerHTML = htmlString.trim()
  return container
}

const parseHtmlDocumentInBrowser = () => {
  // Initialize an empty array to store the parsed elements
  const treeStructure = []

  // Get all elements in the document
  const rootElements = Array.from(document.querySelector('body').children)

  // Process each root element
  for (let element of rootElements) {
    const tree = buildHtmlTree(element)
    if (tree) {
      treeStructure.push(tree)
    }
  }

  return treeStructure
}

const isValidElement = (node) => {
  return node.nodeType === 1
}

const isValidNode = (node) => {
  return isValidElement(node)
    ? treeElements.includes(node.tagName.toLowerCase())
    : false
}

const buildHtmlTree = (element) => {
  // Initialize an object to represent this element
  let includeText = treeElementsWithText.includes(element.nodeName.toLowerCase())
  let tree = includeText
  ? {
    tag: `${element.tagName.toLowerCase()} ${element.innerText}`,
    children: [],
  }
  : {
    tag: element.tagName.toLowerCase(),
    children: [],
  }

  // Recursively process each child element
  const children = element.children
  for (let child of children) {
    if (isValidNode(child)) {
      // Only process elements (ignore text, comments, etc.)      
      tree.children.push(buildHtmlTree(child))
    }
  }

  if (tree.children.length === 0) {
    delete tree.children
  }

  if (tree.tag !== 'script') {
    return tree
  }
}

const generateTrees = (tree) => {
  const children = tree?.children || []
  // Base case: if there are no children, return a div with just the tag name
  if (children?.length === 0) {
    return `<div class='tag'>${tree.tag}</div>`
  }

  // Recursive case: create a details element with a summary and nested details
  let childrenHtml = ''
  for (const child of children) {
    childrenHtml += generateTrees(child)
  }

  return `
      <details>
          <summary>${tree.tag}</summary>
          ${childrenHtml}
      </details>
  `
}

const generateSchema = (treeStructure) => {
  let htmlOutput = ''

  // Handle the case of multiple root elements
  for (const tree of treeStructure) {
    htmlOutput += generateTrees(tree)
  }

  return htmlStringToDomElement(htmlOutput)
}


(async () => {
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
})