const si = require('systeminformation');

class nwinfo {
  constructor() {
    this.cache = null;
    this.updateInterval = 1000;
    this.update();
  }

  async update() {
    const date = new Date();
    const nowutcstring = date.toUTCString();

    try {
      this.cache = await si.networkStats();
      setTimeout(() => this.update(), this.updateInterval);
    } catch (error) {
      console.error(`[ERROR] [${nowutcstring}] Error updating nwinfo cache:`, error);
      setTimeout(() => this.update(), this.updateInterval);
    }
  }

  network() {
    return this.cache;
  }
}

module.exports = { nwinfo: new nwinfo() };