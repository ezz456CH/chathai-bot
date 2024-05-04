const si = require('systeminformation');

class nwinfoc {
  constructor() {
    this.cache = null;
    this.updateInterval = 1000;
    this.update();
  }

  async update() {
    try {
      this.cache = await si.networkStats();
      setTimeout(() => this.update(), this.updateInterval);
    } catch (error) {
      console.error('Error updating network cache:', error);
      setTimeout(() => this.update(), this.updateInterval);
    }
  }

  getNetworkStats() {
    return this.cache;
  }
}

module.exports = { nwinfoc: new nwinfoc() };