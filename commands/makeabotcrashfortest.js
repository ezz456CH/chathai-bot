const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('crash')
        .setDescription('Force the bot to crash (it doesn\'t actually crash, it just forces to give an error response)')
        .setDescriptionLocalizations({
            th: 'บังคับให้บอตตุย(Crash) (จริงๆ แล้วมันไม่ได้ Crash หรอก แค่บังคับให้บอตตอบข้อความ Error เฉยๆน่ะ)'
        }),
    async execute(interaction) {
        if (interaction.user.id === '519858641298391060') {
            await interaction.deferReply();
            let embed;

            embed = new EmbedBuilder()
                .setTitle('กำลังจะทำลายตัวเองในอีก 3..2..1...ตู้ม')
                .setColor('#FFC0C0')

            await interaction.editReply({ embeds: [embed] });
            const a = undefined;
            a.foo();
        } else {
            await interaction.deferReply();
            let embed;

            embed = new EmbedBuilder()
                .setTitle('คุณไม่มีสิทธิ์ใช้คําสั่งนี้น่ะ เพราะฉะนั้นจงอดไปซะ!')
                .setImage('https://ezz456ch.xyz/kae_mai_me_sid.png')
                .setColor('#FFC0C0')

            await interaction.editReply({ embeds: [embed] });
        }
    }
};
