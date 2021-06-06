
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("background.js received message")
  console.log(message)
  fetch(message).then(r => r.text()).then(result => {
      console.log("result:")
      console.log(result)
      sendResponse(result)
  }).catch(error => console.log(error))
  return true;
});
