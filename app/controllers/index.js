const maxLetter = $.rows.children[0].children.length;
var lang = Ti.Locale.currentLanguage;
var wordFile = "words_en";
if (lang == "de") {
	wordFile = "words_de";
}
const gameWords = require("/" + wordFile).words;
const checkWords = require("/" + wordFile).checkWords;
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
var checkedLetters = [];
const blockOpen = "⬛";
const blockRight = "🟩";
const blockOther = "🟪";
var blockString = "";

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
	blockString = "";
	$.btn_share.hide();

	for (var i = 0; i < word.length; ++i) {
		for (var r = 0; r < $.rows.children.length; ++r) {
			$.rows.children[r].children[i].reset();
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
		if (checkWords.indexOf(guessWord) > -1 || gameWords.indexOf(guessWord) > -1) {

			// find correctly places letters
			for (var i = 0; i < maxLetter; ++i) {
				if (clickedKeys[i].letter == word[i] && clickedKeys[i].letter != "") {
					letterStatus = 1;
					checkedLetters.push(clickedKeys[i].letter);
					$.rows.children[currentRow].children[i].turn(letterStatus);

					clickedKeys[i].setStatus(
						$.rows.children[currentRow].children[i].getStatus()
					);
				}
			}


			// find other letters
			for (var i = 0; i < maxLetter; ++i) {
				if (clickedKeys[i].letter == word[i] && clickedKeys[i].letter != "") {
					//
					letterStatus = 1;
					blockString += blockRight;
				} else if (word.indexOf(clickedKeys[i].letter) > -1) {

					var letterCount = _.filter(word, function(item) {
						return item == clickedKeys[i].letter
					}).length;

					var letterCheckedCount = _.filter(checkedLetters, function(item) {
						return item == clickedKeys[i].letter
					}).length;

					if (checkedLetters.indexOf(clickedKeys[i].letter) == -1) {

						// letter in word - first time
						letterStatus = -1;
						checkedLetters.push(clickedKeys[i].letter);
						blockString += blockOther;
					} else {
						// letter in word - but already found
						if (letterCheckedCount < letterCount) {
							// letter is there multiple times
							letterStatus = -1;
							checkedLetters.push(clickedKeys[i].letter);
							blockString += blockOther;
						} else {
							letterStatus = 2;
							blockString += blockOpen;
						}
					}
				} else {
					letterStatus = 0;
					blockString += blockOpen;
				}

				$.rows.children[currentRow].children[i].turn(letterStatus);

				clickedKeys[i].setStatus(
					$.rows.children[currentRow].children[i].getStatus()
				);
			}

			isCheck = !isCheck;
			currentLetter = 0;
			currentRow++;
			blockString += "\n";
			checkedLetters = [];

			if (word.toLowerCase() == guessWord.toLowerCase()) {
				// word is correct
				isActive = false;
				alert(L("foundIt"));

				if (OS_ANDROID) {
					// show share button on Android
					$.btn_share.show();
				}
			} else if (currentRow > $.rows.children.length - 1) {
				// game over
				isActive = false;
				alert(L("wordWas") + word);
			}
			guessWord = "";
			clickedKeys = [];
		} else {
			if (isActive) alert(L("notInList"));
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
		key.addEventListener("touchstart", onClickLetter);
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
	if (isActive && e.source.letter) {
		if (currentLetter < maxLetter) {
			clickedKeys.push(e.source);
			guessWord += e.source.letter.toLowerCase();
			$.rows.children[currentRow].children[currentLetter].setLetter(
				e.source.letter
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
		alert(L("wordWas") + word);
		init();
	}
}

init();
$.index.open();

function onClickShare(e) {
	var intent = Ti.Android.createIntent({
		action: Ti.Android.ACTION_SEND,
		type: "text/plain"
	});

	intent.putExtra(Ti.Android.EXTRA_TEXT, blockString);
	intent.addCategory(Ti.Android.CATEGORY_DEFAULT);
	try {
		Ti.Android.currentActivity.startActivity(intent);
	} catch (ex) {
		console.log("Error")
	}
}
