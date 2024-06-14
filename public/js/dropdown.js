function menuOpen() {
    disableButtons();
    parent.document.getElementById('dropdown').classList.toggle("visible");
}

function logOut() {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if (!(this.response == "already logged out")) {
                alert("Logout successful");
                parent.location.reload();
            }
        }
    };
    xhttp.open('GET', '/dropdown/logout', true);
    xhttp.send();
}

function disableButtons() {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if (this.response == "notLogged") {
                document.getElementById("settings").style.display = "none";
                document.getElementById("logOut").style.display = "none";
            } else {
                document.getElementById("logIn").style.display = "none";
                document.getElementById("signUp").style.display = "none";
            }
        }
    };
    xhttp.open('GET', '/dropdown/loginStatus', true);
    xhttp.send();
}