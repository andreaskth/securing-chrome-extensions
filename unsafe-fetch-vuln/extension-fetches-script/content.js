/**
* Content-script that runs in URLs using http or https.
* (See https://stackoverflow.com/a/16096545 for regex in manifest.json)
*
* run_at is "document_idle", reference: https://developer.chrome.com/docs/extensions/mv3/content_scripts/#document_idle, possibly found here: https://stackoverflow.com/questions/6497548/chrome-extension-make-it-run-every-page-load
*/

// The body of this function will be executed as a content script inside the current page
function loadContent(extensionID) {
	
	chrome.runtime.sendMessage(extensionID, "message", function(response) {
		let div = document.createElement("div");
	    div.innerHTML = response;
	    document.getElementById("content").prepend(div)
	});
}

// Replace with the ID of this extension
extensionID = "acmpdjniidakjideolcdngjemchimkpl"
loadContent(extensionID)
