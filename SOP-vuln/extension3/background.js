let color = '#3aa757';

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color });
  console.log('Default background color set to %cgreen', `color: ${color}`);

  var colleggtion = {
  	"yellow": 0,
  	"red": 0,
  	"green": 0,
  	"blue": 0,
  	"dragon": 0
  };
  chrome.storage.sync.set({ colleggtion });
});

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