const maxLetter = $.rows.children[0].children.length;
const gameWords = require("/words").words;
const checkWords = require("/words").checkWords;
const keyboard = "QWERTZUIOP|ASDFGHJKL|YXCVBNM";
var keyboardLetterWidth = Math.floor(Alloy.Globals.WIDTH / keyboard.split("|")[0].length);
var isCheck = false;
var currentLetter = 0;
var currentRow = 0;
var isActive = true;
var guessWord = "";
var word = "";
var clickedKeys = [];
var keyObjects = [];

function init() {
	//
	// initialize the game - new word, reset variables and board
	//
	word = gameWords[Math.floor(gameWords.length * Math.random())].toUpperCase();
	clickedKeys = [];
	currentRow = 0;
	currentLetter = 0;
	isCheck = false;
	isActive = true;
	guessWord = "";

	for (var i = 0; i < word.length; ++i) {
		for (var r = 0; r < $.rows.children.length; ++r) {
			$.rows.children[r].children[i].reset();
			$.rows.children[r].children[i].setTargetWord(word);
			$.rows.children[r].children[i].setTargetLetter(word[i]);
		}
	}

	for (var i = 0; i < keyObjects.length; ++i) {
		keyObjects[i].reset();
	}
}


function onClickCheck(e) {
	//
	// check word
	//
	if (currentLetter == maxLetter) {
		if (checkWords.indexOf(guessWord) > -1) {
			for (var i = 0; i < maxLetter; ++i) {
				$.rows.children[currentRow].children[i].turn();

				clickedKeys[i].setStatus(
					$.rows.children[currentRow].children[i].getStatus()
				);
			}

			isCheck = !isCheck;
			currentLetter = 0;
			currentRow++;
			guessWord = "";
			clickedKeys = [];

			if (word.toLowerCase() == guessWord.toLowerCase()) {
				// word is correct
				isActive = false;
				alert("You've found it!");
			} else if (currentRow > $.rows.children.length - 1) {
				// game over
				isActive = false;
				alert("The word was: " + word);
			}
		} else {
			if (isActive) alert("Word not in word list.");
		}
	}
}


// create keyboard
var letterRow = Ti.UI.createView({
	height: Ti.UI.SIZE,
	width: Ti.UI.SIZE,
	layout: "horizontal",
	bottom: 5,
});
$.view_keyboard.add(letterRow);
for (var i = 0; i < keyboard.length; ++i) {
	if (keyboard[i] != "|") {
		var key = Alloy.createWidget("letter", {
			letter: keyboard[i],
			isKeyboard: true,
			width: keyboardLetterWidth
		});
		letterRow.add(key.getView());
		key.addEventListener("click", onClickLetter);
		keyObjects.push(key);
	} else {
		letterRow = Ti.UI.createView({
			height: Ti.UI.SIZE,
			width: Ti.UI.SIZE,
			layout: "horizontal",
			bottom: 5,
		});
		$.view_keyboard.add(letterRow);
	}
}

function onClickLetter(e) {
	//
	// click on a keyboard letter
	//
	if (isActive) {
		if (currentLetter < maxLetter) {
			clickedKeys.push(e.source);
			guessWord += e.source.getLetter().toLowerCase();
			$.rows.children[currentRow].children[currentLetter].setLetter(
				e.source.getLetter()
			);
			currentLetter++;
		}
	}
}

function onClickBack(e) {
	//
	// remove last letter
	//
	if (isActive) {
		if (currentLetter > 0) {
			currentLetter--;
			$.rows.children[currentRow].children[currentLetter].setLetter("");
			clickedKeys.pop();
			guessWord = guessWord.slice(0, -1);
		}
	}
}

function onClickNew(e) {
	if (isActive) {
		$.dialog.show();
	} else {
		init();
	}
}


function onClickDialog(e) {
	if (e.index == 0) {
		// start a new game
		alert("The word was:" + word);
		init();
	}
}

init();
$.index.open();
