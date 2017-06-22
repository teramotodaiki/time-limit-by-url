const $ = (...args) => document.querySelector(...args);
const query = 'popup';

const render = response => {
  const { isWatching, url, spent, limit } = response;

  if (isWatching) {
    $('.is-watching').classList.remove('hidden');
    $('.not-watching').classList.add('hidden');
  } else {
    $('.is-watching').classList.add('hidden');
    $('.not-watching').classList.remove('hidden');
  }

  $('.url').textContent = url.length > 1
    ? url[0] + ' ...etc'
    : url.length > 0 ? url[0] : '';

  $('.spent').textContent = spent;
  $('.limit').textContent = limit;

  setTimeout(() => {
    // Update view
    chrome.runtime.sendMessage({ query }, render);
  }, 250);
};

document.addEventListener('DOMContentLoaded', event => {
  chrome.runtime.sendMessage({ query }, render);
});
