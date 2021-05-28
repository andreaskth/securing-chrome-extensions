chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

  // Replace with the URL of the web-server of the content provider
  contentURL = 'https://d6ecc19b8dc0.ngrok.io/fetch'

  fetch(contentURL).then(r => r.text()).then(result => {
      sendResponse(result)
  }).catch(error => console.log(error))
  
  return true; // https://stackoverflow.com/a/62607033 for 'return true' (this makes it respond asynchronously, to avoid error)
});