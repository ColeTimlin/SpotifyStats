songs = []
let songOrder = []
let duration = "1 Month"

async function topSongs() {
    if (!_token) {
        login()
    }
    else {
        checkPremium()
        songs["All Time"] = []
        songOrder["All Time"] = []
        $.ajax({
            url: "https://api.spotify.com/v1/me/top/tracks?limit=50&offset=0&time_range=long_term",
            type: "GET",
            beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', 'Bearer ' + _token); },
            success: function (data) {
                // Do something with the returned data
                var i = 0;
                data.items.forEach((item) => {
                    i = i + 1;
                    songs["All Time"][item.id] = item
                    songOrder["All Time"].push(item.id)
                })

                $.ajax({
                    url: "https://api.spotify.com/v1/me/top/tracks?limit=50&offset=49&time_range=long_term",
                    type: "GET",
                    beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', 'Bearer ' + _token); },
                    success: function (james) {
                        console.log(james)
                        // Do something with the returned data
                        var i = 50;
                        var last = ""
                        james.items.forEach((item) => {
                            if(i == 50){
                                last = "lt"
                                i = i + 1;
                            }
                            else{
                                songs["All Time"][item.id] = item
                                songOrder["All Time"].push(item.id)
                                i = i + 1;
                            }
                        })
                    }
                });
            }
        });
        songs["6 Months"] = []
        songOrder["6 Months"] = []
        $.ajax({
            url: "https://api.spotify.com/v1/me/top/tracks?limit=50&offset=0&time_range=medium_term",
            type: "GET",
            beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', 'Bearer ' + _token); },
            success: function (data) {
                // Do something with the returned data
                var i = 0;
                data.items.forEach((item) => {
                    i = i + 1;
                    songs["6 Months"][item.id] = item
                    songOrder["6 Months"].push(item.id)
                })

                $.ajax({
                    url: "https://api.spotify.com/v1/me/top/tracks?limit=50&offset=49&time_range=long_term",
                    type: "GET",
                    beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', 'Bearer ' + _token); },
                    success: function (james) {
                        console.log(james)
                        // Do something with the returned data
                        var i = 50;
                        var last = ""
                        james.items.forEach((item) => {
                            if(i == 50){
                                last = "lt"
                                i = i + 1;
                            }
                            else{
                                songs["6 Months"][item.id] = item
                                songOrder["6 Months"].push(item.id)
                                i = i + 1;
                            }
                        })
                    }
                });
            }
        });
        songs["1 Month"] = []
        songOrder["1 Month"] = []
        $.ajax({
            url: "https://api.spotify.com/v1/me/top/tracks?limit=50&offset=0&time_range=short_term",
            type: "GET",
            beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', 'Bearer ' + _token); },
            success: function (data) {
                // Do something with the returned data
                var i = 0;
                data.items.forEach((item) => {
                    i = i + 1;
                    songs["1 Month"][item.id] = item
                    songOrder["1 Month"].push(item.id)
                })

                $.ajax({
                    url: "https://api.spotify.com/v1/me/top/tracks?limit=50&offset=49&time_range=short_term",
                    type: "GET",
                    beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', 'Bearer ' + _token); },
                    success: function (james) {
                        console.log(james)
                        // Do something with the returned data
                        var i = 50;
                        var last = ""
                        james.items.forEach((item) => {
                            if(i == 50){
                                last = "lt"
                                i = i + 1;
                            }
                            else{
                                songs["1 Month"][item.id] = item
                                songOrder["1 Month"].push(item.id)
                                i = i + 1;
                            }
                        })
                        switchView('1 Month')
                    }
                });
            }
        });
    }
}

function makeSong(name, url, number, id){
    if(firstRow == true){
      firstRow = false
      let orig = document.getElementById("original")
      orig.onclick = (e) => {
        showSong(id)
      }
      orig.children[0].innerHTML = `<img height="150px" width="150px" src="${url}">`
      orig.children[1].innerHTML = `<h3>${number}. ${name}</h3>`
    }
    else{
      let copy = document.getElementById("original").cloneNode(true)
      copy.onclick = (e) => {
        showSong(id)
      }
      copy.children[0].innerHTML = `<img height="150px" width="150px" src="${url}">`
      copy.children[1].innerHTML = `<h3>${number}. ${name}</h3>`
      console.log(copy.children.length)

      document.getElementById("artistParent").appendChild(copy)
    }
}

function showSong(id){
    let dialog = document.getElementById("dialog")
    let songName = dialog.querySelector("#songName")
    let artistName = dialog.querySelector("#artistName")
    let streams = dialog.querySelector("#streams")
    let playButton = dialog.querySelector("#playButton")
    let popularity = parseFloat(songs[duration][id].popularity)
    let ratio = popularity/100
    let r = (1.3 - ratio) * 255
    let g = ratio * 255
    let b = 0

    songName.innerText = songs[duration][id].name
    artistName.innerText = songs[duration][id].artists[0].name
    streams.innerText = songs[duration][id].popularity
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

    if(hasPremium == true){
        playButton.innerText = "Play on Spotify"
    }

    playButton.onclick = (e) =>{
        if(!hasPremium){
            let url = "https://music.youtube.com/search?q=" + songs[duration][id].name
            window.open(url)
        }
        else{
            $.ajax({
                url: "https://api.spotify.com/v1/me/player/devices",
                type: "GET",
                beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + _token );},
                success: function(data) { 
                  console.log(data[0])
                  let device_id = data.devices[0].id
                  $.ajax({
                    url: `https://api.spotify.com/v1/me/player/queue?uri=${songs[duration][id].uri}&device_id=${device_id}`,
                    type: "POST",
                    beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + _token );},
                    success: function(james) { 
                      console.log(james)
                      $.ajax({
                        url: `https://api.spotify.com/v1/me/player/next?device_id=${device_id}`,
                        type: "POST",
                        beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + _token );},
                        success: function(colin) { 
                          console.log(colin)
                        }
                    });
                    }
                });
                }
            });
            
        }
    }

    dialog.showModal()
}

function setDuration(){
    let dropdown = document.getElementById("dropdown")
    duration = dropdown.value
    switchView(duration)
}

function switchView(timeFrame){
    let s = songOrder[timeFrame]
    if(!s || !songs || !songs[timeFrame]){
        return false
    }
    else{
        firstRow = true
        let frag = new DocumentFragment()
        let original = document.getElementById("original")
        frag.append(original)
        let artistParent = document.getElementById("artistParent")
        artistParent.innerHTML = ""
        artistParent.appendChild(original)

        let i = 0
        s.forEach((id) => {
            i = i + 1
            let song = songs[timeFrame][id]
            makeSong(song.name, song.album.images[0].url, i, id)
        })
    }
}