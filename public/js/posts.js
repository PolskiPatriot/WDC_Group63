function like(PostID) {
    
    var classes = document.getElementById("likeCount"+PostID).classList;
    xhttp = new XMLHttpRequest();
    var xhttp;
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 & this.status == 200) {
            document.getElementById("likeCount"+PostID).innerText = this.responseText;
        }
    };
    if (classes.length > 0) {
        xhttp.open("GET", "/posts/unLike?id="+PostID, true);
        classes.remove('liked');
        xhttp.send();
    } else {
        xhttp.open("GET", "/posts/like?id="+PostID, true);
        classes.add('liked');
        xhttp.send();
    }

}

function rsvp(EventID) {

    var classes = document.getElementById("responseCount"+EventID).classList;
    xhttp = new XMLHttpRequest();
    var xhttp;
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 & this.status == 200) {
            document.getElementById("responseCount"+EventID).innerText = this.responseText;
        } else if (this.readyState == 4 & this.status == 204) {
            window.location.replace('/Signin');
        }
    };

    if (classes.length > 0) {
        xhttp.open("GET", "/posts/decline?id="+EventID, true);
        document.getElementById("rsvpButton"+EventID).innerText = "RSVP";
        classes.remove('rsvped');
        xhttp.send();
    } else {
        xhttp.open("GET", "/posts/rsvp?id="+EventID, true);
        document.getElementById("rsvpButton"+EventID).innerText = " Attending";
        classes.add('rsvped');
        xhttp.send();

    }
}


function deletePost(PostID, OrgID){

    xhttp = new XMLHttpRequest();
    var xhttp;
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 & this.status == 200) {
            window.location.replace('/groupManager?id=0x' + OrgID);//document.getElementById("responseCount"+EventID).innerText = this.responseText;
        }
    };
    xhttp.open("GET", "/posts/delete?id="+PostID, true);
    xhttp.send();


}

function joinOrg(OrgID, UserID) {
    var classes = document.getElementById("joinButton").classList;
    xhttp = new XMLHttpRequest();
    var xhttp;
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 & this.status == 200) {
            window.location.reload();
            //document.getElementById("joinButton").innerText = this.responseText;
        } else if (this.readyState == 4 & this.status == 204) {
            window.location.replace('/Signin');
        }
    };

    if (classes.length > 1) {

        xhttp.open("GET", "/posts/leave?Userid="+UserID+"&OrgID="+OrgID, true);
        document.getElementById("joinButton").innerText = "Join";
        classes.remove('Joined');
        xhttp.send();
    } else {

        xhttp.open("GET", "/posts/join?Userid="+UserID+"&OrgID="+OrgID, true);
        document.getElementById("joinButton").innerText = " Joined";
        classes.add('Joined');
        xhttp.send();

    }
}