function load() {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var res = JSON.parse(this.response);
            var parent = document.getElementById('organisation-container');
            for (let i in res) {
                // setup group elements
                const groupEl = document.createElement('div');
                groupEl.classList.add('organisation');
                const iconEl = document.createElement('img');
                iconEl.src = "/images/groupLogo.png";
                iconEl.alt = "orgLogo";
                var orgNameEl = document.createTextNode(res[i].orgName);

                const DenyEl = document.createElement('button');
                DenyEl.onclick = function () { denyOrg(res[i].orgName); };
                DenyEl.type = "button";
                DenyEl.append("Deny");

                const VerifyEl = document.createElement('button');
                VerifyEl.onclick = function () { verifyOrg(res[i].orgName); };
                VerifyEl.type = "button";
                VerifyEl.append("Verify");

                // construct group
                groupEl.appendChild(iconEl);
                groupEl.appendChild(orgNameEl);
                groupEl.appendChild(VerifyEl);
                groupEl.appendChild(DenyEl);

                // append group
                parent.appendChild(groupEl);
            }
        }
    };
    xhttp.open('GET', '/viewPendingOrgs/getContent', true);
    xhttp.send();
}

function verifyOrg(orgName) {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            window.location.reload();
        }
    };
    xhttp.open('GET', '/viewPendingOrgs/verifyOrg?orgName=' + encodeURIComponent(orgName), true);
    xhttp.send();
}

function denyOrg(orgName) {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            window.location.reload();
        }
    };
    xhttp.open('GET', '/viewPendingOrgs/denyOrg?orgName=' + encodeURIComponent(orgName), true);
    xhttp.send();
}