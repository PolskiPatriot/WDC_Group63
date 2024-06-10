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
                const orgNameEl = document.createTextNode(res[i].orgName);

                const formEl = document.createElement('form');
                formEl.action = "/viewBranchOrgs";
                formEl.method = "GET";

                const buttonEl = document.createElement('button');
                buttonEl.type = "submit";
                buttonEl.name = "orgName";
                buttonEl.value = (res[i].orgName);
                buttonEl.append("Manage Branches");

                formEl.appendChild(buttonEl);

                // construct group
                groupEl.appendChild(iconEl);
                groupEl.appendChild(orgNameEl);
                groupEl.appendChild(formEl);

                // append group
                parent.appendChild(groupEl);
            }
        }
    };
    xhttp.open('GET', '/viewAdminOrgs/getContent', true);
    xhttp.send();
}