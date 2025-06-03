import { getCurrentTab } from "./utils.js";


const addNewBookmark = (bookmarksElememt, bookmark) => {
    const bookmarkTitleElement = document.createElement("div");
    const newBookmarkElement = document.createElement("div");
    const controlsElement = document.createElement("div");

    bookmarkTitleElement.textContent = bookmark.desc;
    bookmarkTitleElement.className = "bookmark-title";

    controlsElement.className = "bookmark-controls";

    newBookmarkElement.id = "bookmark-" + bookmark.time;
    newBookmarkElement.className = "bookmark";
    newBookmarkElement.setAttribute("timestamp", bookmark.time);

    setBookmarkAttributes('play', onPlay, controlsElement);

    newBookmarkElement.appendChild(bookmarkTitleElement);
    newBookmarkElement.appendChild(controlsElement);
    bookmarksElement.appendChild(newBookmarkElement);
    
};

const viewBookmarks = (currentBookmarks=[]) => {
    const bookmarksElement = document.getElementById("bookmarks");
    bookmarksElement.innerHTML = "";

    if (currentBookmarks.length > 0) {
        currentBookmarks.forEach(bookmark => {
            const bookmarkElement = document.createElement("div");
            addNewBookmark(bookmarkElement, bookmark);
        });
    } else {
        bookmarksElement.innerHTML = "<i>No bookmarks to show</i>";
    }
};

const onPlay = async e => {
    const bookmarkTime = e.target.parentNode.parentNode.getAttribute('timestamp');
    const activeTab = await getActiveTabURL();

    chrome.tabs.sendMessage(activeTab.id, {
        type: "PLAY",
        value: bookmarkTime
    })
};

const onDelete = e => {};

const setBookmarkAttributes =  (src, eventListener, controlParentElement) => {
    const controlElement = document.createElement("img");

    controlElement.src = "assets/" + src + ".png";
    controlElement.title = src;
    controlElement.addEventListener('click', eventListener);
    controlParentElement.append(controlELement);
};

//Native window event when content has loaded
document.addEventListener("DOMContentLoaded", async () => {
    const activeTab = await getCurrentTab();
    const queryParameters = activeTab.url.split("?")[1];
    const urlParameters = new URLSearchParams(queryParameters);
    const currentVideo = urlParameters.get("v");

    if (activeTab.url.includes("youtube.com/watch") && currentVideo) {
        //Get bookmarks from chrome storage
        chrome.storage.sync.get([currentVideo], (data) => {
            const currentVideoBookmarks = data[currentVideo] ? JSON.parse(data[currentVideo]) : [];

            //Create the UI for the bookmark
            viewBookmarks(currentVideoBookmarks);
        });
    } else {
        const container = document.getElementById("bookmarks-container");
        container.innerHTML = "<div class='title'>This is not a youtube video page.</div>";
    }
});
