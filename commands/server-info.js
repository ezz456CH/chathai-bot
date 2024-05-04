const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const client = require('../index');

const os = require('node-os-utils');
const cpu = os.cpu
const mem = os.mem

const { nwinfoc } = require('../network/network');
const osut = require('os');

const date = new Date();
const nowutcstring = date.toUTCString();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server-info')
        .setDescription('Provide information about the Bot\'s server (e.g., CPU or RAM usage)')
        .setDescriptionLocalizations({
            th: 'บอกข้อมูลเซิร์ฟเวอร์ของ Bot(เช่น CPU หรือ RAM ที่ใช้อยู่)'
        }),
    async execute(interaction) {
        try {
            await interaction.deferReply();

            const cpumodel = cpu.model();
            const cpuusage = await cpu.usage();
            const memory = await mem.used();
            const botmemory = process.memoryUsage().heapUsed / 1024 / 1024;

            const nwinfo = nwinfoc.getNetworkStats();
            const nwRxMbps = nwinfo && nwinfo[0] ? nwinfo[0].rx_sec / 125000 : 0;
            const nwTxMbps = nwinfo && nwinfo[0] ? nwinfo[0].tx_sec / 125000 : 0;

            let messageping = Date.now() - interaction.createdTimestamp;
            if (messageping > 1000) messageping = (messageping / 1000);

            const uptime = osut.uptime();

            const uptimeH = Math.floor(uptime / 3600);
            const uptimeM = Math.floor((uptime % 3600) / 60);
            const uptimeS = Math.floor(uptime % 60);

            let cliuptime = client.uptime / 1000;
            let cliuptimeH = Math.floor(cliuptime / 3600);
            let cliuptimeM = Math.floor((cliuptime % 3600) / 60);
            let cliuptimeS = Math.floor(cliuptime % 60);

            let embed;

            if (interaction.locale === 'th') {
                embed = new EmbedBuilder()
                    .setColor('#ADD8E6')
                    .setTitle('ข้อมูลเซิร์ฟเวอร์ของ Bot')
                    .addFields(
                        { name: 'CPU', value: `\`\`\`yaml\nCPU Model: ${cpumodel}\nCPU Usage: ${cpuusage}%\`\`\``, inline: true },
                        { name: 'RAM Usage', value: `\`\`\`yaml\nSystem RAM Usage: ${memory.usedMemMb} MB\nBot RAM Usage: ${botmemory.toFixed(2)} MB\`\`\``, inline: true },
                        { name: 'Latency', value: `\`\`\`yaml\nLatency: ${messageping}ms\nWebsocket Latency: ${client.ws.ping}ms\`\`\``, inline: true },
                        { name: 'Network', value: `\`\`\`yaml\nUpload: ${nwTxMbps.toFixed(2)} Mbps\nDownload: ${nwRxMbps.toFixed(2)} Mbps\`\`\``, inline: true },
                        { name: 'Uptime', value: `\`\`\`yaml\nSystem Uptime: ${uptimeH} hours, ${uptimeM} minutes, ${uptimeS} seconds\nBot Uptime: ${cliuptimeH} hours, ${cliuptimeM} minutes, ${cliuptimeS} seconds\`\`\``, inline: true },
                    );
            } else {
                embed = new EmbedBuilder()
                    .setColor('#ADD8E6')
                    .setTitle(`Bot's server information`)
                    .addFields(
                        { name: 'CPU', value: `\`\`\`yaml\nCPU Model: ${cpumodel}\nCPU Usage: ${cpuusage}%\`\`\``, inline: true },
                        { name: 'RAM Usage', value: `\`\`\`yaml\nSystem RAM Usage: ${memory.usedMemMb} MB\nBot RAM Usage: ${botmemory.toFixed(2)} MB\`\`\``, inline: true },
                        { name: 'Latency', value: `\`\`\`yaml\nLatency: ${messageping}ms\nWebsocket Latency: ${client.ws.ping}ms\`\`\``, inline: true },
                        { name: 'Network', value: `\`\`\`yaml\nUpload: ${nwTxMbps.toFixed(2)} Mbps\nDownload: ${nwRxMbps.toFixed(2)} Mbps\`\`\``, inline: true },
                        { name: 'Uptime', value: `\`\`\`yaml\nSystem Uptime: ${uptimeH} hours, ${uptimeM} minutes, ${uptimeS} seconds\nBot Uptime: ${cliuptimeH} hours, ${cliuptimeM} minutes, ${cliuptimeS} seconds\`\`\``, inline: true },
                    );
            }

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error(`[${nowutcstring}] Error processing server-info command:`, error);
        }
    }
};