let hasPremium = false

function checkPremium(){
    console.log(_token)

    $.ajax({
        url: "https://api.spotify.com/v1/me/player/repeat?state=context&device_id=0d1841b0976bae2a3a310dd74c0f3df354899bc8",
        type: "PUT",
        beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + _token );},
        success: function(data) { 
          console.log(data)
        },
        error: function(xhr, status, error) {
            var err = JSON.parse(xhr.responseText)
            console.log(err);
            
            let stat = err.error.status

            if(stat === 404){
                hasPremium = true
            }

            return hasPremium
        }
    });
}