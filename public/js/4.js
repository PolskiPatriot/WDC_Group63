
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
                    promoteButtonEl.onclick = function () { manageUser(res[i].JoinID, 0); };
                    promoteButtonEl.type = "button";
                    promoteButtonEl.append("Promote");
                    actionsEl.appendChild(promoteButtonEl);
                }
                if (level < 3 && level > 1) {
                    const demoteButtonEl = document.createElement('button');
                    demoteButtonEl.onclick = function () { manageUser(res[i].JoinID, 1); };
                    demoteButtonEl.type = "button";
                    demoteButtonEl.append("Demote");
                    actionsEl.appendChild(demoteButtonEl);
                }
                if (level < 3) {
                    const kickButtonEl = document.createElement('button');
                    kickButtonEl.onclick = function () { manageUser(res[i].JoinID, 2); };
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

function manageUser(JoinID, type) {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            window.location.reload();
        }
    };
    var payload = { 'JoinID': JoinID, 'type': type };
    xhttp.open('POST', '/viewUsers/manageUser', true);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify(payload));
}