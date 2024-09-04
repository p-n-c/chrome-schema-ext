document
  .getElementById('close-schema-iframe')
  .addEventListener('click', function () {
    window.parent.document.getElementById('schema-iframe').remove()
  })

document.getElementById('expand-schema').addEventListener('click', function () {
  document
    .querySelectorAll('details')
    .forEach((details) => (details.open = true))
})

document
  .getElementById('collapse-schema')
  .addEventListener('click', function () {
    document
      .querySelectorAll('details')
      .forEach((details) => (details.open = false))
  })
