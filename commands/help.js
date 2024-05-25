const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const donateth = 'เลี้ยงค่าขนมให้ ezz456CH ❤';
const flightbycallsignth = 'ดูข้อมูลเครื่องบินจาก adsb.ezz456ch.xyz ด้วย Callsign';
const flightbyhexth = 'ดูข้อมูลเครื่องบินจาก adsb.ezz456ch.xyz ด้วย Hex';
const genshinteamrandomizerth = 'สุ่มทีม Genshin Impact';
const minecraftskinth = 'สกิน Minecraft จาก Username';
const nearbyflightth = 'ดูข้อมูลเครื่องบินใกล้เคียงจาก adsb.ezz456ch.xyz ด้วยละติจูดและลองติจูด';
const serverinfoth = 'บอกข้อมูลเซิร์ฟเวอร์ของ Bot(เช่น CPU หรือ RAM ที่ใช้อยู่)';
const translateth = 'แปลภาษา';
const weatherth = 'ดูข้อมูลสภาพอากาศ';

const donateen = 'Support ezz456CH by donating ❤';
const flightbycallsignen = 'Get flight data from adsb.ezz456ch.xyz by callsign';
const flightbyhexen = 'Get flight data from adsb.ezz456ch.xyz by hex';
const genshinteamrandomizeren = 'Generate a random Genshin Impact team';
const minecraftskinen = 'Get Minecraft skin from username';
const nearbyflighten = 'Get nearby flight data from adsb.ezz456ch.xyz with latitude and longitude';
const serverinfoen = 'Provide information about the Bot\'s server (e.g., CPU or RAM usage)';
const translateen = 'Translate';
const weatheren = 'Get weather infomation';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('List all available commands)')
        .setDescriptionLocalizations({
            th: 'คำสั่งทั้งหมดที่พร้อมใช้งาน'
        }),
    async execute(interaction) {
        await interaction.deferReply();

        let embed;

        if (interaction.locale === 'th') {
            embed = new EmbedBuilder()
                .setColor('#F1C40F')
                .setTitle('คำสั่งทั้งหมดที่พร้อมใช้งาน')
                .addFields(
                    { name: '/donate', value: donateth, inline: true },
                    { name: '/flightbycallsign', value: flightbycallsignth, inline: true },
                    { name: '/flightbyhex', value: flightbyhexth, inline: true },
                    { name: '/genshin-team-randomizer', value: genshinteamrandomizerth, inline: true },
                    { name: '/minecraft-skin', value: minecraftskinth, inline: true },
                    { name: '/nearbyflight', value: nearbyflightth, inline: true },
                    { name: '/server-info', value: serverinfoth, inline: true },
                    { name: '/translate', value: translateth, inline: true },
                    { name: '/weather', value: weatherth, inline: true }
                )
                .setFooter({ text: 'หากคุณพบปัญหาหรือการแปลภาษาไม่ถูกต้อง สามารถแจ้งได้ที่ https://discord.gg/hdXVK6fMpD' });
        } else {
            embed = new EmbedBuilder()
                .setColor('#F1C40F')
                .setTitle('All available commands')
                .addFields(
                    { name: '/donate', value: donateen, inline: true },
                    { name: '/flightbycallsign', value: flightbycallsignen, inline: true },
                    { name: '/flightbyhex', value: flightbyhexen, inline: true },
                    { name: '/genshin-team-randomizer', value: genshinteamrandomizeren, inline: true },
                    { name: '/minecraft-skin', value: minecraftskinen, inline: true },
                    { name: '/nearbyflight', value: nearbyflighten, inline: true },
                    { name: '/server-info', value: serverinfoen, inline: true },
                    { name: '/translate', value: translateen, inline: true },
                    { name: '/weather', value: weatheren, inline: true }
                )
                .setFooter({ text: 'If you find a problem or incorrect translation, you can report it at https://discord.gg/hdXVK6fMpD' });
        }

        await interaction.editReply({ embeds: [embed] });
    }
};