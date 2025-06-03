import { getCurrentTab } from "./utils.js";


const addNewBookmark = (bookmarksElememt, bookmark) => {
    const bookmarkTitleElement = document.createElement("div");
    const newBookmarkElement = document.createElement("div");

    bookmarkTitleElement.textContent = bookmark.desc;
    bookmarkTitleElement.className = "bookmark-title";

    newBookmarkElement.id = "bookmark-" + bookmark.time;
    newBookmarkElement.className = "bookmark";
    newBookmarkElement.setAttribute("timestamp", bookmark.time);

    newBookmarkElement.appendChild(bookmarkTitleElement);
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

const onPlay = e => {};

const onDelete = e => {};

const setBookmarkAttributes =  () => {};

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
