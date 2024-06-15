
function load() {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var res = JSON.parse(this.response);
            document.getElementById("count").innerText = res[0].memberCount;
            var parent = document.getElementById('user-listing');
            var OwnUserLevel = res[0].OwnUserLevel;
            for (let i in res) {
                // setup group elements
                let currentUsersLevel = res[i].UserLevel;
                var userLevelTitle;
                switch (currentUsersLevel) {
                    case 1:
                        userLevelTitle = "Org Member";
                        break;
                    case 2:
                        userLevelTitle = "Org Moderator";
                        break;
                    case 3:
                        userLevelTitle = "Org Admin";
                        break;
                    case 4:
                        userLevelTitle = "Org Super Admin";
                        break;
                    case 5:
                        userLevelTitle = "Site Manager";
                        break;
                    default:
                        userLevelTitle = "Non Org Member";
                        break;
                }

                const groupEl = document.createElement('div');
                groupEl.classList.add('singleUser');
                groupEl.append(userLevelTitle+' '+res[i].Name);

                const actionsEl = document.createElement('div');
                actionsEl.classList.add('actions');

                // permissions to press buttons depends on OwnUserLevel
                if (currentUsersLevel < (OwnUserLevel - 1)) {
                    const promoteButtonEl = document.createElement('button');
                    promoteButtonEl.onclick = function () { manageUser(res[i].JoinID, 0); };
                    promoteButtonEl.type = "button";
                    promoteButtonEl.append("Promote");
                    actionsEl.appendChild(promoteButtonEl);
                }
                if (currentUsersLevel < OwnUserLevel && currentUsersLevel > 1) {
                    const demoteButtonEl = document.createElement('button');
                    demoteButtonEl.onclick = function () { manageUser(res[i].JoinID, 1); };
                    demoteButtonEl.type = "button";
                    demoteButtonEl.append("Demote");
                    actionsEl.appendChild(demoteButtonEl);
                }
                if (currentUsersLevel < OwnUserLevel && OwnUserLevel > 2) {
                    const kickButtonEl = document.createElement('button');
                    kickButtonEl.onclick = function () { manageUser(res[i].JoinID, 2); };
                    kickButtonEl.type = "button";
                    kickButtonEl.append("Kick");
                    actionsEl.appendChild(kickButtonEl);
                }


                // IF SUPER ADMIN, CAN MANAGE USERS BELOW SUPER ADMIN


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