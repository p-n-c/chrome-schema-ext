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

const htmlStringToDomElement = (htmlString) => {
  const container = document.createElement('div')
  container.innerHTML = htmlString.trim()
  return container
}

export const parseHtmlDocumentInBrowser = () => {
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
  let tree = {
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
    return `<div>${tree.tag}</div>`
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

export const generateSchema = (treeStructure) => {
  let htmlOutput = ''

  // Handle the case of multiple root elements
  for (const tree of treeStructure) {
    htmlOutput += generateTrees(tree)
  }

  return htmlStringToDomElement(htmlOutput)
}
