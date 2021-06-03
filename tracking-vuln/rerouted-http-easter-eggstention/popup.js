chrome.storage.sync.get("colleggtion", function(result) {
	let colleggtion = result.colleggtion;

	document.getElementById("inv-yellow").textContent = "Yummy Yellow: " + colleggtion['yellow'];
	document.getElementById("inv-red").textContent = "Ridiculuous Red: " + colleggtion['red'];
	document.getElementById("inv-green").textContent = "Gluttonous Green: " + colleggtion['green'];
	document.getElementById("inv-blue").textContent = "Succulent Sapphire: " + colleggtion['blue'];
	document.getElementById("inv-dragon").textContent = "Illusive Dragon Egg: " + colleggtion['dragon'];
});