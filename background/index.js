import WatchingState from './watching-state';

const state = new WatchingState();
global.extensionState = state; // for development

function removeAll() {
  for (const tab of state.tabs) {
    chrome.tabs.remove(tab.id);
  }
}

const main = () => {
  if (state.isWatching && state.spend()) {
    removeAll();
    state.isWatching = false;
  }
  chrome.browserAction.setTitle({ title: state.title });
  chrome.browserAction.setBadgeText({ text: state.badgeText });
  chrome.browserAction.setBadgeBackgroundColor({
    color: state.color
  });
  if (state.enabled) {
    chrome.browserAction.enable();
  } else {
    chrome.browserAction.disable();
  }
};

state.loadState(() => {
  setInterval(main, 1000);
});

const respondQueries = {
  popup(message, respond) {
    respond(state.plainObject);
  },
  shake(message, respond) {
    state.shakeTheDice();
    respond(state.plainObject);
  }
};

chrome.runtime.onMessage.addListener((message, sender, respond) => {
  // query に反応するメソッドをコール
  respondQueries[message.query](message, respond);
});
