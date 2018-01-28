console.log("I'm loaded")

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        LoadPopUp(selection)
    });

function LoadPopUp(selection){
    
}