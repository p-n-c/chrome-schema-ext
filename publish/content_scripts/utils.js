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

const flashElement = (id) => {
  const dataAttribute = `data-${chrome.runtime.id}`
  const element = document.querySelector(`[${dataAttribute}="${id}"]`)
  if (!element) return

  element.scrollIntoView({ behavior: 'smooth', block: 'center' })

  // Get the exact dimensions and position of the element
  const rect = element.getBoundingClientRect()
  const padding = 10

  // Create a temporary element for the flash effect
  const flashElement = document.createElement('div')
  flashElement.style.position = 'fixed'
  flashElement.style.top = rect.top - padding + 'px'
  flashElement.style.left = rect.left - padding + 'px'
  flashElement.style.width = rect.width + padding * 2 + 'px'
  flashElement.style.height = rect.height + padding * 2 + 'px'
  flashElement.style.backgroundColor = 'rgba(128, 128, 128, 0.5'
  flashElement.style.border = '4px solid rgba(0, 0, 0, 1)'
  flashElement.style.boxSizing = 'border-box'
  flashElement.style.opacity = '0'
  flashElement.style.pointerEvents = 'none'
  flashElement.style.transition = 'opacity 0.3s ease'
  flashElement.style.zIndex = '2147483647' // Maximum z-index value

  // Add a non-breaking space to ensure the element is not considered "empty"
  flashElement.innerHTML = '&nbsp;'

  // Add the flash element to the body
  document.body.appendChild(flashElement)

  // Function to update position on scroll
  const updatePosition = () => {
    const updatedRect = element.getBoundingClientRect()
    flashElement.style.top = updatedRect.top - padding + 'px'
    flashElement.style.left = updatedRect.left - padding + 'px'
  }

  // Add scroll event listener
  window.addEventListener('scroll', updatePosition)

  // Trigger the flash effect
  requestAnimationFrame(() => {
    flashElement.style.opacity = '1'
    setTimeout(() => {
      flashElement.style.opacity = '0'
      // Remove the flash element and event listener after the animation
      setTimeout(() => {
        document.body.removeChild(flashElement)
        window.removeEventListener('scroll', updatePosition)
      }, 300) // Wait for fade-out transition
    }, 1000) // Flash duration
  })
}
