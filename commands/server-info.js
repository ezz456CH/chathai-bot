const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const client = require('../index');

const { nwinfo } = require('../utils/nw-info');
const { sysinfo } = require('../utils/sys-info');

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

            const cpumodel = sysinfo.cpu();
            const cpuusage = sysinfo.cpuusage();
            const mem = sysinfo.mem();
            const botmemory = process.memoryUsage().heapUsed / 1024 / 1024;
            const sysuptime = sysinfo.uptime();

            const net = nwinfo.network();
            const netrx = net && net[0] ? net[0].rx_sec / 125000 : 0;
            const nettx = net && net[0] ? net[0].tx_sec / 125000 : 0;

            const messageping = Date.now() - interaction.createdTimestamp;

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
                        { name: 'CPU', value: `\`\`\`yaml\nCPU Model: ${cpumodel}\nCPU Usage: ${cpuusage}\`\`\``, inline: true },
                        { name: 'RAM Usage', value: `\`\`\`yaml\nSystem RAM Usage: ${mem}\nBot RAM Usage: ${botmemory.toFixed(2)} MB\`\`\``, inline: true },
                        { name: 'Latency', value: `\`\`\`yaml\nMessage Latency: ${messageping}ms\nWebsocket Latency: ${client.ws.ping}ms\`\`\``, inline: true },
                        { name: 'Network', value: `\`\`\`yaml\nUpload: ${nettx.toFixed(2)} Mbps\nDownload: ${netrx.toFixed(2)} Mbps\`\`\``, inline: true },
                        { name: 'Uptime', value: `\`\`\`yaml\nSystem Uptime: ${sysuptime}\nBot Uptime: ${cliuptimeH} hours, ${cliuptimeM} minutes, ${cliuptimeS} seconds\`\`\``, inline: true },
                    );
            } else {
                embed = new EmbedBuilder()
                    .setColor('#ADD8E6')
                    .setTitle(`Bot's server information`)
                    .addFields(
                        { name: 'CPU', value: `\`\`\`yaml\nCPU Model: ${cpumodel}\nCPU Usage: ${cpuusage}\`\`\``, inline: true },
                        { name: 'RAM Usage', value: `\`\`\`yaml\nSystem RAM Usage: ${mem}\nBot RAM Usage: ${botmemory.toFixed(2)} MB\`\`\``, inline: true },
                        { name: 'Latency', value: `\`\`\`yaml\nMessage Latency: ${messageping}ms\nWebsocket Latency: ${client.ws.ping}ms\`\`\``, inline: true },
                        { name: 'Network', value: `\`\`\`yaml\nUpload: ${nettx.toFixed(2)} Mbps\nDownload: ${netrx.toFixed(2)} Mbps\`\`\``, inline: true },
                        { name: 'Uptime', value: `\`\`\`yaml\nSystem Uptime: ${sysuptime}\nBot Uptime: ${cliuptimeH} hours, ${cliuptimeM} minutes, ${cliuptimeS} seconds\`\`\``, inline: true },
                    );
            }

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error(`[${nowutcstring}] Error processing server-info command:`, error);
        }
    }
};