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

function load() {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {

            switch (this.response) {
                case '0':
                    document.getElementById('links-list').style.display = 'none';
                    break;
                case '1':
                    document.getElementById('viewAdminOrgs').style.display = 'none';
                    document.getElementById('viewPendingOrgs').style.display = 'none';
                    break;
                case '3':
                case '4':
                    document.getElementById('viewPendingOrgs').style.display = 'none';
                    break;
                case '5':
                    break;
                default:
                    document.getElementById('links-list').style.display = 'none';
                    break;
            }
        }
    };
    xhttp.open('GET', '/settingsSidebar/getContent', true);
    xhttp.send();
}