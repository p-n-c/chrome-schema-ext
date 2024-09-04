chrome.runtime.onMessage.addListener((request) => {
  if (request.action === 'generateSchema') displaySchema()
})
