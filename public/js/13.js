window.onload = function () {
    google.accounts.id.initialize({
        client_id: '119246077266-568pi1sojct64fdrvn10enalph5aqgg3.apps.googleusercontent.com',
        callback: google_callback
    });
    google.accounts.id.prompt();
};

function google_callback(response) {
    const responsePayload = decodeJwtResponse(response.credential);
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/SignUp/google-signup", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4) {
            if (xhttp.status === 200) {
                alert(xhttp.responseText);
                if (xhttp.responseText === "User registered successfully") {
                    window.location.href = '/';
                }
            } else {
                alert("There was an error", xhttp.statusText);
            }
        }
    };
    xhttp.send(JSON.stringify({
        token: response.credential
    }));
}

function decodeJwtResponse(token) { // Got this from https://stackoverflow.com/questions/38552003/how-to-decode-jwt-token-in-javascript-without-using-a-library
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

function signUp() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/SignUp/signup", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4) {
            if (xhttp.status === 200) {
                alert(xhttp.responseText);
                if (xhttp.responseText === "User registered successfully") {
                    window.location.href = '/';
                }
            } else {
                alert("There was an error", xhttp.statusText);
            }
        }
    };
    xhttp.send(JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password
    }));
}
