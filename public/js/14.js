const colorClasses = ['eventButton1', 'eventButton2', 'eventButton3', 'eventButton4'];
let colorIndex = 0;
const eventColors = [];

function daysInMonth(month, year) {
    return new Date(year, month + 1, 0).getDate();
}
function fetchEventsForMonth(month, year, callback) {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {
                const response = JSON.parse(this.responseText);
                callback(0, response);
            } else {
                callback(this.status, null);
            }
        }
    };
    xhttp.open("GET", `/calendar/getEventsForMonth?month=${month + 1}&year=${year}`, true);
    xhttp.send();
}
function getColorClass(eventID) {
    for (let i = 0; i < eventColors.length; i++) {
        if (eventColors[i].id === eventID) {
            return eventColors[i].color;
        }
    }
    const colorClass = colorClasses[colorIndex % colorClasses.length];
    eventColors.push({ id: eventID, color: colorClass });
    colorIndex++;
    return colorClass;
}
function createButton(text, className, trueEventID) {
    const anchor = document.createElement('a');
    anchor.href = `/event?EventID=0x${trueEventID}`;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = className;
    button.textContent = text;
    anchor.appendChild(button);
    return anchor;
}
function createItem(day, events, displayedEvents) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'item';
    const interiorDiv = document.createElement('div');
    interiorDiv.className = 'interiorObject';
    const dayEvents = [];
    for (let i = 0; i < events.length; i++) {
        const event = events[i];
        const eventStart = new Date(event.startDate);
        const eventEnd = new Date(event.endDate);
        const currentDate = new Date(day.year, day.month, day.date);
        eventStart.setHours(0, 0, 0, 0);
        eventEnd.setHours(23, 59, 59, 999);
        currentDate.setHours(0, 0, 0, 0);
        if (currentDate >= eventStart && currentDate <= eventEnd) {
            dayEvents.push(event);
        }
    }
    if (dayEvents.length > 0) {
        for (let i = 0; i < dayEvents.length; i++) {
            const event = dayEvents[i];
            const colorClass = getColorClass(event.EventID);
            const button = createButton(event.location + ' from ' + new Date(event.startDate).toLocaleDateString() + ' to ' + new Date(event.endDate).toLocaleDateString(), colorClass, event.TrueEventID);
            interiorDiv.appendChild(button);
            if (!displayedEvents.has(event.EventID)) {
                const subDivButton = button.cloneNode(true);
                document.getElementById('subDivHeadingsButtons').appendChild(subDivButton);
                displayedEvents.add(event.EventID);
            }
        }
    }
    itemDiv.appendChild(interiorDiv);
    return itemDiv;
}
function createItems() {
    const daysContainer = document.getElementById('daysContainer');
    const subDivHeadingsButtons = document.getElementById('subDivHeadingsButtons');
    daysContainer.innerHTML = '';
    subDivHeadingsButtons.innerHTML = '';
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();
    const days = daysInMonth(month, year);
    document.getElementById('monthYear').textContent = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    fetchEventsForMonth(month, year, function(error, events) {
        if (error) {
            return;
        }
        const displayedEvents = new Set();
        for (let i = 1; i <= days; i++) {
            const dayItem = createItem({ date: i, month, year }, events, displayedEvents);
            daysContainer.appendChild(dayItem);
        }
    });
}
document.addEventListener('DOMContentLoaded', createItems);