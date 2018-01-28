console.log("I'm loaded")

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
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
    xhttp.setRequestHeader("Content-type", "application/text");
    xhttp.onload = function() {
        //console.log(xhttp.responseText);
        closeNav("load-container");
        var prod_obj = JSON.parse(xhttp.responseText);
        BuildPopup(prod_obj);
    }
    xhttp.send();
}

function BuildPopup(json){
    var container = document.createElement("div");
    container.setAttribute("id", "popupcontainer");

    var window = document.createElement("div");
    window.setAttribute("id", "popupwindow");

    var title = document.createElement("h1");
    title.innerText = json['results'][0][0]['name'];
    window.appendChild(title);

    var closebt = document.createElement("buttom");
    closebt.innerText = "Cancel";
    closebt.onclick = function (){
        closeNav("popupcontainer");
    }
    window.appendChild(closebt);

    container.appendChild(window);
    document.body.appendChild(container);
    
}

function closeNav(id){
    var nav = document.getElementById(id);
    nav.parentNode.removeChild(nav);
}