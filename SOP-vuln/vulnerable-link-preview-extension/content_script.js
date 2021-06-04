
DEBUG = true;
let extensionID = "ohjabgmhnncpbjfdcadngjfiolmicbgf"
let cachedResponses = {}
let defaultWidth = 400
let defaultHeight = 400
let inspectIDs = new Set()
let previewNum = 0

addEventListener("message", function(event){
	console.log("Event")
	console.log(event)

	if (event.data.inspectList) {
		for (let i = 0; i < event.data.inspectList.length; i++) {
			inspectIDs.add(event.data.inspectList[i])
		}
		console.log("Inspect IDs updated:")
		console.log(inspectIDs)
	} 
	else if (event.data.addPreviewList) {	
		let ids = event.data.addPreviewList
		console.log("Adding preview to:")
		console.log(ids)
		
		
			
		let x = event.data.x ? event.data.x : this.window.innerWidth / 2
		let y = event.data.y ? event.data.y : this.window.innerHeight / 2
		let width = event.data.width ? event.data.width : defaultWidth
		let height = event.data.height ? event.data.height : defaultHeight
	}
	else {
		// Not a valid event payload
		// This includes our own messages sent since we also catch them here it seems. 
	}
});

function setup() {
	let aTags = document.getElementsByTagName("a")
	for (let i = 0; i < aTags.length; i++) {
		let current = aTags[i]
		let content = getPreviewContent(current.href)
		if (inspectIDs.has(current.id)) {
			postMessage({"id":current.id, "content":content})
		}
		else {
			setPreview(
				current, 
				content, 
				{
					left : (this.window.innerWidth / 2 - (defaultWidth / 2)) + "px", 
					top : (this.window.innerHeight / 2 - (defaultHeight / 2)) + "px",
					width : defaultWidth + "px", 
					height : defaultHeight + "px"
				}
			)
		}
	}
}

function setPreview(element, content, style) {
	// https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseenter_event
	element.onmouseover = function() {
		let preview = document.createElement("iframe")
		preview.id = extensionID + "_preview_" + previewNum
		//preview.innerHTML = content
		preview.style.position = "absolute"
		preview.style.left = style.left
		preview.style.top = style.top
		preview.style.width = style.width
		preview.style.height = style.height
		preview.style.backgroundColor = "red"
		document.body.prepend(preview)
		preview.contentDocument.body.innerHTML = "Huh huh huh"
		console.log("Style set:")
		console.log(preview.style)
	}
	element.onmouseout = function() {
		document.getElementById(extensionID + "_preview_" + previewNum).remove()
	}
	previewNum++
}

function getPreviewContent(url) {
	console.log(url)
	if (cachedResponses[url]) {
		console.log("Cached response: ")
		console.log(cachedResponses[url])
		return cachedResponses[url];
	}
	else {
		chrome.runtime.sendMessage(extensionID, url, function(response) {
			console.log("Content script received response from background:")
			console.log(response)
			cachedResponses[url] = response
			return cachedResponses[url]
		});
	}
}

// https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
// https://stackoverflow.com/questions/28202736/how-to-execute-content-script-after-the-page-is-loaded-completely/28203168
window.addEventListener("load", async function load(event){
    window.removeEventListener("load", load, false); //remove listener, no longer needed
	postMessage({linkPreview:"init"}, "*")
    await new Promise(r => setTimeout(r, 2000));
	if (inspectIDs.size == 0) {
		console.log("No length...")
	}
	console.log("Inspect IDs")
	console.log(inspectIDs)
	setup()
},false);