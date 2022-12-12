const SLIP_TIMEOUT = 300; // Milliseconds
export default class SlipTimer {
  private _timeout_id!: number;

  start(slipCallback: () => void) {
    this._timeout_id! = setTimeout(() => {
      slipCallback();
    }, SLIP_TIMEOUT);
  }

  stop() {
    clearTimeout(this._timeout_id);
  }
}
