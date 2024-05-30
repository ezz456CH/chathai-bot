const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const fs = require('fs');
const weather_conditions_th = JSON.parse(fs.readFileSync('./data/weather/weather_conditions_th.json', 'utf8'));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('weather')
        .setDescription('Get weather information')
        .setDescriptionLocalizations({
            th: 'ดูข้อมูลสภาพอากาศ'
        })
        .addNumberOption(option =>
            option
                .setName('lat')
                .setDescription('Latitude')
                .setRequired(true)
        )
        .addNumberOption(option =>
            option
                .setName('long')
                .setDescription('Longitude')
                .setRequired(true)
        ),
    async execute(interaction) {
        const { options } = interaction;
        const Lat = options.getNumber('lat');
        const Long = options.getNumber('long');
        const wtapikey = process.env.wtapikey;
        const url = `https://api.weatherapi.com/v1/current.json?key=${wtapikey}&q=${Lat},${Long}&aqi=no`;

        await interaction.deferReply();
        const response = await axios.get(url);
        const { current, location } = response.data;
        const icon = current.condition.icon ? `https:${current.condition.icon}` : null;
        const conditioncode = current.condition.code;
        const conditiontext = current.condition.text;
        const isday = current.is_day === 1;
        const temp_c = current.temp_c;
        const temp_f = current.temp_f;
        const feelslike_c = current.feelslike_c;
        const feelslike_f = current.feelslike_f;
        const humidity = current.humidity;
        const wind_kph = current.wind_kph;
        const wd = current.wind_degree;
        const pressure_mb = current.pressure_mb;
        const pressure_in = current.pressure_in;
        const cloud = current.cloud;
        const vis_km = current.vis_km;
        const vis_miles = current.vis_miles;
        const uv = current.uv;
        const last_updated = current.last_updated;
        const region = location.region;
        const country = location.country;

        let wind_indicator = "";
		if (wd >= 0 && wd < 45) {
			wind_indicator = "↓ ";
		} else if (wd >= 45 && wd < 90) {
			wind_indicator = "↙ ";
		} else if (wd >= 90 && wd < 135) {
			wind_indicator = "← ";
		} else if (wd >= 135 && wd < 180) {
			wind_indicator = "↖ ";
		} else if (wd >= 180 && wd < 225) {
			wind_indicator = "↑ ";
		} else if (wd >= 225 && wd < 270) {
			wind_indicator = "↗ ";
		} else if (wd >= 270 && wd < 315) {
			wind_indicator = "→ ";
		} else if (wd >= 315 && wd <= 360) {
			wind_indicator = "↘ ";
		}

        let conditiontextth = conditiontext;
        if (interaction.locale === 'th') {
            const condition = weather_conditions_th.find(c => c.code === conditioncode);
            if (condition) {
                conditiontextth = isday ? condition.day : condition.night;
            }
        }

        let embed;

        if (interaction.locale === 'th') {
            embed = new EmbedBuilder()
                .setColor('#3498DB')
                .setTitle(conditiontextth)
                .addFields(
                    { name: 'อุณหภูมิ', value: `${temp_c}°C (${temp_f}°F)`, inline: true },
                    { name: 'รู้สึกเหมือน', value: `${feelslike_c}°C (${feelslike_f}°F)`, inline: true },
                    { name: 'ความชื้น', value: `${humidity}%`, inline: true },
                    { name: 'ลม', value: `${wind_indicator}${wd}° ${wind_kph} กม./ชม.`, inline: true },
                    { name: 'ความกดอากาศ', value: `${pressure_mb} mb (${pressure_in} in)`, inline: true },
                    { name: 'เมฆ', value: `${cloud}%`, inline: true },
                    { name: 'ทัศนวิสัย', value: `${vis_km} กม. (${vis_miles} ไมล์)`, inline: true },
                    { name: 'ดัชนี UV', value: `${uv}`, inline: true },
                    { name: 'อัพเดตล่าสุด', value: `${last_updated} ${region}, ${country}`, inline: false }
                )
                .setThumbnail(icon)
                .setFooter({ text: 'Powered By WeatherAPI.com' });
        } else {
            embed = new EmbedBuilder()
                .setColor('#3498DB')
                .setTitle(conditiontext)
                .addFields(
                    { name: 'Temperature', value: `${temp_c}°C (${temp_f}°F)`, inline: true },
                    { name: 'Feels Like', value: `${feelslike_c}°C (${feelslike_f}°F)`, inline: true },
                    { name: 'Humidity', value: `${humidity}%`, inline: true },
                    { name: 'Wind', value: `${wind_indicator}${wd}° ${wind_kph} km/h`, inline: true },
                    { name: 'Pressure', value: `${pressure_mb} mb (${pressure_in} in)`, inline: true },
                    { name: 'Cloud Cover', value: `${cloud}%`, inline: true },
                    { name: 'Visibility', value: `${vis_km} km (${vis_miles} mi)`, inline: true },
                    { name: 'UV Index', value: `${uv}`, inline: true },
                    { name: 'Last updated', value: `${last_updated} ${region}, ${country}`, inline: false }
                )
                .setThumbnail(icon)
                .setFooter({ text: 'Powered By WeatherAPI.com' });
        }

        await interaction.editReply({ embeds: [embed] });
    }
};
