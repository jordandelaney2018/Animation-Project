var ammo = 30;
var reloading = false;
// set ammo to 30
function setAmmo(){
    document.getElementById("count").innerHTML = ammo + "/30";
}

function shoot() {
    // when you click reduce ammo by 1
    document.addEventListener("click", function () {
        ammo = ammo -1;
        document.getElementById("count").innerHTML = ammo + "/30";
        // if ammo gets to 0
        if(ammo <= 0){
            // set ammo to say reloading and wait 3 seconds before re setting ammo
            document.getElementById("count").innerHTML = " Reloading...";
            reloading = true;

            setTimeout(function (){
                ammo = 30;
                document.getElementById("count").innerHTML = ammo + "/30";
                reloading = false;
            }, 3000);
        }

    });
}
;