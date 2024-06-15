document.getElementById('sendRequestButton').addEventListener('click', function(event) {
    const email = document.getElementById('email').value;

    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "Email/sendEmail", true);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4) {
            if (xhttp.status >= 200 && xhttp.status < 300) {
                var data = JSON.parse(xhttp.responseText);
                if (data.success) {
                    alert('Reset sent');
                    window.location.replace('/12.html');
                } else {
                    alert('Reset failed: ' + data.message);
                }
            } else {
                alert("There was an error", xhttp.statusText);
            }
        }
    };
    xhttp.send(JSON.stringify({ email: email }));
});