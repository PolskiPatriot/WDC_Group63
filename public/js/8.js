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
                var EventName = document.createTextNode(res[i].title);
                eventName.appendChild(EventName);


                var DateW = document.createElement('p');
                DateW.classList.add('date:');


                const eventDateS = document.createElement('div');
                eventDateS.classList.add('startDate');
                var eStart = document.createTextNode('Date: '+ new Date(res[i].startDate).toLocaleDateString());
                eventDateS.appendChild(eStart);

                var TimeW = document.createElement('p');
                TimeW.classList.add('date:');

                const eventTime = document.createElement('div');
                eventTime.classList.add('startTime');
                var eHours = document.createTextNode('Time: '+ new Date(res[i].startDate).toLocaleTimeString(undefined, options));
                eventTime.appendChild(eHours);


                var LocationW = document.createElement('p');
                LocationW.classList.add('location:');


                const eventPlace = document.createElement('p');
                eventName.classList.add('location');
                var ePlace = document.createTextNode('Location: '+ res[i].location);
                eventPlace.appendChild(ePlace);


                var responseW = document.createElement('p');
                responseW.classList.add('responceCount');

                var responseCount = document.createElement('span');
                responseCount.classList.add('responceCount');
                var rCount = document.createTextNode("Responses: "+ res[i].responseCount);
                responseCount.appendChild(rCount);


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
            }
        }
    };
    xhttp.open('GET', '/viewEvents/getContent', true);
    xhttp.send();
}