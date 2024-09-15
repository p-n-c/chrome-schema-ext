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
  'label',
]

const landmarks = [
  'banner',
  'footer',
  'form',
  'header',
  'main',
  'navigation',
  'search',
]
const landmarkRoles = ['contentinfo', 'complementary', 'region']

const attributes = ['alt', 'id', 'class']

const isValidElement = (node) => {
  return node.nodeType === 1
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

const buildHtmlTree = (element) => {
  const node = createNode(element)

  // Recursively process each child element
  const children = element.children
  for (let child of children) {
    if (isValidNode(child)) {
      // Only process elements (ignore text, comments, etc.)
      node.children.push(buildHtmlTree(child))
    }
  }

  if (node.children.length === 0) {
    delete node.children
  }

  if (node.tag !== 'script') {
    return node
  }
}

const createNode = (element) => {
  const node = {
    tag: element.tagName.toLowerCase(),
    attribute: '',
    elementText: '',
    children: [],
  }

  // Add text for selected attributes, and show attribute name
  const match = matchFirstAttribute(attributes, element.getAttributeNames())
  if (match) {
    node.attribute = `${match}: ${element.getAttribute(match)}`
  }

  // Add text for selected elements
  const includeText = treeElementsWithText.includes(
    element.nodeName.toLowerCase()
  )
  if (includeText) {
    node.elementText = `${element.innerText}`
  }

  // Return the node
  return node
}

const isValidNode = (node) => {
  return isValidElement(node)
    ? treeElements.includes(node.tagName.toLowerCase())
    : false
}

const matchFirstAttribute = (attributes, matches) => {
  return attributes.find((attr) => matches.includes(attr))
}
