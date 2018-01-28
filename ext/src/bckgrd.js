chrome.contextMenus.create({title:"Send to Recipe2Wegmans",contexts: ["selection"], "onclick": onRequest})

function onRequest(info, tab) {
    var selection = info.selectionText
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {greeting: selection});
      });
    //do something with the selection
};