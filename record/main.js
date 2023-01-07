async function record() {
    console.log("hello")
    if (!_token) {
        login()
    }
    $.ajax({
        url: "https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=4",
        type: "GET",
        beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', 'Bearer ' + _token); },
        success: function (data) {
            console.log("hi")
            // Do something with the returned data
            var i = 0;
            data.items.forEach((item) => {
                i = i + 1
                var image = item.images[0].url
                var name = item.name
                addImage(i, image)
                addText(i, name)
            })
        }
    });
}

function addImage(i, image){
    console.log(i)
    if(i == 1){
        document.getElementById("mask1").style.backgroundImage = `url("${image}")`
    }
    if(i == 2){
        document.getElementById("mask2").style.backgroundImage = `url("${image}")`
    }
    if(i == 3){
        document.getElementById("mask3").style.backgroundImage = `url("${image}")`
    }
    if(i == 4){
        document.getElementById("mask4").style.backgroundImage = `url("${image}")`
    }

}

function addText(i, text){
    console.log(i)
    if(i == 1){
        document.getElementById("text1").innerText = `${text}`
    }
    if(i == 2){
        document.getElementById("text2").innerText = `${text}`
    }
    if(i == 3){
        document.getElementById("text3").innerText = `${text}`
    }
    if(i == 4){
        document.getElementById("text4").innerText = `${text}`
    }
}

function download(){
    var node = document.querySelector('.record')

    domtoimage.toPng(node)
    .then(function (dataUrl) {
        var img = new Image();
        img.src = dataUrl;
        var download = document.createElement('a');
        download.href = dataUrl;
        download.download = "record.png";
        download.click();
    })
    .catch(function (error) {
        console.error('oops, something went wrong!', error);
    });
}