
DEBUG = true;
let extensionID = "ohjabgmhnncpbjfdcadngjfiolmicbgf"
let cachedResponses = {}
let defaultWidth = 400
let defaultHeight = 400
let inspectIDs = new Set()
let previewNum = 0

addEventListener("message", function(event){
	//console.log("Event")
	//console.log(event)

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

// https://stackoverflow.com/questions/442404/retrieve-the-position-x-y-of-an-html-element-relative-to-the-browser-window
// https://plainjs.com/javascript/styles/get-the-position-of-an-element-relative-to-the-document-24/
function offset(el) {
    var rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
}

async function setup() {
	let aTags = document.getElementsByTagName("a")
	for (let i = 0; i < aTags.length; i++) {
		let current = aTags[i]
		let content = await getPreviewContent(current.href)
		if (inspectIDs.has(current.id)) {
			postMessage({"id":current.id, "previewContent":content})
		}
		else {
			pos = offset(current)
			setPreview(
				current, 
				content, 
				{
					//left : (this.window.innerWidth / 2 - (defaultWidth / 2)) + "px", 
					//top : (this.window.innerHeight / 2 - (defaultHeight / 2)) + "px",
					left : (current.getBoundingClientRect().width + pos.left) + "px", 
					top : (current.getBoundingClientRect().height + pos.top) + "px",
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
		preview.style.position = "absolute"
		preview.style.left = style.left
		preview.style.top = style.top
		preview.style.width = style.width
		preview.style.height = style.height
		preview.style.backgroundColor = "white"
		document.body.prepend(preview)
		//preview.contentDocument.body.innerHTML = "Huh huh huh"
		console.log("Content to set in preview:")
		console.log(content)
		preview.contentDocument.write(content)
	}
	element.onmouseout = function() {
		document.getElementById(extensionID + "_preview_" + previewNum).remove()
	}
	previewNum++
}

async function getPreviewContent(url) {
	console.log("Get preview content for: " + url)
	if (cachedResponses[url]) {
		console.log("Cached response for: " + url)
		return cachedResponses[url];
	}
	else {
		return new Promise((resolve, reject) => {chrome.runtime.sendMessage(extensionID, url, function(response) {
			console.log("Content script received content from background (so not cached response)")
			cachedResponses[url] = response
			resolve(cachedResponses[url]);
		})});
	}
}

// https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
// https://stackoverflow.com/questions/28202736/how-to-execute-content-script-after-the-page-is-loaded-completely/28203168
window.addEventListener("load", async function load(event){
    window.removeEventListener("load", load, false); //remove listener, no longer needed
	postMessage({linkPreview:"init"}, "*")
	console.log("Wait 2 sec to see if webapp responds")
    await new Promise(r => setTimeout(r, 2000));
	console.log("Waiting done, received " + inspectIDs.size + " number of IDs the webapp wants to inspect.")
	setup()
},false);