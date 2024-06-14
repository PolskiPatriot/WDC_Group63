function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/Signin/login", true);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4) {
            if (xhttp.status === 200) {
                var data = JSON.parse(xhttp.responseText);
                if (data.success) {
                    alert('Login successful');
                    window.location.replace('/');
                }
            }
        }
    };

    xhttp.send(JSON.stringify({
        email: email,
        password: password
    }));
}

function google_callback(response) {
    const responsePayload = decodeJwtResponse(response.credential);

    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/Signin/google-login", true);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4) {
            if (xhttp.status === 200) {
                var data = JSON.parse(xhttp.responseText);
                if (data.success) {
                    alert('Login successful');
                    window.location.replace('/');
                } else {
                    alert('Login failed: ' + data.message);
                }
            }
        }
    };
    xhttp.send(JSON.stringify({
        token: response.credential
    }));
}

function decodeJwtResponse(token) { //taken from https://stackoverflow.com/questions/68927855/sign-in-with-google-console-log
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}