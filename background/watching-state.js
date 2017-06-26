export default class WatchingState {
  constructor() {
    this.isWatching = false;
    this.tabs = [];
    this.spent = 0; // [sec]
    this.limit = 60; // [sec]
    this.patterns = [
      '*://www.youtube.com/watch*',
      '*://twitter.com/*',
      '*://www.facebook.com/*'
    ];
    this.diceNumer = 1;
    this.rewardTime = Date.now(); // [msec]
    this.delayTime = 30 * 60 * 1000; // [msec]

    this.updateState();
    chrome.tabs.onUpdated.addListener(this.updateState);
    chrome.tabs.onRemoved.addListener(this.updateState);
    chrome.tabs.onReplaced.addListener(this.updateState);
  }

  get urls() {
    return this.tabs.map(tab => tab.url);
  }

  get title() {
    const last = ((this.rewardTime - Date.now()) / 1000) >> 0;
    return last <= 0 ? '' : last + '';
  }

  get badgeText() {
    const last = this.limit - this.spent;
    const n = last < 30 ? last : Math.ceil(last / 30) * 30;
    return n < 1 ? '' : n + '';
  }

  get color() {
    return this.limit - this.spent < 30
      ? 'red'
      : this.isWatching ? 'orange' : 'limegreen';
  }

  get plainObject() {
    const { isWatching, spent, limit, diceNumer, rewardTime, color } = this;
    return { isWatching, spent, limit, diceNumer, rewardTime, color };
  }

  get enabled() {
    // 視聴可能である or サイコロを振れる
    return this.spent < this.limit || this.rewardTime <= Date.now();
  }

  updateState = () => {
    chrome.tabs.query({ url: this.patterns }, tabs => {
      this.isWatching = tabs.length > 0;
      this.tabs = tabs;
    });
  };

  spend() {
    this.spent = Math.min(this.limit, this.spent + 1);
    return this.spent >= this.limit;
  }

  shakeTheDice() {
    // まだサイコロをふれない
    if (Date.now() < this.rewardTime) return;

    // ランダムにサイコロを振る
    this.diceNumer = (Math.random() * 6 + 1) >> 0;
    // サイコロの目[min] のリミットを設定
    this.limit = this.diceNumer * 60;
    // 時間を戻す
    this.spent = 0;
    // 次のサイコロまで　あと…
    this.rewardTime = Date.now() + this.delayTime;
  }
}
