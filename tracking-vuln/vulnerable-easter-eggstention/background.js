chrome.runtime.onInstalled.addListener(() => {

  var colleggtion = {
  	"yellow": 0,
  	"red": 0,
  	"green": 0,
  	"blue": 0,
  	"dragon": 0
  };
  chrome.storage.sync.set({ colleggtion });
});
