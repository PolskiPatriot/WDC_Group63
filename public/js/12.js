document.getElementById('confirmButton').addEventListener('click', function() {
    const resetCode = document.getElementById('resetCode').value;
    const newPassword = document.getElementById('newPassword').value;

    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "emailReset/confirmReset", true);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4) {
            if (xhttp.status >= 200 && xhttp.status < 300) {
                var data = JSON.parse(xhttp.responseText);
                if (data.success) {
                    alert('Password reset successfully!');
                    window.location.href = '/Signin';
                } else {
                    alert('Error ' + data.message);
                }
            }
        }
    };
    xhttp.send(JSON.stringify({ resetCode: resetCode, newPassword: newPassword }));
});