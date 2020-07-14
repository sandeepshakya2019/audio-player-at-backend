var songlist = document.querySelectorAll('#songlist')
var songs = []
for(var i=0;i<songlist.length;i++){
	songs.push(songlist[i].textContent)
}


// console.log(songs)


var songTitle = document.getElementById('songTitle');
var songSlider = document.getElementById('songSlider');
var currentTime = document.getElementById('currentTime');
var duration = document.getElementById('duration');
var volumeSlider = document.getElementById('volumeSlider');
var nextSongTitle = document.getElementById('nextSongTitle');

var song = new Audio();
var currentSong = 0;

window.onload = loadSong;

function loadSong () {
	
	song.src = "upload/" + songs[currentSong];
	
    // console.log(song.src)
	songTitle.textContent = (currentSong + 1) + ". " + songs[currentSong];
	// console.log(currentSong)
	nextSongTitle.innerHTML = "<b>Next Song: </b>" + songs[currentSong + 1 % songs.length];
	song.playbackRate = 1;
	song.volume = volumeSlider.value;
	song.play();
	setTimeout(showDuration, 1000);
}

setInterval(updateSongSlider, 1000);

function updateSongSlider () {
    var c = Math.round(song.currentTime);
    // console.log(c)
	songSlider.value = c;
	currentTime.textContent = convertTime(c);
	if(song.ended){
		next();
	}
}



$(".get").click(function(event){
	var songname = event.currentTarget.textContent
	var found = songs.indexOf(songname);
	currentSong = found;
	// console.log(currentSong)
	loadSong()
	// console.log(songname)
	// playOrPauseSong (img)
	
})

function convertTime (secs) {
	var min = Math.floor(secs/60);
	var sec = secs % 60;
	min = (min < 10) ? "0" + min : min;
	sec = (sec < 10) ? "0" + sec : sec;
	return (min + ":" + sec);
}

function showDuration () {
	var d = Math.floor(song.duration);
	// console.log(d)
	songSlider.setAttribute("max", d);
	duration.textContent = convertTime(d);
}

function playOrPauseSong (img) {
	// console.log(img)
	song.playbackRate = 1;
	// console.log(song.paused)
	if(song.paused){
		// console.log("hello3")
		song.play();
		img.src = "images/pause.png";
	}else{
		song.pause();
		// console.log("hello4")
		img.src = "images/play.png";
	}
	
}

function next(){
    
    if (currentSong < songs.length - 1){
        currentSong = currentSong + 1 % songs.length;
        console.log(songs.length)
		loadSong();
		song.play();
    }
	
}

function previous () {
	currentSong--;
	currentSong = (currentSong < 0) ? songs.length - 1 : currentSong;
	loadSong();
	song.play();
}

function seekSong () {
	song.currentTime = songSlider.value;
	currentTime.textContent = convertTime(song.currentTime);
}

function adjustVolume () {
    song.volume = volumeSlider.value;
    console.log(song.volume)
}

function increasePlaybackRate () {
    song.playbackRate += 0.10;
    
}
function mute () {
    song.volume = 0;
    volumeSlider.value = 0;
    // console.log(song.volume)
}
function full () {
    song.volume = 1;
    volumeSlider.value = 1;
    // console.log(song.volume)
}

function decreasePlaybackRate () {
	song.playbackRate -= 0.10;
}
