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

  let _spent;
  $('.spent').textContent = _spent = spent;
  $('.limit').textContent = limit;

  if (isWatching) {
    setInterval(() => {
      _spent = Math.min(limit, _spent + 1);
      $('.spent').textContent = _spent;
    }, 1000);
  }
};

document.addEventListener('DOMContentLoaded', event => {
  chrome.runtime.sendMessage({ query }, render);
});
