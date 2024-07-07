const si = require('systeminformation');
const fs = require('node:fs');

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
            const date = new Date();
            const nowutcstring = date.toUTCString();

            const cpuinfo = await si.cpu();
            const cpubrand = cpuinfo.brand ? ` ${cpuinfo.brand} ` : ' ';
            let cpuspeed = cpuinfo.speedMax;

            if (isNaN(cpuspeed)) {
                try {
                    const proccpuinfo = fs.readFileSync('/proc/cpuinfo', 'utf8');
                    const lines = proccpuinfo.split('\n').find(line => line.includes('cpu MHz'));

                    if (lines) {
                        const speed = parseFloat(lines.split(':')[1].trim()) / 1000;
                        cpuspeed = speed.toFixed(1);
                    }
                } catch (err) {
                    console.error(`[ERROR] [${nowutcstring}] Error reading /proc/cpuinfo:`, err);
                }
            }

            const cpuusage = await si.currentLoad();
            const mem = await si.mem();
            const time = si.time();

            this.cpu.cache = `${cpuinfo.manufacturer}${cpubrand}(${cpuinfo.cores}) @ ${cpuspeed}GHz`;
            this.cpuusage.cache = `${cpuusage.currentLoad.toFixed(2)}%`;
            this.mem.cache = `${Number(mem.active / 1024 / 1024).toFixed(2)} MB`;
            this.uptime.cache = `${Math.floor(time.uptime / 3600)} hours, ${Math.floor((time.uptime % 3600) / 60)} minutes, ${Math.floor(time.uptime % 60)} seconds`;
            setTimeout(() => this.update(), this.updateinterval);
        } catch (error) {
            console.error(`[ERROR] [${nowutcstring}] Error updating sysinfo cache:`, error);
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