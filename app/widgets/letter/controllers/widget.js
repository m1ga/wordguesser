var args = $.args;
var letterStatus = -1; // 1 = letter at correct place, -1 = letter in word but at a different spot, 0 = letter not in word

if (args.letter) {
	$.lbl.text = args.letter;
	$.view.letter = args.letter;
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

exports.turn = function(_letterStatus) {
	//
	// turn letter to show result
	//
	letterStatus = _letterStatus;
	var matrix = Ti.UI.createMatrix2D();
	matrix = matrix.scale(0, 1);
	var ani = Ti.UI.createAnimation({
		transform: matrix,
		duration: 500,
	});
	$.view.animate(ani, function() {
		if (letterStatus == 1) {
			$.view.backgroundColor = "letterCorrect";
			$.lbl.color = "textCheck";
		} else if (letterStatus == -1) {
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
	} else if (val == -1) {
		if ($.view.backgroundColor != "letterCorrect") {
			$.view.backgroundColor = "letterInWord";
		}
	} else if (val == 0) {
		$.view.backgroundColor = "letterIncorrect";
	}
};
