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

/*chrome.runtime.onMessage.addListener(() => {
  console.log("background.js received message")

  var xhr = new XMLHttpRequest();
  xhr.open("GET", "https://1e5f1a5da9f9.ngrok.io/hacker/test", true);
  xhr.send();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      console.log("xhr.responseText:")
      console.log(xhr.responseText)
    }
  }
});*/

// Detta har funkat
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("background.js received message")

  fetch('https://1e5f1a5da9f9.ngrok.io/fetch').then(r => r.text()).then(result => {
      console.log("result:")
      console.log(result)
      sendResponse(result)
  }).catch(error => console.log(error))
  return true;
});

/*chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.contentScriptQuery == 'fetchUrl') {
    fetch(request.url)
        .then(response => {response.text(); })
        .then(text => sendResponse(text))
        .catch(error => console.log(error))
    return true;  // Will respond asynchronously.
  }
});*/