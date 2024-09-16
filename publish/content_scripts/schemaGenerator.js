const generateTreeHtml = (tree) => {
  const children = tree?.children || []
  const button = `<button type='button' title='Highlight in page' id='${tree.id}' class='highlight-button'>🖍</button>`
  // Base case: if there are no children, return a div with just the tag name
  if (children?.length === 0) {
    return `<div class='tag'>${button} ${tree.tag}</div>`
  }

  // Recursive case: create a details element with a summary and nested details
  let childrenHtml = ''
  for (const child of children) {
    childrenHtml += generateTreeHtml(child)
  }

  return `
    <details>
        <summary>${button} ${tree.tag}</summary>
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
