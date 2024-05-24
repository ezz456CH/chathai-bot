const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

const date = new Date();
const nowutcstring = date.toUTCString();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('flightbyhex')
        .setDescription('Get flight data from adsb.ezz456ch.xyz by hex')
        .setDescriptionLocalizations({
            th: 'ดูข้อมูลเครื่องบินจาก adsb.ezz456ch.xyz ด้วย Hex'
        })
        .addStringOption(option =>
            option
                .setName('hex')
                .setDescription('Hex')
                .setRequired(true)
        ),
    async execute(interaction) {
        const { options } = interaction;
        const hex = options.getString('hex');
        const url = `https://api.ezz456ch.xyz/api/v2/hex/${hex}`;
        const planespottersapi = `https://api.planespotters.net/pub/photos/hex`;

        try {
            await interaction.deferReply();
            const response = await axios.get(url);
            const data = response.data;

            let callsign = data.ac[0].flight ? data.ac[0].flight.trim() : "No callsign";
            let aircraftinfo;
            if (data.ac[0].flight !== undefined) {
                aircraftinfo = `${data.ac[0].flight.trim()} Information`;
            } else {
                aircraftinfo = "Aircraft Information";
            }
            let hex = data.ac[0].hex != null ? data.ac[0].hex : "n/a";
            let reg = data.ac[0].r != null ? data.ac[0].r : "n/a"
            let type = data.ac[0].t != null ? data.ac[0].t : "n/a"
            let squawk = data.ac[0].squawk != null ? data.ac[0].squawk : "n/a";
            let gs = data.ac[0].gs != null ? data.ac[0].gs.toFixed(0) : "n/a";
            let tas = data.ac[0].tas != null ? data.ac[0].tas.toFixed(0) : "n/a";
            let ias = data.ac[0].ias != null ? data.ac[0].ias.toFixed(0) : "n/a";
            let mach = data.ac[0].mach != null ? data.ac[0].mach.toFixed(3) : "n/a";
            let alt_baro = data.ac[0].alt_baro != null ? data.ac[0].alt_baro : "n/a";
            let alt_geom = data.ac[0].alt_geom != null ? data.ac[0].alt_geom : "n/a";
            let baro_rate = data.ac[0].baro_rate != null ? data.ac[0].baro_rate : "n/a";
            let geom_rate = data.ac[0].geom_rate != null ? data.ac[0].geom_rate : "n/a";
            let vertrate = data.ac[0].baro_rate != null ? data.ac[0].baro_rate :
                (data.ac[0].geom_rate != null ? data.ac[0].geom_rate : "n/a");
            let vertrateindicator = "";
            if (vertrate !== "n/a") {
                if (vertrate > 256) {
                    vertrateindicator = "▲ ";
                } else if (vertrate < -256) {
                    vertrateindicator = "▼ ";
                }
            }
            let track = data.ac[0].track != null ? data.ac[0].track.toFixed(1) : "n/a";
            let true_heading = data.ac[0].true_heading != null ? data.ac[0].true_heading.toFixed(1) : "n/a";
            let mag_heading = data.ac[0].mag_heading != null ? data.ac[0].mag_heading.toFixed(1) : "n/a";
            let lat = data.ac[0].lat != null ? data.ac[0].lat.toFixed(3) : "n/a";
            let lon = data.ac[0].lon != null ? data.ac[0].lon.toFixed(3) : "n/a";

            let ws = data.ac[0].ws != null ? data.ac[0].ws : "n/a";
            let wd = data.ac[0].wd != null ? data.ac[0].wd : "n/a";
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

            let source = data.ac[0].type ? ({
                'uat': "UAT",
                'mlat': "MLAT",
                'adsb': "ADS-B",
                'adsb_icao': "ADS-B",
                'adsb_other': "ADS-B",
                'adsb_icao_nt': "ADS-B noTP",
                'adsr': "ADS-R or UAT",
                'adsr_icao': "ADS-R or UAT",
                'adsr_other': "ADS-R or UAT",
                'tisb_icao': "TIS-B",
                'tisb_trackfile': "TIS-B",
                'tisb_other': "TIS-B",
                'tisb': "TIS-B",
                'mode_s': "Mode S",
                'mode_ac': "Mode A/C",
                'adsc': "ADS-C",
                'other': "Other"
            }[data.ac[0].type] || "Unknown") : "n/a";

            let rssi = data.ac[0].rssi != null ? data.ac[0].rssi.toFixed(1) : "n/a";

            let seen_pos = data.ac[0].seen_pos != null ? data.ac[0].seen_pos.toFixed(1) :
                (data.ac[0].lastPosition && data.ac[0].lastPosition.seen_pos != null ?
                    data.ac[0].lastPosition.seen_pos.toFixed(1) : "n/a");

            let seen = data.ac[0].seen != null ? data.ac[0].seen.toFixed(1) : "n/a";

            let thumbnail_large = null;
            let photographer = null;
            let photoLink = null;

            try {
                const psptresponse = await axios.get(`${planespottersapi}/${hex}`);
                const psptdata = psptresponse.data;

                if (psptdata.photos && psptdata.photos.length > 0) {
                    const photo = psptdata.photos[0];
                    thumbnail_large = photo.thumbnail_large?.src ?? null;
                    photographer = photo.photographer ?? null;
                    photoLink = photo.link ?? null;
                }
            } catch (error) {
                console.error(`[ERROR] [${nowutcstring}] An error occurred while fetching photo from planespotter:`, error);
            }

            let imagecopyright = thumbnail_large
                ? `Image © ${photographer}\n${photoLink}`
                : "No image available";

            let embed;
            if (interaction.locale === 'th') {
                embed = new EmbedBuilder()
                    .setColor('#FFB6C1')
                    .setTitle(`${callsign}`)
                    .addFields(
                        { name: `${aircraftinfo}`, value: `\`\`\`yaml\nReg.: ${reg}\nAircraft type: ${type}\nHex: ${hex.toUpperCase()}\nSquawk: ${squawk}\nPos.: ${lat}, ${lon}\`\`\``, inline: false },
                        { name: 'Speed', value: `\`\`\`yaml\nGround Speed: ${gs} kt\nTrue Airspeed: ${tas} kt\nIndicated Airspeed: ${ias} kt\nMach: ${mach}\`\`\``, inline: false },
                        { name: 'Altitude', value: `\`\`\`yaml\nBaro. Altitude: ${alt_baro} ft\nBaro. Rate: ${baro_rate} ft/min\nWGS84 Altitude: ${alt_geom} ft\nGeom. Rate: ${geom_rate} ft/min\nVert. Rate: ${vertrateindicator}${vertrate} ft/min\`\`\``, inline: false },
                        { name: 'Direction', value: `\`\`\`yaml\nGround Track: ${track}°\nTrue Heading: ${true_heading}°\nMagnetic Heading: ${mag_heading}°\`\`\``, inline: false },
                        { name: 'Wind', value: `\`\`\`yaml\nWind Direction: ${wind_indicator}${wd}°\nWind Speed: ${ws} kt\`\`\``, inline: false },
                        { name: 'Signal & Data Source', value: `\`\`\`yaml\nSource: ${source}\nRSSI: ${rssi}\nLast Pos.: ${seen_pos} s\nLast Seen: ${seen} s\`\`\``, inline: false },
                    )
                    .setImage(thumbnail_large)
                    .setFooter({ text: `Powered By adsb.ezz456ch.xyz and PlaneSpotter API\n${imagecopyright}` });
            } else {
                embed = new EmbedBuilder()
                    .setColor('#FFB6C1')
                    .setTitle(`${callsign}`)
                    .addFields(
                        { name: `${aircraftinfo}`, value: `\`\`\`yaml\nReg.: ${reg}\nAircraft type: ${type}\nHex: ${hex.toUpperCase()}\nSquawk: ${squawk}\nPos.: ${lat}, ${lon}\`\`\``, inline: false },
                        { name: 'Speed', value: `\`\`\`yaml\nGround Speed: ${gs} kt\nTrue Airspeed: ${tas} kt\nIndicated Airspeed: ${ias} kt\nMach: ${mach}\`\`\``, inline: false },
                        { name: 'Altitude', value: `\`\`\`yaml\nBaro. Altitude: ${alt_baro} ft\nBaro. Rate: ${baro_rate} ft/min\nWGS84 Altitude: ${alt_geom} ft\nGeom. Rate: ${geom_rate} ft/min\nVert. Rate: ${vertrateindicator}${vertrate} ft/min\`\`\``, inline: false },
                        { name: 'Direction', value: `\`\`\`yaml\nGround Track: ${track}°\nTrue Heading: ${true_heading}°\nMagnetic Heading: ${mag_heading}°\`\`\``, inline: false },
                        { name: 'Wind', value: `\`\`\`yaml\nWind Direction: ${wind_indicator}${wd}°\nWind Speed: ${ws} kt\`\`\``, inline: false },
                        { name: 'Signal & Data Source', value: `\`\`\`yaml\nSource: ${source}\nRSSI: ${rssi}\nLast Pos.: ${seen_pos} s\nLast Seen: ${seen} s\`\`\``, inline: false },
                    )
                    .setImage(thumbnail_large)
                    .setFooter({ text: `Powered By adsb.ezz456ch.xyz and PlaneSpotter API\n${imagecopyright}` });
            }

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error(`[ERROR] [${nowutcstring}] An error occurred!:`, error);
            let embed;
            if (interaction.locale === 'th') {
                embed = new EmbedBuilder()
                    .setColor('#FF5555')
                    .setTitle(`ไม่พบเครื่องบิน / เที่ยวบินนี้`)
                    .setDescription(`เครื่องบินอาจอยู่นอกพื้นที่ครอบคลุม\nคุณสามารถช่วยเพิ่มความครอบคลุมของข้อมูล ADS-B/MLAT ได้ที่นี่: https://docs.ezz456ch.xyz/add-adsb-coverage`)
                    .setFooter({ text: `Powered By adsb.ezz456ch.xyz, hexdb.io and PlaneSpotter API` });
            } else {
                embed = new EmbedBuilder()
                    .setColor('#FF5555')
                    .setTitle(`Flight not found`)
                    .setDescription(`The aircraft may be outside the coverage area.\nYou can help improve ADS-B/MLAT coverage here: https://docs.ezz456ch.xyz/add-adsb-coverage`)
                    .setFooter({ text: `Powered By adsb.ezz456ch.xyz, hexdb.io and PlaneSpotter API` });
            }
            try {
                await interaction.editReply({ embeds: [embed] });
            } catch (error) {
                console.error(`[ERROR] [${nowutcstring}] An error occurred while sending the error message:`, error);
            }
        }
    },
};