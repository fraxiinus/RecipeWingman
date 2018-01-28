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
    xhttp.open("GET", "http://127.0.0.1:5000/get_products/" + selection.replace(/\//g,'i'));
    xhttp.setRequestHeader("Content-type", "application/json");
    // when the server responds, call BuildPopup which will build the actual popup menu
    xhttp.onload = function() {
        if(xhttp.status == 200){
            //console.log(xhttp.responseText);
            BuildPopup(xhttp.responseText);
        }else{
            closeNav("load-container");
            enableScrolling();
        }
        
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
    var title = document.createElement("xh1");
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
        item_container.setAttribute("style", "font-family: verdana, arial, helvetica, sans-serif;");

        // create a item text container which helps organize the text and image positions
        var item_text_container = document.createElement("div");
        item_text_container.setAttribute("id", "item-text-container");

        // create the item name element
        var name = document.createElement("xh2");
        try{
            name.innerText = parsedData['results'][i][0].name;
        }catch(TypeError){
            continue;
        }
        name.setAttribute("id", "x-h2");
        item_text_container.appendChild(name);

        var break_line = document.createElement("br");
        break_line.setAttribute("id", "x-br");
        item_text_container.appendChild(break_line);

        // create the item price element
        var cost = document.createElement("xh3");
        cost.innerText = "$" + parsedData['results'][i][0].price;
        cost.setAttribute("id", "x-h3");
        cost.setAttribute("style","float: left; padding-right: 5px;")
        item_text_container.appendChild(cost);
        total_cost += parsedData['results'][i][0].price;

        // create unit price element
        var unit_cost = document.createElement("xh3");
        unit_cost.innerText = "$" + (parsedData['results'][i][0].unitprice + "").substring(0, 4) + "/" + parsedData['results'][i][0].unitofmeasure;
        unit_cost.setAttribute("id", "x-h3");
        unit_cost.setAttribute("style", "color:rgb(226, 226, 226); margin-left:5px;");
        item_text_container.appendChild(unit_cost);

        var break_line_2 = document.createElement("br");
        break_line_2.setAttribute("id", "x-br");
        item_text_container.appendChild(break_line_2);

        // create SKU element
        var sku = document.createElement("xh3");
        sku.innerText = "SKU: " + parsedData['results'][i][0].sku;
        sku.setAttribute("id", "x-h3");
        sku.setAttribute("style","font-style: italic;");
        item_text_container.appendChild(sku);

        var break_line_3 = document.createElement("br");
        break_line_3.setAttribute("id", "x-br");
        item_text_container.appendChild(break_line_3);

        // if not in stock at local store
        var stocked = document.createElement("xh3");
        stocked.setAttribute("id", "x-h3");
        if(!parsedData['results'][i][0].atstore){
            stocked.innerText = "Available at other Wegmans locations";
            stocked.setAttribute("style", "color: red;");
        }else{
            stocked.innerText = "In stock";
            stocked.setAttribute("style", "color: green;");
        }
        item_text_container.appendChild(stocked);

        // create the item image container
        var item_image_container = document.createElement("div");
        item_image_container.setAttribute("id", "item-image-container");

        // create the image element and form url
        var picture = document.createElement("IMG");
        picture.setAttribute("id", "preview_img");
        if(parsedData['results'][i][0].image == null){
            picture.setAttribute("src", "https://i.imgur.com/MlG5iM9.jpg");
        }else{
            picture.setAttribute("src","https://www.wegmans.com" + parsedData['results'][i][0].image);
        }
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
    checkout_bt.setAttribute("id", "x-button-2");
    checkout_bt.setAttribute("style", "margin-left: 10px");
    checkout_bt.innerText = "Add to cart - $" + (total_cost * 1.08).toFixed(2);
    checkout_bt.onclick = function (){
        checkout_bt.innerText = "Processing...";
        setTimeout(delayButton, 3000);
    }
    window.appendChild(checkout_bt);

    // add the window to the container
    container.appendChild(window);
    // close the loading window
    closeNav("load-container");
    // display the completed menu
    document.body.appendChild(container);
    
}

function delayButton(){
    var butt = document.getElementById("x-button-2");
    butt.innerText = "Done!"
    butt.onclick = function (){
        closeNav("popupcontainer");
        enableScrolling();
    }
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