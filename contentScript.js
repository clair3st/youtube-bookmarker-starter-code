(() => {
    
    let youtubeLeftControls, youtubePlayer; //access youtube player and youtube controls
    let currentVideo = "";
    let currentVideoBookmarks = [];

    // Send a response back to message sent from background.js
    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        const { type, value, videoId } = obj;

        if (type === "NEW") {
            currentVideo = videoId;
            newVideoLoaded(); //handle any actions with new video
        } else if (type === "PLAY") {
            youtubePlayer.currentTime = value;
        } else if (type === "DELETE") {
            currentVideoBookmarks = currentVideoBookmarks.filter((b) => b.time != value);
            chrome.storage.sync.set({ [currentVideo]: JSON.stringify(currentVideoBookmarks) })

            response(currentVideoBookmarks);
        }
    });

    //fetch bookmarks from chrome storage asynchronously
    const fetchBookmarks = () => {
        return new Promise((resolve) => {
            console.log('fetchBookmarks')
            chrome.storage.sync.get([currentVideo], (obj) => {
                resolve(obj[currentVideo] ? JSON.parse(obj[currentVideo]) : []);
            });
        });
    };

    //create a bookmark button for the current video

    const newVideoLoaded = async () => {
        const bookmarkBtnExists = document.getElementsByClassName("bookmark-btn")[0];
        currentVideoBookmarks = await fetchBookmarks();

        if (!bookmarkBtnExists) { //if bookmark button does not exist, create it for any youtube video
            const bookmarkBtn = document.createElement("img");

            //Create the new button
            bookmarkBtn.src = chrome.runtime.getURL("assets/bookmark.png");
            bookmarkBtn.className = "ytp-button " + "bookmark-btn";
            bookmarkBtn.title = "Click to bookmark current timestamp";

            //Get the youtube player and youtube controls
            youtubeLeftControls = document.getElementsByClassName("ytp-left-controls")[0];
            youtubePlayer = document.getElementsByClassName("video-stream")[0];

            //Append the new button to the youtube player and add event listener
            youtubeLeftControls.append(bookmarkBtn);
            bookmarkBtn.addEventListener("click", addNewBookmarkEventHandler);
        }
    }

    //Event handler bookmark button, grab video timestamp and create bookmark
    const addNewBookmarkEventHandler = async () => {
        const currentTime = youtubePlayer.currentTime;
        const newBookmark = {
            time: currentTime,
            desc: "Bookmark at " + getTime(currentTime),
        };
        
        currentVideoBookmarks = await fetchBookmarks();

        chrome.storage.sync.set({
            [currentVideo]: JSON.stringify([...currentVideoBookmarks, newBookmark].sort((a, b) => a.time - b.time))
        });
    }

    //Call anytime we hit youtube, will ensure it is called regardless of a youtube url change
    newVideoLoaded();
})();


const getTime = t => {
    var date = new Date(0);
    date.setSeconds(t);
  
    return date.toISOString().substring(11, 19);
  }