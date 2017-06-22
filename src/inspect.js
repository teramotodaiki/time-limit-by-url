const patterns = ['*://www.youtube.com/watch*'];

let isWatching = false;
function updateState() {
  chrome.tabs.query({ url: patterns }, tabs => {
    isWatching = tabs.length > 0;
  });
}

updateState();
chrome.tabs.onUpdated.addListener(updateState);
chrome.tabs.onRemoved.addListener(updateState);
chrome.tabs.onReplaced.addListener(updateState);

function removeAll() {
  chrome.tabs.query({ url: patterns }, tabs => {
    for (const tab of tabs) {
      chrome.tabs.remove(tab.id);
    }
  });
}

let time = 0;
const limit = 10;
const timer = setInterval(() => {
  if (isWatching && ++time > limit) {
    removeAll();
    clearInterval(timer);
  }
}, 1000);
