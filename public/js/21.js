function makeNewOrg() {
    var xhttp = new XMLHttpRequest();
    // get all important form data
    var orgData = { 'orgName': document.getElementById('orgName').value, 'orgAbout': document.getElementById('organisationCreateText').value };
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
    xhttp.open('POST', '/createNewOrg/createOrg', true);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify(orgData));
}