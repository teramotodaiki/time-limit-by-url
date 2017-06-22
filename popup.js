const patterns = ['*://www.youtube.com/watch*'];

const onLoad = event => {
  const status = document.querySelector('#status');
  status.textContent = '';

  chrome.tabs.query({ url: patterns }, tabs => {
    const isWatching = tabs.length > 0;

    if (isWatching) {
      status.textContent = 'You are now watching!';
    }
  });
};
document.addEventListener('DOMContentLoaded', onLoad);
