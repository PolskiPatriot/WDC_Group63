function onload_user() {
    var xhttp = new XMLHttpRequest();
    xhttp.open('GET', '/contactDetails/contact-details', true);
    xhttp.withCredentials = true;
    xhttp.onload = function() {
        if (xhttp.status >= 200 && xhttp.status < 300) {
            var data = JSON.parse(xhttp.responseText);
            document.getElementById('first-name').value = data.givenName;
            document.getElementById('last-name').value = data.familyName;
            document.getElementById('email').value = data.email;
            document.getElementById('phone').value = data.phonenumber;
        } else {
            alert("There was an error", xhttp.statusText);
        }
    };
    xhttp.send();
}
function Update() {
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const email = document.getElementById('email').value;
    const phonenumber = document.getElementById('phone').value;
    var xhttp = new XMLHttpRequest();
    xhttp.open('POST', '/contactDetails/update-contact-details', true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.onload = function() {
        if (xhttp.status >= 200 && xhttp.status < 300) {
            var data = JSON.parse(xhttp.responseText);
            alert(data.message);
        } else {
            alert("There was an error", xhttp.statusText);
        }
    };
    xhttp.send(JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        email: email,
        phonenumber: phonenumber
    }));
}