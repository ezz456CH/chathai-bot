const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('error-msg')
        .setDescription('Get error message')
        .setDescriptionLocalizations({
            th: 'ดูข้อความ Error'
        }),
    async execute(interaction) {
        await interaction.deferReply();
        let embed;

        embed = new EmbedBuilder()
            .setTitle('กำลังจะทำลายตัวเองในอีก 3..2..1...ตู้ม')
            .setColor('#FFC0C0')

        await interaction.editReply({ embeds: [embed] });
        const a = undefined;
        a.foo();
    }
};
