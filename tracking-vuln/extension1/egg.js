let imageSrc = "http://fe815b974335.ngrok.io" + "/images/"

let eggNames = {
	"yellow": "Yummy Yellow",
	"red": "Ridiculous Red",
	"green": "Gluttonous Green",
	"blue": "Succulent Sapphire",
	"dragon": "The Illusive Dragon Egg"
};


// Spawn random egg from collection
// Yummy Yellow: 24%
// Ridiculous Red 24%
// Gluttonous Green 24%
// Succulent Sapphire: 24%
// Dragon Egg: 4%
var color;
let r = Math.random();

// https://stackoverflow.com/a/12259830
if (r <= .24) { color = "yellow"; } else
if (r <= .48) { color = "red"; } else
if (r <= .72) { color = "green"; } else
if (r <= .96) { color = "blue"; } else
{ color = "dragon"; }

// Spawn at random location (top/bottom right/left)
let position = Math.floor(Math.random()*4) // [0,3], Math.random is [0,1)

addEggToPage(color, position);


// The body of this function will be executed as a content script inside the current page
function addEggToPage(color, position) {
	let egg = document.createElement("img"); 
	egg.src=imageSrc + color + "_egg.png"
	egg.id="eggstention-egg";
	egg.alt="easter egg"; // Prevents img from blurring on certain sites
	
	// https://stackoverflow.com/q/3616572 for placement in a corner
	egg.style.cursor = "pointer";
	egg.style.position = "fixed";
	egg.style.margin = "1em";
	egg.style.zIndex = "2147483647"; // To always place egg in front of everything else (https://www.digitalocean.com/community/tutorials/css-z-index)

	switch (position) {
		case 0: // Top left
			// Nothing to do, this is default case.
			break;
		case 1: // Top right
			egg.style.right = 0;
			break;
		case 2: // Bottom left
			egg.style.bottom = 0;
			break;
		case 3: // Bottom right
			egg.style.right = 0;
			egg.style.bottom = 0;
			break;
	}

	// https://stackoverflow.com/a/43838105 and https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/prepend for 'prepend'
	//document.documentElement.prepend(egg); // https://developer.mozilla.org/en-US/docs/Web/API/Document/documentElement to get root-element
	document.body.prepend(egg);

	egg.addEventListener("click", async (event) => {
		collectEgg(color);
  		egg.remove();
	});
}

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