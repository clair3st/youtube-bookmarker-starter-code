Online tutorial working through Chrome extension developement.
Source: https://www.youtube.com/watch?v=0n809nd4Zu4&t=128s

*Notes:*
manifest.json used to specify what version of the extensions platform we will use, among others serving as default for loading in our extensions. Required for the extension to work, used by any Chromium based extension.

Manifest.json is comprised of:
    - **name** this is the name of the extension, seen when loaded in.
    - **description** include brief explanation of what it does.
    - **permissions** depends on the purpose of the extension, in this example, using chrome.storage API and chrome.tabs API.
    - **service_worker** JS file that runs separately from the main browser thread, which means it won't have access to the contents of a web page, but can use extensions messaging system to speak to the extension
    - **content_scripts** Files that run depending on what pages we're on, used to manipulate the DOM of the webpage that the extension is looking at
    - **default_popup** What is served for UI