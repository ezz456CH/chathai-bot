const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

const wtth = {
    'Sunny': 'แจ่มใส',
    'Clear': 'แจ่มใส',
    'Partly cloudy': 'มีเมฆบางส่วน',
    'Cloudy': 'มีเมฆ',
    'Overcast': 'มีเมฆหนา',
    'Mist': 'หมอกน้ำค้าง',
    'Patchy rain possible': 'อาจจะมีฝนตกเป็นหย่อมๆ',
    'Patchy snow possible': 'อาจจะมีหิมะตกเป็นหย่อมๆ',
    'Patchy sleet possible': 'อาจจะมีฝนหิมะตกเป็นหย่อมๆ',
    'Patchy freezing drizzle possible': 'อาจจะมีฝนละอองเยือกแข็งตกเป็นหย่อมๆ',
    'Thundery outbreaks possible': 'อาจจะมีพายุฝนฟ้าคะนองรุนแรง',
    'Blowing snow': 'หิมะฟุ้ง',
    'Blizzard': 'พายุหิมะ',
    'Fog': 'หมอก',
    'Freezing fog': 'หมอกน้ำแข็ง',
    'Patchy light drizzle': 'มีฝนละอองตกเป็นหย่อมๆ',
    'Light drizzle': 'ฝนละออง',
    'Freezing drizzle': 'ฝนละอองเยือกแข็ง',
    'Heavy freezing drizzle': 'มีฝนละอองเยือกแข็งตกหนัก',
    'Patchy light rain': 'มีฝนตกเล็กน้อยเป็นหย่อมๆ',
    'Light rain': 'ฝนตกเล็กน้อย',
    'Moderate rain at times': 'ฝนตกปานกลางบางครั้ง',
    'Moderate rain': 'ฝนตกปานกลาง',
    'Heavy rain at times': 'ฝนตกหนักบางครั้ง',
    'Heavy rain': 'ฝนตกหนัก',
    'Light freezing rain': 'ฝนเยือกแข็งเล็กน้อย',
    'Moderate or heavy freezing rain': 'ฝนเยือกแข็งปานกลางหรือหนัก',
    'Light sleet': 'ฝนหิมะตกเล็กน้อย',
    'Moderate or heavy sleet': 'ฝนหิมะตกปานกลางหรือหนัก',
    'Patchy light snow': 'มีหิมะตกเป็นหย่อมๆ',
    'Light snow': 'หิมะตกเล็กน้อย',
    'Patchy moderate snow': 'มีหิมะตกปานกลางเป็นหย่อมๆ',
    'Moderate snow': 'หิมะตกปานกลาง',
    'Patchy heavy snow': 'มีหิมะตกหนักเป็นหย่อมๆ',
    'Heavy snow': 'หิมะตกหนัก',
    'Ice pellets': 'มีลูกปรายน้ำแข็ง',
    'Light rain shower': 'ฝนซู่หรือฝนไล่ช้างตกเป็นหย่อมๆ',
    'Moderate or heavy rain shower': 'ฝนซู่หรือฝนไล่ช้างตกปานกลางหรือหนัก',
    'Torrential rain shower': 'ฝนซู่หรือฝนไล่ช้างตกรุนแรง',
    'Light sleet showers': 'ฝนหิมะตกเล็กน้อย',
    'Moderate or heavy sleet showers': 'ฝนหิมะตกปานกลางหรือหนัก',
    'Light snow showers': 'หิมะตกเล็กน้อย',
    'Moderate or heavy snow showers': 'หิมะตกปานกลางหรือหนัก',
    'Light showers of ice pellets': 'ฝนลูกปรายน้ำแข็งเล็กน้อย',
    'Moderate or heavy showers of ice pellets': 'ฝนลูกปรายน้ำแข็งปานกลางหรือหนัก',
    'Patchy light rain with thunder': 'มีฝนตกเป็นหย่อมๆและมีฟ้าคะนอง',
    'Moderate or heavy rain with thunder': 'ฝนตกปานกลางหรือหนักและมีฟ้าคะนอง',
    'Patchy light snow with thunder': 'มีหิมะตกเป็นหย่อมๆและมีฟ้าคะนอง',
    'Moderate or heavy snow with thunder': 'หิมะตกปานกลางหรือหนักและมีฟ้าคะนอง',
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('weather')
        .setDescription('Get weather infomation')
        .setDescriptionLocalizations({
            th: 'ดูข้อมูลสภาพอากาศ'
        })
        .addStringOption(option => 
            option
                .setName('lat') 
                .setDescription('Latitude')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('long')
                .setDescription('Longitude')
                .setRequired(true)
        ),
    async execute(interaction) {
        const { options } = interaction;
        const Lat = options.getString('lat');
        const Long = options.getString('long');
        const wtapikey = process.env.wtapikey;
        const url = `https://api.weatherapi.com/v1/current.json?key=${wtapikey}&q=${Lat}, ${Long}&aqi=no`

        await interaction.deferReply();
        const response = await axios.get(url);
        const { current, location } = response.data;
        const i = `https:${current.condition.icon}`;
        const ct = `${current.condition.text}`;
        const twtth = wtth[ct] || ct;

        let embed;

        if (interaction.locale === 'th') {
            embed = new EmbedBuilder()
                .setColor('#3498DB')
                .setTitle(`**${twtth}**`)
                .addFields(
                    { name: 'อุณหภูมิ', value: `${current.temp_c}°C`, inline: true },
                    { name: 'ความชื้น', value: `${current.humidity}%`, inline: true },
                    { name: 'ลม', value: `${current.wind_kph} กม./ชม.`, inline: true },
                    { name: 'อัพเดตล่าสุด', value: `${current.last_updated} ${location.region}`, inline: false }
                )
                .setThumbnail(`${i}`)
                .setFooter({ text: 'Powered By WeatherAPI.com' });
        } else {
            embed = new EmbedBuilder()
                .setColor('#3498DB')
                .setTitle(`**${ct}**`)
                .addFields(
                    { name: 'Temp', value: `${current.temp_c}°C`, inline: true },
                    { name: 'Humidity', value: `${current.humidity}%`, inline: true },
                    { name: 'Wind', value: `${current.wind_kph} km/h`, inline: true },
                    { name: 'Last updated', value: `${current.last_updated} ${location.region}`, inline: false }
                )
                .setThumbnail(`${i}`)
                .setFooter({ text: 'Powered By WeatherAPI.com' });
        }

        await interaction.editReply({ embeds: [embed] });
    }
};