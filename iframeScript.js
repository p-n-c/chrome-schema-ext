// iframeScript.js
document.getElementById('close-schema-iframe').addEventListener('click', function() {
  window.parent.document.getElementById('schema-iframe').remove()
})
