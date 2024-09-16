const htmlStringToDomElement = (htmlString) => {
  const container = document.createElement('div')
  container.innerHTML = htmlString.trim()
  return container
}

const getTitle = () => {
  return document.title
}

const simpleUid = () =>
  Date.now().toString(36) + Math.random().toString(36).substr(2)
