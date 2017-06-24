import Main from 'components/Main.html';
const query = 'popup';

const main = new Main({
  target: document.querySelector('#main')
});

const render = response => {
  main.set(response);

  setTimeout(() => {
    // Update view
    chrome.runtime.sendMessage({ query }, render);
  }, 250);
};

// Notice to background script to start popup
chrome.runtime.sendMessage({ query }, render);

main.on('shake', () => {
  chrome.runtime.sendMessage({ query: 'shake' }, render);
});

main.on('open', url => {
  chrome.tabs.create({ url });
});
