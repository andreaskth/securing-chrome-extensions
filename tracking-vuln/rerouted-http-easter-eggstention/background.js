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