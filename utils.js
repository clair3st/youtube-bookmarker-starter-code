//Find active tab user is on, from Chrome documentation
export async function getActiveTabURL() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}
