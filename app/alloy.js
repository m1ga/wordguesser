var pw = Ti.Platform.displayCaps.platformWidth;
var ph = Ti.Platform.displayCaps.platformHeight;
var ldi = Ti.Platform.displayCaps.logicalDensityFactor;

Alloy.Globals.WIDTH = (OS_ANDROID) ? pw / ldi : pw;
Alloy.Globals.HEIGHT = (OS_ANDROID) ? ph / ldi : ph;
