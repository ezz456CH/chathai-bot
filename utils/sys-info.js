const si = require('systeminformation');

class sysinfo {
  constructor() {
    this.cpu.cache = null;
    this.cpuusage.cache = null;
    this.mem.cache = null;
    this.uptime.cache = null;
    this.updateinterval = 1000;
    this.update();
  }

  async update() {
    try {
      const cpuinfo = await si.cpu();
      const cpuusage = await si.currentLoad();
      const mem = await si.mem();
      const time = si.time();

      this.cpu.cache = `${cpuinfo.manufacturer} ${cpuinfo.brand} (${cpuinfo.cores}) @ ${cpuinfo.speedMax}GHz`;
      this.cpuusage.cache = `${cpuusage.currentLoad.toFixed(2)}%`;
      this.mem.cache = `${Number(mem.active / 1024 / 1024).toFixed(2)} MB`;
      this.uptime.cache = `${Math.floor(time.uptime / 3600)} hours, ${Math.floor((time.uptime % 3600) / 60)} minutes, ${Math.floor(time.uptime % 60)} seconds`;
      setTimeout(() => this.update(), this.updateinterval);
    } catch (error) {
      console.error('Error updating sysinfo cache:', error);
      setTimeout(() => this.update(), this.updateinterval);
    }
  }

  cpu() {
    return this.cpu.cache;
  }

  cpuusage() {
    return this.cpuusage.cache;
  }

  mem() {
    return this.mem.cache;
  }

  uptime() {
    return this.uptime.cache;
  }
}

module.exports = { sysinfo: new sysinfo() };