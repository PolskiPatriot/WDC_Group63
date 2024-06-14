document.getElementById('profileDelete').addEventListener('click', function() {
    if (confirm('You sure you want to delete profile?')) {
        var xhttp = new XMLHttpRequest();
        xhttp.open('POST', 'settingsSidebar/delete-profile', true);
        xhttp.setRequestHeader('Content-Type', 'application/json');
        xhttp.onreadystatechange = function() {
            if (xhttp.readyState === 4) {
                if (xhttp.status >= 200 && xhttp.status < 300) {
                    alert(xhttp.responseText);
                    window.parent.location.href = '/';
                } else {
                    alert('Error could not delete profile.');
                }
            }
        };
        xhttp.send();
    }
});