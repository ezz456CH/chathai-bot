const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('minecraft-skin')
        .setDescription('Get Minecraft skin from username')
        .setDescriptionLocalizations({
            th: 'สกิน Minecraft จาก Username'
        })
        .addStringOption(option =>
            option
                .setName('username')
                .setDescription('Minecraft username')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('image-option')
                .setDescription('Skin image option')
                .setRequired(false)
                .addChoices(
                    { name: 'Head(Without 2nd layer)', value: 'avatar' },
                    { name: 'Isometric head', value: 'headhelm' },
                )
        ),
    async execute(interaction) {
        await interaction.deferReply();

        const username = interaction.options.getString('username');
        const imageoption = interaction.options.getString('image-option');

        let url;

        if (!imageoption) {
            url = `https://mineskin.eu/skin/${username}`;
        } else if (imageoption) {
            url = `https://mineskin.eu/${imageoption}/${username}`;
        }
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(response.data, 'binary');

        let embed

        if (interaction.locale === 'th') {
            embed = new EmbedBuilder()
                .setColor('#BCC0C0')
                .setTitle(`สกินของ ${username}`)
                .setImage('attachment://skin.png')
                .setFooter({ text: 'Powered By https://mineskin.eu API\nไม่มีส่วนเกี่ยวข้องกับ Mojang' });
        } else {
            embed = new EmbedBuilder()
                .setColor('#BCC0C0')
                .setTitle(`${username}'s skin`)
                .setImage('attachment://skin.png')
                .setFooter({ text: 'Powered By https://mineskin.eu API\nNot affiliated with Mojang.' });
        }
        await interaction.editReply({ embeds: [embed], files: [{ attachment: buffer, name: 'skin.png' }] });
    },
}