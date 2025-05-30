let currentSong = new Audio()
let songs
let currFolder

function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    // Format seconds to have a leading 0 whenever the seconds is less than 10
    const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
    return `${minutes}:${formattedSeconds}`;
}

async function getsongs(folder) {
    currFolder = folder
    let a = await fetch(`${folder}/`)
    let response = await a.text()
    // console.log(response);
    let div_created = document.createElement("div")
    div_created.innerHTML = response
    let a_in_div = div_created.getElementsByTagName("a")
    songs = []
    for (let i = 0; i < a_in_div.length; i++) {
        const element = a_in_div[i];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
                            <img class="invert" src="img/music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ").split(".m")[0]}</div>
                                <div>Anshar Khan</div>
                            </div>
                            <div class="playnow">
                                <img class="invert" src="img/play.svg" alt="">
                            </div>
                        </li>`
    }

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.getElementsByTagName("div")[0].firstElementChild.innerHTML)
        })
    })

    return songs
}

function playMusic(track, pause = false) {
    if (!track.endsWith(".mp3")) {
        currentSong.src = `/${currFolder}/` + track + ".mp3"
    } else {
        currentSong.src = `/${currFolder}/` + track
    }
    if (!pause) {
        currentSong.play()
        play.src = "img/pause.svg"
    }
    document.getElementsByClassName("songinfo")[0].innerHTML = decodeURI(track).split(".m")[0]
    document.getElementsByClassName("songtime")[0].innerHTML = "00:00 / 4:26"
}

async function displayAlbums() {
    let a = await fetch(`songs/`)
    let response = await a.text()
    let div_created = document.createElement("div")
    div_created.innerHTML = response
    let a_in_div = div_created.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(a_in_div)
    
    for (let i = 0; i < array.length; i++) {
        const e = array[i];
        if (e.href.includes("/songs")) {
            let folder = e.href.split(`/`).slice(-2)[0]
            // console.log("FOLDER IS",folder);
            let a = await fetch(`songs/${folder}/info.json`)
            let response = await a.json()
            console.log(response);
            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
            <div class="play">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36"
            fill="none">
            <circle cx="12" cy="12" r="10" stroke="#1ED760" stroke-width="1.5" fill="#1ED760" />
            <path
            d="M9.5 11.1998V12.8002C9.5 14.3195 9.5 15.0791 9.95576 15.3862C10.4115 15.6932 11.0348 15.3535 12.2815 14.6741L13.7497 13.8738C15.2499 13.0562 16 12.6474 16 12C16 11.3526 15.2499 10.9438 13.7497 10.1262L12.2815 9.32594C11.0348 8.6465 10.4115 8.30678 9.95576 8.61382C9.5 8.92086 9.5 9.6805 9.5 11.1998Z"
            fill="black" />
            </svg>
            </div>
            <img src="/songs/${folder}/cover.jpg" alt="">
            <h2>${response.title}</h2>
            <p>${response.description}</p>
            </div>`
        }
    }

    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        // console.log(e);
        e.addEventListener("click", async item => {
            console.log(item.currentTarget.dataset);
            songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])
        })
    })

}

async function main1() {
    await getsongs("songs/funny_clips")
    playMusic(songs[0], true)

    displayAlbums()

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "img/pause.svg"
        } else {
            currentSong.pause()
            play.src = "img/play.svg"
        }
    })

    currentSong.addEventListener("timeupdate", () => {
        // console.log(currentSong.currentTime, currentSong.duration);
        document.getElementsByClassName("songtime")[0].innerHTML = `${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (percent * currentSong.duration) / 100;
        // console.log(currentSong.duration);
    })

    document.querySelector(".hamburger").addEventListener("click", e => {
        document.querySelector(".left").style.left = "-10px"
    })

    document.querySelector(".close > img").addEventListener("click", e => {
        document.querySelector(".left").style.left = "-110%"
    })

    previous.addEventListener("click", e => {
        console.log("Previous Clicked");
        console.log(currentSong);
        console.log(`/${currFolder}/`);
        console.log(currentSong.src.split(`/${currFolder}/`)[1]);
        console.log(songs);
        console.log(songs.indexOf(currentSong.src.split(`/${currFolder}/`)[1]));
        let x = songs.indexOf(currentSong.src.split(`/${currFolder}/`)[1])
        if (x == 0) {
            playMusic(songs[songs.length - 1])
        } else {
            playMusic(songs[x - 1])
        }
    })  

    next.addEventListener("click", e => {
        console.log("Next Clicked");
        let x = songs.indexOf(currentSong.src.split(`/${currFolder}/`)[1])
        if (x == (songs.length - 1)) {
            playMusic(songs[0])
        } else {
            playMusic(songs[x + 1])
        }
    })

    volumeimg.addEventListener("click", e => {
        let xy = document.getElementsByClassName("bigvolseek")[0]
        volumeimg.style.display = "none"
        xy.style.display = "block"
        setTimeout(() => {
            if (xy.style.display == "block" && volumeimg.style.display == "none") {
                xy.style.display = "none"
                volumeimg.style.display = "block"
            }
        }, 7000);
    })
    
    let seekbar_2 = document.getElementsByClassName("volseek")[0]
    seekbar_2.addEventListener("click", e => {
        let percent = (e.offsetY / seekbar_2.offsetHeight) * 100
        document.getElementsByClassName("circle2")[0].style.top = `calc(${percent}% - 4px)`;
        currentSong.volume = percent/100;
    })
}

main1()