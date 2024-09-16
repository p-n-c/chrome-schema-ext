const generateTreeHtml = (tree) => {
  const children = tree?.children || []
  // Base case: if there are no children, return a div with just the tag name
  if (children?.length === 0) {
    return `<span data-id='${tree.id}'><div class='tag'>${tree.tag}</div></span>`
  }

  // Recursive case: create a details element with a summary and nested details
  let childrenHtml = ''
  for (const child of children) {
    childrenHtml += generateTreeHtml(child)
  }

  return `
    <details>
        <summary><span data-id='${tree.id}'>${tree.tag}</span></summary>
        ${childrenHtml}
    </details>
`
}

const generateSchemaHtml = (treeStructure) => {
  let htmlOutput = ''

  // Handle the case of multiple root elements
  for (const tree of treeStructure) {
    htmlOutput += generateTreeHtml(tree)
  }

  return htmlStringToDomElement(htmlOutput)
}
