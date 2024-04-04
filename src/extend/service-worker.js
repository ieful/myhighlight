/* eslint-disable no-undef */
self.oninstall = (event) => {
    // ...
    console.log('install event:', event);
};


chrome.runtime.onInstalled.addListener((details) => {
    console.log('details:', details);
    // if(details.reason !== "install" && details.reason !== "update") return;
    // chrome.contextMenus.create({
    //     "id": "sampleContextMenu",
    //     "title": "Sample Context Menu",
    //     "contexts": ["selection"]
    // });
});

self.onactivate = (event) => {
    // ...
    console.log('active event', event)
};
