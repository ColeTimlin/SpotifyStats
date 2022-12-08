async function topArtists() {
    if (!_token) {
        login()
    }
    else {
        $.ajax({
            url: "https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=50",
            type: "GET",
            beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', 'Bearer ' + _token); },
            success: function (data) {
                // Do something with the returned data
                var i = 0;
                data.items.forEach((item) => {
                    i = i + 1;
                    makeSong(item.name, item.images[2].url, i)
                })

                $.ajax({
                    url: "https://api.spotify.com/v1/me/top/artists?limit=50&offset=49&time_range=long_term",
                    type: "GET",
                    beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', 'Bearer ' + _token); },
                    success: function (james) {
                        // Do something with the returned data
                        var i = 50;
                        james.items.forEach((item) => {
                            if(i == 50){
                                i = i + 1;
                            }
                            else{
                                makeSong(item.name, item.images[2].url, i)
                                i = i + 1;
                            }
                        })
                    }
                });
            }
        });
    }
}

function makeSong(name, url, number){
    if(firstRow == true){
      firstRow = false
      let orig = document.getElementById("original")
      orig.children[0].innerHTML = `<img height="150px" width="150px" src="${url}">`
      orig.children[1].innerHTML = `<h3>${number}. ${name}</h3>`
    }
    else{
      let copy = document.getElementById("original").cloneNode(true)
      copy.children[0].innerHTML = `<img height="150px" width="150px" src="${url}">`
      copy.children[1].innerHTML = `<h3>${number}. ${name}</h3>`
      console.log(copy.children.length)

      document.getElementById("artistParent").appendChild(copy)
    }
}