function onload_user() {
    var xhttp = new XMLHttpRequest();
    xhttp.open('GET', '/myProfile/username', true);
    xhttp.withCredentials = true;
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState === 4) {
            if (xhttp.status >= 200 && xhttp.status < 300) {
                var data = JSON.parse(xhttp.responseText);
                document.getElementById('username').innerText = data.username;
                document.getElementById('descProfile').innerText = data.about;
            }
        }
    };
    xhttp.send();
}
function edit(name) {
    const element = document.getElementById(name);
    const currentValue = element.innerText;
    let input;
    if (name === 'username') {
        input = document.createElement('input');
        input.type = 'text';
        input.className = 'edit-input';
    } else {
        input = document.createElement('textarea');
        input.className = 'edit-textarea';
    }
    input.value = currentValue;
    input.onblur = function() {
    const newValue = input.value.trim();
    let isValid = true;
    let errorMessage = '';
    if (name === 'username') {
        if (newValue.length > 20) {
            isValid = false;
            errorMessage = 'Username must be under 20 characters.';
        }
    } else if (name === 'descProfile') {
        if (newValue.length > 500) {
            isValid = false;
            errorMessage = 'Description cannot exceed 500 characters.';
        }
    }
    if (isValid) {
        element.innerText = newValue;
        element.style.display = 'block';
        input.remove();

        var xhttp = new XMLHttpRequest();
        xhttp.open('POST', '/myProfile/update-profile', true);
        xhttp.setRequestHeader('Content-Type', 'application/json');
        xhttp.withCredentials = true;
        xhttp.onreadystatechange = function() {
            if (xhttp.readyState === 4) {
                if (xhttp.status >= 200 && xhttp.status < 300) {
                    var data = JSON.parse(xhttp.responseText);
                    if (data.message) {
                        alert(data.message);
                    }
                }
            }
        };
        xhttp.send(JSON.stringify({
            field: name,
            value: newValue
        }));
    } else {
        alert(errorMessage);
        input.focus();
    }
    };
    element.style.display = 'none';
    element.parentNode.insertBefore(input, element);
    input.focus();
}