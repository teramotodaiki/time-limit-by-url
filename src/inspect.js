const patterns = ['*://www.youtube.com/watch*'];

let isWatching = false;
let url = [];
function updateState() {
  chrome.tabs.query({ url: patterns }, tabs => {
    isWatching = tabs.length > 0;
    url = tabs.map(t => t.url);
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

let spent = 0;
const limit = 10;
const timer = setInterval(() => {
  if (isWatching) {
    spent = Math.min(limit, spent + 1);
    if (spent >= limit) {
      removeAll();
      clearInterval(timer);
    }
  }
}, 1000);

const respondQueries = {
  popup(respond) {
    respond({
      isWatching,
      url,
      spent,
      limit
    });
  }
};

chrome.runtime.onMessage.addListener((message, sender, respond) => {
  // query に反応するメソッドをコール
  respondQueries[message.query](respond);
});
