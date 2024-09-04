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
