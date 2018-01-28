// Content script listens for background script message (right click context menu)
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        // quick check if jQuery is working
        if ('undefined' == typeof window.jQuery) {
        } else {
            console.log('jQuery is here');
        }
        // Pass the text to AskServer, which will send it to the server for processing
        AskServer(request.greeting);
    });

function AskServer(selection){
    // create a container that covers the entire page
    var container = document.createElement("div");
    container.setAttribute("id", "load-container");

    // create a window 
    var window = document.createElement("div");
    window.setAttribute("id", "load-window");
    
    // add a spinner to the window
    var loading = document.createElement("div");
    loading.setAttribute("class", "spinner");

    var loading_cube_1 = document.createElement("div");
    loading_cube_1.setAttribute("class", "cube1");

    var loading_cube_2 = document.createElement("div");
    loading_cube_2.setAttribute("class", "cube2");

    loading.appendChild(loading_cube_1);
    loading.appendChild(loading_cube_2);

    // add the spinner to the window
    window.appendChild(loading);
    // add the window to the container
    container.appendChild(window);
    // send the container to the browser and display it
    document.body.appendChild(container);
    // disable scrolling
    disableScrolling();
    // make a request from the server
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://127.0.0.1:5000/get_products/" + selection);
    xhttp.setRequestHeader("Content-type", "application/json");
    // when the server responds, call BuildPopup which will build the actual popup menu
    xhttp.onload = function() {
        BuildPopup(xhttp.responseText);
    }
    xhttp.send();
}

function BuildPopup(json){
    // container which covers the entire webpage
    var container = document.createElement("div");
    container.setAttribute("id", "popupcontainer");

    // window where all elements will reside
    var window = document.createElement("div");
    window.setAttribute("id", "popupwindow");

    // title for the window
    var title = document.createElement("h1");
    title.innerText = "Results from Wegmans - 13790";
    title.setAttribute("id", "x-h1");
    window.appendChild(title);

    // container which will hold items and allow scrolling
    var scroll_container = document.createElement("div");
    scroll_container.setAttribute("id", "scroll-container");
    window.appendChild(scroll_container);

    // variable for calculating total cost
    var total_cost = 0.0;

    // parse the json data
    var parsedData = JSON.parse(json);
    // loop through all results
    for(var i = 0; i < parsedData['results'].length; i++){
        // create an item container element which will hold a single item's data
        var item_container = document.createElement("div");
        item_container.setAttribute("id", "item-container");

        // create a item text container which helps organize the text and image positions
        var item_text_container = document.createElement("div");
        item_text_container.setAttribute("id", "item-text-container");

        // create the item name element
        var name = document.createElement("h2");
        name.innerText = parsedData['results'][i][0].name;
        name.setAttribute("id", "x-h2");
        item_text_container.appendChild(name);

        // create the item price element
        var cost = document.createElement("h3");
        cost.innerText = "$" + parsedData['results'][i][0].price;
        cost.setAttribute("id", "x-h3");
        item_text_container.appendChild(cost);
        total_cost += parsedData['results'][i][0].price;

        // create the item image container
        var item_image_container = document.createElement("div");
        item_image_container.setAttribute("id", "item-image-container");

        // create the image element and form url
        var picture = document.createElement("IMG");
        picture.setAttribute("id", "preview_img");
        picture.setAttribute("src","https://www.wegmans.com" + parsedData['results'][i][0].image);
        item_image_container.appendChild(picture);

        // add the image and text containers
        item_container.appendChild(item_image_container);
        item_container.appendChild(item_text_container);

        // finally, add the item container to the scroll container
        scroll_container.appendChild(item_container);        
    }

    // create the close button
    var closebt = document.createElement("buttom");
    closebt.setAttribute("id", "x-button");
    closebt.innerText = "Cancel";
    closebt.onclick = function (){
        closeNav("popupcontainer");
        enableScrolling();
    }
    window.appendChild(closebt);

    // create the checkout button
    var checkout_bt = document.createElement("buttom");
    checkout_bt.setAttribute("id", "x-button");
    checkout_bt.setAttribute("style", "margin-left: 140px");
    checkout_bt.innerText = "Add to cart - $" + total_cost;
    window.appendChild(checkout_bt);

    // add the window to the container
    container.appendChild(window);
    // close the loading window
    closeNav("load-container");
    // display the completed menu
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