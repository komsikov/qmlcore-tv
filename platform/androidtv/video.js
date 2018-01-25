var Player = function(ui) {
	this._ui = ui

	this._keyMap = {
		'KEYCODE_BACK': 'Back',
		'KEYCODE_DPAD_UP': 'Up',
		'KEYCODE_DPAD_LEFT': 'Left',
		'KEYCODE_DPAD_DOWN': 'Down',
		'KEYCODE_DPAD_RIGHT': 'Right',
		'KEYCODE_DPAD_CENTER': 'Select',
		'KEYCODE_MEDIA_PLAY_PAUSE': 'Pause'
	}

	var self = this
	ui.setMovie = function(movie) {
		self._movie = movie
	}.bind(this)

	ui.setControlIcons = function(controls) {
		self._controlIcons = controls
	}.bind(this)
}

Player.prototype.setSource = function(value) {
	log("set source", value)
}

Player.prototype.play = function() {
	var ui = this._ui

	if (ui.paused) {
		log("PLAY")
		ExoPlayer.playPause()
		return
	}

	var exo = ExoPlayer
	var self = this
	log("Play URL:", ui.source)
	ui.ready = false
	var movie = this._movie
	var controllerConfig = { }

	if (movie)
		controllerConfig = {
			streamImage: movie.baseUrl + (movie.horizontal ? movie.horizontal.image_15x : (movie.packshot ? movie.packshot.image_15x : (movie.thumbnail ? movie.thumbnail.image_15x : ""))),
			streamTitle: movie.title,
			streamDescription: movie.description,
			hideProgress: false,
			hidePosition: false,
			hideDuration: false,
			controlIcons: this._controlIcons || { }
		}

	ExoPlayer.show(
		{
			url: ui.source,
			autoPlay: ui.autoPlay,
			controller: controllerConfig
		},
		function(event) {
			if (event.eventAction == "ACTION_UP") {
				log("EventKeyCode " + event.eventKeycode)
				switch (event.eventKeycode) {
					case 'KEYCODE_BACK':
					case 'KEYCODE_ESCAPE':
						exo.close()
						break
					case 'KEYCODE_DPAD_LEFT':
						exo.seekTo(self._position - 30000)
						break
					case 'KEYCODE_DPAD_RIGHT':
						exo.seekTo(self._position + 30000)
						break
					case 'KEYCODE_DPAD_CENTER':
					case 'KEYCODE_MEDIA_PLAY_PAUSE':
						if (ui.ready)
							exo.playPause()
						break
				}
				ExoPlayer.showController()
			}

			exo.getState(
				function(e) {
					log("Player event", e)
					ui.duration = e.duration
					self._position = parseInt(e.position)
					if (ui.duration > 0)
						ui.ready = true
					var state = e.playbackState
					if (state == "STATE_ENDED") {
						exo.close()
						ui.finished()
					}
				},
				function(e) { log("Failed to get state", e)}
			)
		},
		function(err) {
			console.log("Video error:", err);
			ui.error(err)
		}
	);
}

Player.prototype.setVisibility = function(visible) {
}

Player.prototype.pause = function() {
}

Player.prototype.stop = function() {
}

Player.prototype.seek = function(delta) {
}

Player.prototype.seekTo = function(tp) {
}

Player.prototype.setVolume = function(volume) {
}

Player.prototype.setMute = function(muted) {
}

Player.prototype.setRect = function(l, t, r, b) {
}

Player.prototype.setBackgroundColor = function(color) {
}

exports.createPlayer = function(ui) {
	return new Player(ui)
}

exports.probeUrl = function(url) {
	return 75
}
