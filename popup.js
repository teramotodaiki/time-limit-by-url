const $ = (...args) => document.querySelector(...args);
const render = response => {
  const { isWatching, url } = response;

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
};

document.addEventListener('DOMContentLoaded', event => {
  chrome.runtime.sendMessage({}, render);
});
