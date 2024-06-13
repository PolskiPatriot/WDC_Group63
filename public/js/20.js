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

                const ManageUsersEl = document.createElement('button');
                ManageUsersEl.onclick = function () { manageUsers(res[i].orgName); };
                ManageUsersEl.type = "button";
                ManageUsersEl.append("Manage Users");

                const DeleteEl = document.createElement('button');
                DeleteEl.onclick = function () { deleteOrg(res[i].orgName); };
                DeleteEl.type = "button";
                DeleteEl.append("Delete");

                // construct group
                groupEl.appendChild(iconEl);
                groupEl.appendChild(orgNameEl);
                groupEl.appendChild(DeleteEl);
                groupEl.appendChild(ManageUsersEl);

                // append group
                parent.appendChild(groupEl);
            }
        }
    };
    const mainOrgTarget = new URLSearchParams(window.location.search);
    xhttp.open('GET', '/viewBranchOrgs/getContent?' + mainOrgTarget, true);
    xhttp.send();
}

function deleteOrg(orgName) {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            window.location.reload();
        }
    };
    xhttp.open('GET', '/viewBranchOrgs/deleteOrg?orgName=' + encodeURIComponent(orgName), true);
    xhttp.send();
}

function manageUsers() {
    // redirect to manageUsers of the group
    window.location.href;
}

function showNewBranchOrg() {
    document.getElementById("addForm").classList.toggle("hidden");
}

function makeNewBranchOrg() {
    var xhttp = new XMLHttpRequest();
    // get all important form data
    var mainOrg = new URLSearchParams(window.location.search);
    var orgData = { 'mainOrg': mainOrg.get('orgName'), 'orgName': document.getElementById('orgName').value, 'orgRegion': document.getElementById('orgRegion').value, 'orgAbout': document.getElementById('organisationCreateText').value };
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            switch (this.response) {
                case "relog":
                    window.location.href = "/Signin";
                    break;
                case "success":
                    document.getElementById("warning").classList.add("hidden");
                    document.getElementById('addForm').reset();
                    window.location.reload();
                    break;
                case "exists":
                    document.getElementById("warning").classList.remove("hidden");
                    break;
                default:
                    break;
            }
        }
    };
    xhttp.open('POST', '/viewBranchOrgs/createBranchOrg', true);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify(orgData));
}