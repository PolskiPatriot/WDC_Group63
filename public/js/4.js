
function load() {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var res = JSON.parse(this.response);
            document.getElementById("count").innerText = res[0].memberCount;
            var parent = document.getElementById('user-listing');
            for (let i in res) {
                // setup group elements
                let level = res[i].UserLevel;
                const groupEl = document.createElement('div');
                groupEl.classList.add('singleUser');
                groupEl.append(res[i].Name);

                const actionsEl = document.createElement('div');
                actionsEl.classList.add('actions');
                if (level < 2) {
                    const promoteButtonEl = document.createElement('button');
                    promoteButtonEl.type = "button";
                    promoteButtonEl.append("Promote");
                    actionsEl.appendChild(promoteButtonEl);
                }
                if (level < 3 && level > 1) {
                    const demoteButtonEl = document.createElement('button');
                    demoteButtonEl.type = "button";
                    demoteButtonEl.append("Demote");
                    actionsEl.appendChild(demoteButtonEl);
                }
                if (level < 3) {
                    const kickButtonEl = document.createElement('button');
                    kickButtonEl.type = "button";
                    kickButtonEl.append("Kick");
                    actionsEl.appendChild(kickButtonEl);
                }
                // construct group
                groupEl.appendChild(actionsEl);

                // append group
                parent.appendChild(groupEl);
            }
        }
    };
    const branchOrgTarget = new URLSearchParams(window.location.search);
    xhttp.open('GET', '/viewUsers/getContent?' + branchOrgTarget, true);
    xhttp.send();
}