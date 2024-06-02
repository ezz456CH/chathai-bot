const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

const date = new Date();
const nowutcstring = date.toUTCString();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('flightbycallsign')
		.setDescription('Get flight data from adsb.ezz456ch.xyz by callsign')
		.setDescriptionLocalizations({
			th: 'ดูข้อมูลเครื่องบินจาก adsb.ezz456ch.xyz ด้วย Callsign'
		})
		.addStringOption(option =>
			option
				.setName('callsign')
				.setDescription('Callsign')
				.setRequired(true)
		),
	async execute(interaction) {
		const { options } = interaction;
		const callsign = options.getString('callsign');
		const adsbezz456chxyzapi = `https://api.ezz456ch.xyz/api/v2/callsign/${callsign}`;
		const adsblolapi = `https://api.adsb.lol/v2/callsign/${callsign}`;
		const planespottersapi = `https://api.planespotters.net/pub/photos/hex`;
		const hexdbiorouteiata = `https://hexdb.io/api/v1/route/iata`;

		await interaction.deferReply();

		const ezz456chres = await axios.get(adsbezz456chxyzapi);
		const adsblolres = await axios.get(adsblolapi);

		let data;
		let datasource;

		if (ezz456chres.data.ac?.length) {
			data = ezz456chres.data;
			datasource = 'adsb.ezz456ch.xyz';
		} else if (adsblolres.data.ac?.length) {
			data = adsblolres.data;
			datasource = 'adsb.lol';
		} else {
			let embed;
			if (interaction.locale === 'th') {
				embed = new EmbedBuilder()
					.setColor('#FF5555')
					.setTitle(`ไม่พบเครื่องบิน / เที่ยวบินนี้`)
					.setDescription(`เครื่องบินอาจอยู่นอกพื้นที่ครอบคลุม\nคุณสามารถช่วยเพิ่มความครอบคลุมของข้อมูล ADS-B/MLAT ได้ที่นี่:\nadsb.ezz456ch.xyz: https://docs.ezz456ch.xyz/add-adsb-coverage\nadsb.lol: https://www.adsb.lol/docs/get-started/introduction`)
					.setFooter({ text: `Powered By adsb.ezz456ch.xyz, adsb.lol, hexdb.io, and PlaneSpotter` });
			} else {
				embed = new EmbedBuilder()
					.setColor('#FF5555')
					.setTitle(`Flight not found`)
					.setDescription(`The aircraft may be outside the coverage area.\nYou can help improve ADS-B/MLAT coverage here:\n\`adsb.ezz456ch.xyz\`: https://docs.ezz456ch.xyz/add-adsb-coverage\n\`adsb.lol\`: https://www.adsb.lol/docs/get-started/introduction`)
					.setFooter({ text: `Powered By adsb.ezz456ch.xyz, adsb.lol, hexdb.io, and PlaneSpotter` });
			}
			await interaction.editReply({ embeds: [embed] });
			return;
		}

		let callsign2 = data.ac[0].flight.trim();

		let hex = data.ac[0].hex != null ? data.ac[0].hex : "n/a";
		let reg = data.ac[0].r != null ? data.ac[0].r : "n/a"
		let type = data.ac[0].t != null ? data.ac[0].t : "n/a"
		let squawk = data.ac[0].squawk != null ? data.ac[0].squawk : "n/a";

		let gs = data.ac[0].gs != null ? data.ac[0].gs.toFixed(0) : "n/a";
		let tas = data.ac[0].tas != null ? data.ac[0].tas.toFixed(0) : "n/a";
		let ias = data.ac[0].ias != null ? data.ac[0].ias.toFixed(0) : "n/a";
		let mach = data.ac[0].mach != null ? data.ac[0].mach.toFixed(3) : "n/a";

		let alt_baro = data.ac[0].alt_baro !== "ground" && data.ac[0].alt_baro ? `${data.ac[0].alt_baro} ft` : (data.ac[0].alt_baro === "ground" ? "GND" : "n/a ft");
		let alt_geom = data.ac[0].alt_geom != null ? `${data.ac[0].alt_geom} ft` : "n/a ft";
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
		let photolink = null;

		try {
			const planespotter = await axios.get(`${planespottersapi}/${hex}`);
			const planespotterdata = planespotter.data;

			if (planespotterdata.photos && planespotterdata.photos.length > 0) {
				const photo = planespotterdata.photos[0];
				thumbnail_large = photo.thumbnail_large?.src ?? null;
				photographer = photo.photographer ?? null;
				photolink = photo.link ?? null;
			}
		} catch (error) {
			if (error.code === 'ETIMEOUT' || error.code === 'ENOTFOUND') {
				console.error(`[ERROR] [${nowutcstring}] Planespotter API request failed!`)
			} else {
				console.error(`[ERROR] [${nowutcstring}] An error occurred while fetching photo from planespotter:`, error);
			}
		}

		let imagecopyright = thumbnail_large
			? `Image © ${photographer}`
			: "No image available";

		let img_copyright_btn

		if (photolink) {
			img_copyright_btn = new ButtonBuilder()
				.setLabel(imagecopyright)
				.setURL(photolink)
				.setStyle(ButtonStyle.Link);
		} else {
			img_copyright_btn = new ButtonBuilder()
				.setCustomId('img_copyright_btn')
				.setLabel(imagecopyright)
				.setStyle(ButtonStyle.Danger)
				.setDisabled(true);
		}

		const img_copyright = new ActionRowBuilder()
			.addComponents(img_copyright_btn);

		let routeiata = "n/a";

		try {
			const hexdbiorouteres = await axios.get(`${hexdbiorouteiata}/${callsign}`);
			if (hexdbiorouteres && hexdbiorouteres.status === 200 && hexdbiorouteres.data) {
				const hexdbioroutedata = hexdbiorouteres.data;
				routeiata = hexdbioroutedata.route;
				updatetimerouteiata = new Date(hexdbioroutedata.updatetime * 1000).toUTCString();
			}
		} catch (error) {
			if (error.response) {
				if (error.response.status === 404) {
					console.warn(`[WARN] [${new Date().toUTCString()}] Route information not found for callsign: ${callsign2}`);
				} else {
					console.error(`[ERROR] [${new Date().toUTCString()}] An error occurred while fetching route information for callsign: ${callsign2} - Status: ${error.response.status}`, error);
				}
			} else if (error.request) {
				console.error(`[ERROR] [${new Date().toUTCString()}] No response received while fetching route information for callsign: ${callsign2}`, error);
			} else {
				console.error(`[ERROR] [${new Date().toUTCString()}] An error occurred while fetching route information for callsign: ${callsign2}`, error);
			}
		}

		let embed;
		if (interaction.locale === 'th') {
			embed = new EmbedBuilder()
				.setColor('#FFB6C1')
				.setTitle(callsign2)
				.addFields(
					{ name: `${callsign2} Information`, value: `\`\`\`yaml\nRoute: ${routeiata}\nReg.: ${reg}\nAircraft type: ${type}\nHex: ${hex.toUpperCase()}\nSquawk: ${squawk}\nPos.: ${lat}, ${lon}\`\`\``, inline: false },
					{ name: 'Speed', value: `\`\`\`yaml\nGround Speed: ${gs} kt\nTrue Airspeed: ${tas} kt\nIndicated Airspeed: ${ias} kt\nMach: ${mach}\`\`\``, inline: false },
					{ name: 'Altitude', value: `\`\`\`yaml\nBaro. Altitude: ${alt_baro} ft\nBaro. Rate: ${baro_rate} ft/min\nWGS84 Altitude: ${alt_geom} ft\nGeom. Rate: ${geom_rate} ft/min\nVert. Rate: ${vertrateindicator}${vertrate} ft/min\`\`\``, inline: false },
					{ name: 'Direction', value: `\`\`\`yaml\nGround Track: ${track}°\nTrue Heading: ${true_heading}°\nMagnetic Heading: ${mag_heading}°\`\`\``, inline: false },
					{ name: 'Wind', value: `\`\`\`yaml\nWind Direction: ${wind_indicator}${wd}°\nWind Speed: ${ws} kt\`\`\``, inline: false },
					{ name: 'Signal & Data Source', value: `\`\`\`yaml\nSource: ${source}\nRSSI: ${rssi}\nLast Pos.: ${seen_pos} s\nLast Seen: ${seen} s\`\`\``, inline: false },
				)
				.setImage(thumbnail_large)
				.setFooter({ text: `Powered By ${datasource}, hexdb.io and PlaneSpotter` });
		} else {
			embed = new EmbedBuilder()
				.setColor('#FFB6C1')
				.setTitle(callsign2)
				.addFields(
					{ name: `${callsign2} Information`, value: `\`\`\`yaml\nRoute: ${routeiata}\nReg.: ${reg}\nAircraft type: ${type}\nHex: ${hex.toUpperCase()}\nSquawk: ${squawk}\nPos.: ${lat}, ${lon}\`\`\``, inline: false },
					{ name: 'Speed', value: `\`\`\`yaml\nGround Speed: ${gs} kt\nTrue Airspeed: ${tas} kt\nIndicated Airspeed: ${ias} kt\nMach: ${mach}\`\`\``, inline: false },
					{ name: 'Direction', value: `\`\`\`yaml\nGround Track: ${track}°\nTrue Heading: ${true_heading}°\nMagnetic Heading: ${mag_heading}°\`\`\``, inline: false },
					{ name: 'Wind', value: `\`\`\`yaml\nWind Direction: ${wind_indicator}${wd}°\nWind Speed: ${ws} kt\`\`\``, inline: false },
					{ name: 'Signal & Data Source', value: `\`\`\`yaml\nSource: ${source}\nRSSI: ${rssi}\nLast Pos.: ${seen_pos} s\nLast Seen: ${seen} s\`\`\``, inline: false },
				)
				.setImage(thumbnail_large)
				.setFooter({ text: `Powered By ${datasource}, hexdb.io and PlaneSpotter` });
		}
		await interaction.editReply({
			embeds: [embed],
			components: [img_copyright],
		});
	}
};