/**
* Content-script that runs in URLs using http or https.
* (See https://stackoverflow.com/a/16096545 for regex in manifest.json)
*
* run_at is "document_idle", reference: https://developer.chrome.com/docs/extensions/mv3/content_scripts/#document_idle, possibly found here: https://stackoverflow.com/questions/6497548/chrome-extension-make-it-run-every-page-load
*/

// The body of this function will be executed as a content script inside the current page
function addEggToPage(color) {

	/*var xhr = new XMLHttpRequest();
	xhr.open("GET", "https://1e5f1a5da9f9.ngrok.io/fetch", true);
	xhr.send();
	xhr.onreadystatechange = function() {
	  if (xhr.readyState == 4) {

	  	console.log("xhr.responseText:")
	  	console.log(xhr.responseText)

	  	let div = document.createElement("div");
	    div.innerHTML = xhr.responseText;
	    document.getElementById("content").prepend(div)
	  }
	}*/

	chrome.runtime.sendMessage("gmfhcigefoknbfinidlcgepgnfeiemei", "message", function(response) {
		var received_response = response;
		//console.log("received_response:")
		//console.log(received_response)

		let div = document.createElement("div");
	    div.innerHTML = received_response;
	    document.getElementById("content").prepend(div)
	});

	/*chrome.runtime.sendMessage(
    {contentScriptQuery: 'fetchUrl',
     url: 'https://1e5f1a5da9f9.ngrok.io/fetch"'},
    response => console.log(response));*/

	let egg = document.createElement("img"); // https://stackoverflow.com/a/2735894 to create img-tag

	egg.src=chrome.runtime.getURL("images/eggs/" + color + ".png");
	
	egg.id="eggstention-egg";
	egg.alt="easter egg"; // Prevents img from blurring on certain sites
	
	// https://stackoverflow.com/q/3616572 for placement in a corner
	egg.style.cursor = "pointer";
	egg.style.position = "fixed";
	egg.style.margin = "1em";
	egg.style.zIndex = "2147483647"; // To always place egg in front of everything else (https://www.digitalocean.com/community/tutorials/css-z-index)

	// https://stackoverflow.com/a/43838105 and https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/prepend for 'prepend'
	//document.documentElement.prepend(egg); // https://developer.mozilla.org/en-US/docs/Web/API/Document/documentElement to get root-element
	//document.body.prepend(egg);

	egg.addEventListener("click", async (event) => {
		collectEgg(color);
  		egg.remove();
	});
}

addEggToPage("dragon")

/*
Source: https://www.w3schools.com/howto/howto_css_modals.asp
<div id="myModal" class="modal">

  <!-- Modal content -->
  <div class="modal-content">
    <div class="modal-header">
      <span class="close">&times;</span>
      <h2 style="text-align:center">You found a new egg!</h2>
    </div>
    <div class="modal-body">
      <p>Add image of egg here...</p>
    </div>
    <div class="modal-footer">
      <h3 style="text-align:center">Click here to show your colleggtion</h3>
    </div>
  </div>

</div>
*/
function collectEgg(color) {
	console.log("Collecting egg");

	chrome.storage.sync.get("colleggtion", function(result) {
		let colleggtion = result.colleggtion;

		colleggtion[color] = colleggtion[color] + 1;
		chrome.storage.sync.set({ colleggtion });
	});

	let div1 = document.createElement("div"); // modal
	div1.id = "myModal";

	div1.style.display = "block";
	div1.style.position = "fixed";
	div1.style.zIndex = "2147483647";
	div1.style.paddingTop = "100px";
	div1.style.left = 0;
	div1.style.top = 0;
	div1.style.width = "100%";
	div1.style.height = "100%";
	div1.style.overflow = "auto";
	div1.style.backgroundColor = "rgb(0,0,0)";
	div1.style.backgroundColor = "rgba(0,0,0,0.4)";

	document.body.append(div1);

	let div2 = document.createElement("div"); // modal-content

	div2.style.position = "relative";
	div2.style.backgroundColor = "#fefefe";
	div2.style.margin = "auto";
	div2.style.padding = 0;
	div2.style.border = "1 px solid #888";
	div2.style.width = "80%";
	div2.style.boxShadow = "0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19)";
	div2.style.webkitAnimationName = "animatetop";
	div2.style.webkitAnimationDuration = "0.4s";
	div2.style.animationName = "animatetop";
	div2.style.animationDuration = "0.4s";

	div1.append(div2);

	let div3 = document.createElement("div"); // modal-header

	div3.style.padding = "2px 16px";
	div3.style.backgroundColor = "#fdd92e";
	div3.style.color = "white";

	div2.append(div3);

	span1 = document.createElement("span"); // close button span

	span1.textContent = "X"; // https://stackoverflow.com/a/1358815

	span1.style.color = "mediumblue";
	span1.style.float = "right";
	span1.style.fontSize = "28px";
	span1.style.fontWeight = "bold";
	span1.style.cursor = "pointer";

	// When the user clicks on <span> (x), close the modal
	span1.onclick = function() {
	  div1.style.display = "none";
	};

	div3.append(span1);

	let h2 = document.createElement("h2"); // "...new egg!"-header
	h2.textContent = "You found a new egg!";
	h2.style.color = "mediumblue";
	h2.style.textAlign = "center";

	div3.append(h2);

	let div4 = document.createElement("div"); // modal-body
	div4.style.padding = "2px 16px";
	div4.style.textAlign = "center";
	div2.append(div4);

	let egg = document.createElement("img");
	egg.src=chrome.runtime.getURL("images/eggs/" + color + ".png");
	egg.style.marginTop = "10px";
	egg.alt="easter egg";
	div4.append(egg);
	let p = document.createElement("p");
	p.textContent = "Added '" + eggNames[color] + "' x1 to inventory";
	p.style.color = "mediumblue";
	div4.append(p);

	let div5 = document.createElement("div"); // modal-footer
	div5.style.padding = "1px 16px";
	div5.style.backgroundColor = "#fdd92e";
	div5.style.color = "mediumblue";
	div2.append(div5);

	let h3 = document.createElement("h3");
	h3.textContent = "Click the extension icon to see your colleggtion";
	h3.style.textAlign = "center";
	div5.append(h3);
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  let modal = document.getElementById("myModal");
  if (event.target == modal) {
    modal.style.display = "none";
  }
}