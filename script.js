const wrapper = document.querySelector(".wrapper"),
musicImg = wrapper.querySelector(".img-area img"),
musicName = wrapper.querySelector(".song-details .name"),
musicArtist = wrapper.querySelector(".song-details .artist"),
mainAudio=wrapper.querySelector("#main-audio"),


playPauseBtn = wrapper.querySelector(".play-pause"),
prevBtn = wrapper.querySelector("#prev"),
nextBtn = wrapper.querySelector("#next"),


progressSlider = document.querySelector("#progress-slider"); // Updated to select slider


//loading random music
let musicIndex = 2;
window.addEventListener("load",()=> {
    loadMusic(musicIndex);
})

function loadMusic(indexNumb) {
    musicName.innerText = allMusic[indexNumb-1].name;
    musicArtist.innerHTML = allMusic[indexNumb-1].artist;
    musicImg.src= allMusic[indexNumb-1].img + ".jpg";
    mainAudio.src = allMusic[indexNumb-1].src + ".mp3";
}

//Play Music Function
function playMusic() {
    wrapper.classList.add("paused");
    playPauseBtn.querySelector("button").innerText = "pause";
    mainAudio.play();
}

function pauseMusic() {
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector("button").innerText = "play_arrow";
    mainAudio.pause();
}

//Play or Music Button Event
playPauseBtn.addEventListener("click",()=> {
    const isMusicPaused = wrapper.classList.contains("paused");
    isMusicPaused ? pauseMusic() : playMusic();
});

//Next Music Function
function nextMusic() {
    musicIndex++;
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
}


nextBtn.addEventListener("click",()=> {
    nextMusic();
});

//Previous Music Function
function prevMusic() {
    musicIndex--;
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
}


prevBtn.addEventListener("click",()=> {
    prevMusic();
});


//Update Progress Bar and Slider
mainAudio.addEventListener("timeupdate", (e) => {
    const currentTime = e.target.currentTime; // getting current time of song
    const duration = e.target.duration; // getting total duration of song

    // Update the slider max and value based on audio progress
    progressSlider.max = duration;
    progressSlider.value = currentTime;

    let musicCurrentTime = wrapper.querySelector(".current"),
        musicDuration = wrapper.querySelector(".duration");

    mainAudio.addEventListener("loadeddata", () => {
        let audioDuration = mainAudio.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if (totalSec < 10) {
            totalSec = `0${totalSec}`;
        }
        musicDuration.innerText = `${totalMin}:${totalSec}`;
    });

    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);
    if (currentSec < 10) {
        currentSec = `0${currentSec}`;
    }
    musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

// Update Playing Song Current Time According to the Slider Input
progressSlider.addEventListener("input", (e) => {
    mainAudio.currentTime = e.target.value;
});


//Work on  repeat, shuffle song according to the icon

const repeatBtn = wrapper.querySelector("#repeat-plist");

//To change the icon we will use the inner text of the icon
repeatBtn.addEventListener("click", () => {
    let getText = repeatBtn.innerText;//getting inner text of icon
    switch(getText) {
        case "repeat":
            repeatBtn.innerText = "repeat_one";
            repeatBtn.setAttribute("title", "Song looped");
            break;
        case "repeat_one":
            repeatBtn.innerText = "shuffle";
            repeatBtn.setAttribute("title", "Playback shuffle");
            break;
        case "shuffle":
            repeatBtn.innerText = "repeat";
            repeatBtn.setAttribute("title", "Playlist looped");
            break;
    }

});

//Above we just changed the icon but now lets work on the functionality of these icons
mainAudio.addEventListener("ended", () => {
    let getText = repeatBtn.innerText;
    switch(getText) {
        case "repeat": //if this is repeat then simply we will play next song
            nextMusic();
            break;
        case "repeat_one":
            mainAudio.currentTime = 0; //setting audio current time to 0
            loadMusic(musicIndex);
            playMusic();
            break;
        case "shuffle":
            //Generating random index between the max range of the allMusic length
            let randIndex = Math.floor((Math.random() * allMusic.length) + 1);
            do {
                randIndex = Math.floor((Math.random() * allMusic.length) + 1);
            } while (musicIndex == randIndex); // this loop run until the next random number is not equal to the current music index
            musicIndex = randIndex;
            loadMusic(musicIndex);
            playMusic();
            break;
    }
});