
DEBUG = true;
let extensionID = "FILL_IN"
let cachedResponses = {}
let defaultWidth = "400px"
let defaultHeight = "400px"

addEventListener("message", function(event){
	if (event.data.url) {	
		console.log("Found url in data object")
		url = event.data.url;
		console.log(url)
		if (cachedResponses[url]) {
			console.log("Cached response: ")
			console.log(cachedResponses[url])
			if (event.data.inspect) {
				postMessage({"pagePreview": cachedResponses[url]}, "*")
			} else {
				event.content = cachedResponses[url]
				renderPreivew(event)
				//postMessage("Success", "*")
			}
		} else {
			chrome.runtime.sendMessage(extensionID, url, function(response) {
				console.log("Content script received response from background:")
				console.log(response)
				cachedResponses[url] = response
	
				if (event.data.inspect) {
					postMessage({"pagePreview": response}, "*")
				} else {
					event.content = response
					renderPreivew(event)
					//postMessage("Success", "*")
				}
			});
		}
	} else if (event.data.content) {
		renderPreivew(event)
		//postMessage("Success", "*")
	} else {
		// Not a valid event payload
		// This includes our own messages sent since we also catch them here it seems. 
	}
});

function renderPreivew(event) {
	let x = event.data.x ? event.data.x : this.window.innerWidth / 2
	let y = event.data.y ? event.data.y : this.window.innerHeight / 2
	let width = event.data.width ? event.data.width : defaultWidth
	let height = event.data.height ? event.data.height : defaultHeight
	// Create preview window
}
