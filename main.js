let songs = []

// Get the hash of the url
const hash = window.location.hash
.substring(1)
.split('&')
.reduce(function (initial, item) {
  if (item) {
    var parts = item.split('=');
    initial[parts[0]] = decodeURIComponent(parts[1]);
  }
  return initial;
}, {});
window.location.hash = '';

// Set token
let _token = hash.access_token;

window.onload = () => {
  var tokenster = sessionStorage.getItem("token")
  console.log(window.location.pathname)
  if(!_token){
    if(tokenster){
      _token = tokenster
      if(window.location.pathname == "/"){
        history()
      }
      if(window.location.pathname == "/topArtists.html"){
        topArtists()
      }
      if(window.location.pathname == "/topSongs.html"){
        topSongs()

        window.onSpotifyWebPlaybackSDKReady = () => {
          const token = _token;
          const player = new Spotify.Player({
            name: 'SpotifyStats Web Player',
            getOAuthToken: cb => { cb(token); },
            volume: 0.5
          });

          player.addListener('ready', ({ device_id }) => {
            console.log('Ready with Device ID', device_id);
          });
      }
    }
      if(window.location.pathname == "/record/index.html"){
        record()
      }
      document.getElementById("login").onclick = signOut
      document.getElementById("login").innerText = "Sign Out"
    }
    else{
      document.getElementById("login").onclick = login
      document.getElementById("login").innerText = "Login"
    }
  }
  else{
    sessionStorage.setItem("token", _token)
    if(window.location.pathname == "/"){
      history()
    }
    if(window.location.pathname == "/topArtists.html"){
      topArtists()
    }
    document.getElementById("login").onclick = signOut
    document.getElementById("login").innerText = "Sign Out"
  }
}


function login(){

    const authEndpoint = 'https://accounts.spotify.com/authorize';

    // Replace with your app's client ID, redirect URI and desired scopes
    const clientId = 'f4313d45a01f48ed9999e3666bfbf666';
    const redirectUri = 'http://localhost:5500/';
    const scopes = [
      'user-top-read',
      'user-modify-playback-state',
      'user-read-playback-state',
      'user-read-currently-playing',
      'user-follow-modify',
      'user-follow-read',
      'user-read-recently-played',
      'user-read-playback-position',
      'user-top-read',
      'playlist-read-collaborative',
      'playlist-modify-public',
      'playlist-read-private',
      'playlist-modify-private',
      'user-library-modify',
      'user-library-read'
    ];

    
    // If there is no token, redirect to Spotify authorization
    if (!_token) {
      console.log("yummy")
      window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token&show_dialog=true`;
        
    }
}

function signOut(){
  window.location = "./"
  sessionStorage.clear("token")
}

async function history(){
    if(!_token){
        login()
    }
    else{
        $.ajax({
            url: "https://api.spotify.com/v1/me/player/recently-played?limit=25",
            type: "GET",
            beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + _token );},
            success: function(data) { 
              // Do something with the returned data
              data.items.forEach((item) => {
                songs[item.track.id] = item
                let date = new Date(item["played_at"])
                let minute = date.getMinutes()
                let second = date.getSeconds()
                let hour = date.getHours()
                if (minute < 10){
                  minute = "0" + minute
                }
                if (second < 10){
                  second = "0" + second
                }
                if (hour < 10){
                  hour = "0" + hour
                }
                makeRow(item.track.name, item.track.artists[0].name, item.track.album.images[2].url, (date.getMonth() + 1) + "-" + date.getDay() + "-" + date.getFullYear() + " " + hour + ":" + minute + ":" + second, item.track.id)
              })

              $.ajax({
                url: data.next,
                type: "GET",
                beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + _token );},
                success: function(james) { 
                  // Do something with the returned data
                  james.items.forEach((item) => {
                    songs[item.id] = item
                    let date = new Date(item["played_at"])
                    let minute = date.getMinutes()
                    let second = date.getSeconds()
                    let hour = date.getHours()
                    if (minute < 10){
                      minute = "0" + minute
                    }
                    if (second < 10){
                      second = "0" + second
                    }
                    if (hour < 10){
                      hour = "0" + hour
                    }
                    makeRow(item.track.name, item.track.artists[0].name, item.track.album.images[2].url, (date.getMonth() + 1) + "-" + date.getDay() + "-" + date.getFullYear() + " " + hour + ":" + minute + ":" + second, item.track.id)
                  })
                }
             });
            }
         });
    }
}

let firstRow = true;

function makeRow(name, artist, url, time, id){
    if(firstRow == true){
      firstRow = false
      let orig = document.getElementById("original")
      orig.onclick = (e) => {
        showSong(id)
      }
      orig.children[0].innerText = `${name}`
      orig.children[1].innerText = `${artist}`
      orig.children[2].innerHTML = `<img src="${url}">`
      orig.children[3].innerText = `${time}`
    }
    else{
      let copy = document.getElementById("original").cloneNode(true)
      copy.onclick = (e) => {
        showSong(id)
      }
      copy.children[0].innerText = `${name}`
      copy.children[1].innerText = `${artist}`
      copy.children[2].innerHTML = `<img src="${url}">`
      copy.children[3].innerText = `${time}`
      console.log(copy.children.length)

      document.getElementById("history").appendChild(copy)
    }
}

function showSong(id){
  let dialog = document.getElementById("dialog")
  let songName = dialog.querySelector("#songName")
  let artistName = dialog.querySelector("#artistName")
  let streams = dialog.querySelector("#streams")
  let playButton = dialog.querySelector("#playButton")
  let popularity = parseFloat(songs[id].track.popularity)
  let ratio = popularity/100
  let r = (1.3 - ratio) * 255
  let g = ratio * 255
  let b = 0

  songName.innerText = songs[id].track.name
  artistName.innerText = songs[id].track.artists[0].name
  streams.innerText = songs[id].track.popularity
  streams.style.color = `rgb(${r},${g},${b})`

  dialog.onclick = (e) =>{
      let box = dialog.getBoundingClientRect()
      let x = e.clientX
      let y = e.clientY

      if(x > box.left && x < box.right && y < box.bottom && y > box.top){
          return
      }
      else{
          dialog.close()
      }
  }
  dialog.removeAttribute("hidden")

  playButton.onclick = (e) =>{
      let url = ""
      if(hasPremium == false){
        url = "https://music.youtube.com/search?q=" + songs[id].track.name
      }
      else{
        url = "https://open.spotify.com/"

        $.ajax({
          url: "https://api.spotify.com/v1/me/player/devices",
          type: "GET",
          beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + _token );},
          success: function(data) { 
            console.log(data)
          }
      });
      }

      window.open(url)
  }

  dialog.showModal()
}