_globals.core.__videoBackends.androidtv = function() { return _globals.androidtv.video }
_globals.core.__deviceBackend = function() { return _globals.androidtv.device }

exports.core.device = 1

document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
	_globals._context.system.vendor = device.manufacturer
}

document.addEventListener("click", handler, true);
function handler(e){
	e.stopPropagation();
	e.preventDefault();
}

window.cordovaExecCall = function(name, args, callback, error) {
	log("cordovaExecCall", name, "args", args)
	if (window.cordova) {
		window.cordova.exec(callback, error, "AndroidTV", name, args);
	} else {
		log("Cordova undefined error")
		error()
	}
};

log("AndroidTV initialized")
