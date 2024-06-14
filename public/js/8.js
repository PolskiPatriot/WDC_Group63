function load() {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var res = JSON.parse(this.response);
            var parent = document.getElementById('event-grid');
            const options = {
                hour: 'numeric',
                minute: 'numeric'
            };
            for (let i in res) {
                const eventCard = document.createElement('div');
                eventCard.classList.add('event-card');


                const eventName = document.createElement('h2');
                eventCard.classList.add('eventName');
                var EventName = document.createTextNode(res[i].eventName);
                eventName.appendChild(EventName);


                var DateW = document.createElement('p');
                DateW.classList.add('date:');
                var dateWord = document.createTextNode("Date: ");
                DateW.appendChild(dateWord);


                const eventDateS = document.createElement('div');
                eventDateS.classList.add('startDate');
                var eStart = document.createTextNode(new Date(res[i].startDate).toLocaleDateString());
                eventDateS.appendChild(eStart);

                var TimeW = document.createElement('p');
                TimeW.classList.add('date:');
                var timeWord = document.createTextNode("Time: ");
                TimeW.appendChild(timeWord);

                const eventTime = document.createElement('div');
                eventTime.classList.add('startTime');
                var eHours = document.createTextNode(new Date(res[i].startDate).toLocaleTimeString(undefined, options));
                eventTime.appendChild(eHours);


                var LocationW = document.createElement('p');
                LocationW.classList.add('location:');
                var locWord = document.createTextNode("Location: ");
                LocationW.appendChild(locWord);


                const eventPlace = document.createElement('p');
                eventName.classList.add('location');
                var ePlace = document.createTextNode(res[i].location);
                eventPlace.appendChild(ePlace);


                var responseW = document.createElement('p');
                responseW.classList.add('responceCount');
                var responceWord = document.createTextNode("Responses:");
                responseW.appendChild(responceWord);


                var responseCount = document.createElement('span');
                responseCount.classList.add('responceCount');
                var rCount = document.createTextNode(res[i].responseCount);
                responseCount.appendChild(rCount);


                const buttonJoin = document.createElement('button');
                buttonJoin.classList.add('group-button');
                buttonJoin.type = "button";
                buttonJoin.append("Attend");



                parent.appendChild(eventCard);
                eventCard.appendChild(eventName);
                eventCard.appendChild(DateW);
                DateW.appendChild(eventDateS);
                eventCard.appendChild(TimeW);
                TimeW.appendChild(eventTime);
                eventCard.appendChild(LocationW);
                LocationW.appendChild(eventPlace);
                eventCard.appendChild(responseW);
                responseW.appendChild(responseCount);
                eventCard.appendChild(buttonJoin);




                /*
                // setup group elements
                const groupEl = document.createElement('div');
                groupEl.classList.add('group');
                const iconEl = document.createElement('div');
                iconEl.classList.add('group-icon');
                const textEl = document.createElement('div');
                textEl.classList.add('group-text');
                const orgNameEl = document.createElement('span');
                var title = document.createTextNode(res[i].orgName);
                orgNameEl.appendChild(title);
                const aboutEl = document.createElement('p');
                var about = document.createTextNode(res[i].aboutOrg);
                aboutEl.appendChild(about);


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
                */
            }
        }
    };
    xhttp.open('GET', '/viewEvents/getContent', true);
    xhttp.send();
}