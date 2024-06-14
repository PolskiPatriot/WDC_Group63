
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