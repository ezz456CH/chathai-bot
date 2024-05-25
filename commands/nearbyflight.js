const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { pagination, ButtonTypes, ButtonStyles } = require('@devraelfreeze/discordjs-pagination');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nearbyflight')
        .setDescription('Get nearby flight data from adsb.ezz456ch.xyz with latitude and longitude')
        .setDescriptionLocalizations({
            th: 'ดูข้อมูลเครื่องบินใกล้เคียงจาก adsb.ezz456ch.xyz ด้วยละติจูดและลองติจูด'
        })
        .addNumberOption(option =>
            option
                .setName('lat')
                .setDescription('Latitude')
                .setRequired(true)
        )
        .addNumberOption(option =>
            option
                .setName('lon')
                .setDescription('Longitude')
                .setRequired(true)
        )
        .addNumberOption(option =>
            option
                .setName('radius_mni')
                .setDescription('Radius in nautical miles (Max 250 MNI)')
                .setRequired(true)
        ),
    async execute(interaction) {
        const lat = interaction.options.getNumber('lat');
        const lon = interaction.options.getNumber('lon');
        const radius = interaction.options.getNumber('radius_mni');
        const url = `https://api.ezz456ch.xyz/api/v2/circle/${lat}/${lon}/${radius}`;

        await interaction.deferReply();

        const response = await axios.get(url);
        const data = response.data;

        if (!data.ac?.length) {
            let embed = new EmbedBuilder()
                .setColor('#FF5555')
                .setTitle(interaction.locale === 'th' ? `(╯°□°）╯︵ ┻━┻ ▹ ไม่มีเครื่องบินในระยะใกล้เคียง` : `(╯°□°）╯︵ ┻━┻ ▹ No nearby flights found`)
                .setFooter({ text: `Powered By adsb.ezz456ch.xyz` });

            await interaction.editReply({ embeds: [embed] });
            return;
        }

        let embeds = data.ac.map(flight => {

            let callsign = flight.flight != null ? flight.flight.trim() : flight.hex.toUpperCase();
            let callsign2 = flight.flight != null ? flight.flight.trim() : "No callsign";

            let reg = flight.r != null ? flight.r : "?"
            let type = flight.t != null ? flight.t : "?"
            let gs = flight.gs != null ? flight.gs.toFixed(0) : "?";
            let alt_baro = flight.alt_baro != null ? flight.alt_baro : "?";

            let vertrate = flight.baro_rate != null ? flight.baro_rate : (flight.geom_rate != null ? flight.geom_rate : "n/a");
            let vertrateindicator = "";
            if (vertrate !== "n/a") {
                if (vertrate > 256) {
                    vertrateindicator = "▲";
                } else if (vertrate < -256) {
                    vertrateindicator = "▼";
                }
            }

            return new EmbedBuilder()
                .setColor('#f279af')
                .setTitle(callsign2)
                .addFields(
                    { name: `${callsign} Information`, value: `\`\`\`yaml\n${reg} ${type}\n${gs} kt ${vertrateindicator}${alt_baro} ft\n${callsign}\`\`\``, inline: true },
                )
                .setFooter({ text: `Powered By adsb.ezz456ch.xyz` });
        });

        await pagination({
            embeds: embeds,
            author: interaction.member.user,
            interaction: interaction,
            ephemeral: false,
            time: 40000,
            disableButtons: true,
            fastSkip: true,
            pageTravel: false,
            buttons: [
                {
                    type: ButtonTypes.previous,
                    label: 'Previous Page',
                    style: ButtonStyles.Primary
                },
                {
                    type: ButtonTypes.next,
                    label: 'Next Page',
                    style: ButtonStyles.Success
                }
            ]
        });
    },
};
