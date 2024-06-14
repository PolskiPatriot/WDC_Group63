function load() {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var res = JSON.parse(this.response);
            var parent = document.getElementById('group-container');
            for (let i in res) {
                // setup group elements
                const groupEl = document.createElement('div');
                groupEl.classList.add('group');
                const iconEl = document.createElement('div');
                iconEl.classList.add('group-icon');
                const textEl = document.createElement('div');
                textEl.classList.add('group-text');
                const orgNameEl = document.createElement('span');
                orgNameEl.append(res[i].orgName);
                const aboutEl = document.createElement('p');
                aboutEl.appendChild(res[i].aboutOrg);

                const buttonEl = document.createElement('button');
                buttonEl.classList.add('group-button');
                buttonEl.type = "button";
                buttonEl.append("Leave");

                // construct group
                groupEl.appendChild(iconEl);
                groupEl.appendChild(textEl);
                textEl.appendChild(orgNameEl);
                textEl.appendChild(aboutEl);
                groupEl.appendChild(buttonEl);

                // append group
                parent.appendChild(groupEl);
            }
        }
    };
    xhttp.open('GET', '/viewMyOrgs/getContent', true);
    xhttp.send();
}