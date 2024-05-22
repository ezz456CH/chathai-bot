const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('donate')
        .setDescription('Support ezz456CH by donating ❤')
        .setDescriptionLocalizations({
            th: 'เลี้ยงค่าขนมให้ ezz456CH ด้วยการโดเนท ❤'
        }),
    async execute(interaction) {
        await interaction.deferReply();

        let embed;

        if (interaction.locale === 'th') {
            embed = new EmbedBuilder()
                .setColor('#FFDBD9')
                .setTitle('เลี้ยงค่าขนมให้ ezz456CH ❤')
                .setDescription(`EasyDonate: https://ezdn.app/ezz456CH`)
                .setFooter({ text: 'ขอขอบคุณสำหรับการโดเนทด้วยนะครับ (=^･ω･^=)' })
        } else {
            embed = new EmbedBuilder()
                .setColor('#FFDBD9')
                .setTitle('Support ezz456CH ❤')
                .setDescription(`EasyDonate: https://ezdn.app/ezz456CH`)
                .setFooter({ text: 'Thank you for your support (=^･ω･^=)' })
        }

        await interaction.editReply({ embeds: [embed] });
    }
};

