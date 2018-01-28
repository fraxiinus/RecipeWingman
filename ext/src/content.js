
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if ('undefined' == typeof window.jQuery) {
        } else {
            console.log('jQuery is here');
        }
        AskServer(request.greeting);
    });

function AskServer(selection){
    var container = document.createElement("div");
    container.setAttribute("id", "load-container");

    var window = document.createElement("div");
    window.setAttribute("id", "load-window");
    
    var loading = document.createElement("h1");
    loading.innerText = "Loading...";
    window.appendChild(loading);

    container.appendChild(window);
    document.body.appendChild(container);

    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://127.0.0.1:5000/get_products/" + selection);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.onload = function() {
        //console.log(xhttp.responseText);
        //var prod_obj = JSON.parse(xhttp.responseText);
        console.log(xhttp.responseText);
        BuildPopup(xhttp.responseText);
    }
    xhttp.send();
}

function BuildPopup(json){
    var container = document.createElement("div");
    container.setAttribute("id", "popupcontainer");

    var window = document.createElement("div");
    window.setAttribute("id", "popupwindow");


    var title = document.createElement("h1");
    title.innerText = "Results from Wegmans";
    window.appendChild(title);

    var scroll_container = document.createElement("div");
    scroll_container.setAttribute("id", "scroll-container");
    window.appendChild(scroll_container);

    var parsedData = JSON.parse(json);
    for(var i = 0; i < parsedData['results'].length; i++){
        console.log(parsedData['results'][i][0].name);
    }
    console.log(parsedData['results'][0][0].name);

    /*
    var name = document.createElement("h1");
    name.innerText = json['results'][0][0]['name'];
    scroll_container.appendChild(name);

    var cost = document.createElement("h3");
    cost.innerHTML = json['results'][0][0]['price'];
    scroll_container.appendChild(cost);

    var picture = document.createElement("IMG");
    picture.setAttribute("id", "preview_img");
    picture.setAttribute("src","https://www.wegmans.com" + json['results'][0][0]['image']);
    scroll_container.appendChild(picture);*/

    var closebt = document.createElement("buttom");
    closebt.innerText = "Cancel";
    closebt.onclick = function (){
        closeNav("popupcontainer");
    }
    window.appendChild(closebt);

    container.appendChild(window);
    
    closeNav("load-container");

    document.body.appendChild(container);
    
}

function closeNav(id){
    var nav = document.getElementById(id);
    nav.parentNode.removeChild(nav);
}