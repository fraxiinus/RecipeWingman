
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
    loading.setAttribute("id", "x-h1");
    loading.innerText = "Loading...";
    window.appendChild(loading);

    container.appendChild(window);
    document.body.appendChild(container);
    disableScrolling();
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
    title.innerText = "Results from Wegmans - 13790";
    title.setAttribute("id", "x-h1");
    window.appendChild(title);

    var scroll_container = document.createElement("div");
    scroll_container.setAttribute("id", "scroll-container");
    window.appendChild(scroll_container);

    var parsedData = JSON.parse(json);
    for(var i = 0; i < parsedData['results'].length; i++){
        console.log(parsedData['results'][i][0].name);
        var item_container = document.createElement("div");
        item_container.setAttribute("id", "item-container");

        var item_text_container = document.createElement("div");
        item_text_container.setAttribute("id", "item-text-container");

        var name = document.createElement("h2");
        name.innerText = parsedData['results'][i][0].name;
        name.setAttribute("id", "x-h2");
        item_text_container.appendChild(name);

        var cost = document.createElement("h3");
        cost.innerText = "$" + parsedData['results'][i][0].price;
        cost.setAttribute("id", "x-h3");
        item_text_container.appendChild(cost);

        var item_image_container = document.createElement("div");
        item_image_container.setAttribute("id", "item-image-container");

        var picture = document.createElement("IMG");
        picture.setAttribute("id", "preview_img");
        picture.setAttribute("src","https://www.wegmans.com" + parsedData['results'][i][0].image);
        item_image_container.appendChild(picture);

        /*var break_line = document.createElement("br");
        break_line.setAttribute("id", "break-line");*/

        item_container.appendChild(item_image_container);
        item_container.appendChild(item_text_container);

        scroll_container.appendChild(item_container);        
    }
    //

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
    closebt.setAttribute("id", "x-button");
    closebt.innerText = "Cancel";
    closebt.onclick = function (){
        closeNav("popupcontainer");
        enableScrolling();
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

function disableScrolling(){
    var x=window.scrollX;
    var y=window.scrollY;
    window.onscroll=function(){window.scrollTo(x, y);};
}

function enableScrolling(){
    window.onscroll=function(){};
}