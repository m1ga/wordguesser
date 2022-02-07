var args = $.args;
var correctLetter = "";
var correctWord = "";
var letterStatus = -1; // 1 = letter at correct place, -1 = letter in word but at a different spot, 0 = letter not in word

if (args.correctLetter) {
	correctLetter = args.correctLetter;
}
if (args.letter) {
	$.lbl.text = args.letter;
}

if (args.isKeyboard) {
	// letter is a keyboard letter
	$.view.width = args.width - 2;
	$.view.height = 50;
	$.view.right = 2;
	$.view.backgroundColor = "letterKeyboard";
	$.view_border.borderWidth = 0;
} else {
	$.view.left = args.left;
	$.view.right = args.right;
	$.view.top = args.top;
}

exports.turn = function() {
	//
	// turn letter to show result
	//
	if ($.lbl.text == correctLetter && $.lbl.text != "") {
		letterStatus = 1;
	} else if (correctWord.indexOf($.lbl.text) > -1) {
		letterStatus = -1;
	} else {
		letterStatus = 0;
	}
	var matrix = Ti.UI.createMatrix2D();
	matrix = matrix.scale(0, 1);
	var ani = Ti.UI.createAnimation({
		transform: matrix,
		duration: 500,
	});
	$.view.animate(ani, function() {
		if ($.lbl.text == correctLetter && $.lbl.text != "") {
			$.view.backgroundColor = "letterCorrect";
			$.lbl.color = "textCheck";
		} else if (correctWord.indexOf($.lbl.text) > -1) {
			$.view.backgroundColor = "letterInWord";
			$.lbl.color = "textCheck";
		}
		var matrix = Ti.UI.createMatrix2D();
		matrix = matrix.scale(1, 1);
		var ani = Ti.UI.createAnimation({
			transform: matrix,
			duration: 500,
		});
		$.view.animate(ani);
	});
};
$.view.turn = exports.turn;

exports.reset = function() {
	//
	// reset letter
	//
	if (args.isKeyboard) {
		$.view.backgroundColor = "letterKeyboard";
		$.lbl.color = "letterKeyboardText";
	} else {
		var matrix = Ti.UI.createMatrix2D();
		matrix = matrix.scale(0, 1);
		var ani = Ti.UI.createAnimation({
			transform: matrix,
			duration: 500,
		});
		$.view.animate(ani, function() {

			$.lbl.text = "";
			$.lbl.color = "text";
			$.view.backgroundColor = "transparent";

			var matrix = Ti.UI.createMatrix2D();
			matrix = matrix.scale(1, 1);
			var ani = Ti.UI.createAnimation({
				transform: matrix,
				duration: 500,
			});
			$.view.animate(ani);
		});
	}
};
$.view.reset = exports.reset;

exports.setLetter = function(text) {
	$.lbl.text = text;
};
$.view.setLetter = exports.setLetter;

$.view.setTargetLetter = function(text) {
	correctLetter = text;
};
$.view.setTargetWord = function(text) {
	correctWord = text;
};
exports.addEventListener = function(fn, clb) {
	$.view.addEventListener(fn, clb);
};
$.view.getLetter = function() {
	return $.lbl.text;
};
$.view.getStatus = function() {
	return letterStatus;
};

$.view.setStatus = function(val) {
	if (val == 1) {
		$.view.backgroundColor = "letterCorrect";
	} else if (val == 0) {
		$.view.backgroundColor = "letterIncorrect";
	}
};
