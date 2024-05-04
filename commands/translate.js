const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('translate')
        .setDescription('Translate')
        .setDescriptionLocalizations({
            th: 'แปลภาษา'
        })
        .addStringOption(option =>
            option
                .setName('text')
                .setDescription('Text to be translated')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('target')
                .setDescription('Target language')
                .setRequired(true)
                .addChoices(
                    { name: 'English', value: 'en' },
                    { name: 'Thai', value: 'th' },
                )
        ),
    async execute(interaction) {
        const { options } = interaction;
        const text = options.getString('text');
        const target = options.getString('target');
        const ctapikey = process.env.ctapikey;
        const url = `https://translation.googleapis.com/language/translate/v2?key=${ctapikey}&q=${text}&target=${target}`

        await interaction.deferReply();
        const response = await axios.get(url);
        const translation = response.data.data.translations[0];
        const translatedText = translation.translatedText;
        const dctext = he.decode(translatedText);

        let embed;

        if (interaction.locale === 'th') {
            embed = new EmbedBuilder()
                .setColor('#BCC0C0')
                .setTitle('แปลภาษา')
                .setDescription(`${dctext}`)
                .setFooter({ text: 'Powered By Google Cloud Translate API' });
        } else {
            embed = new EmbedBuilder()
                .setColor('#BCC0C0')
                .setTitle('Translate')
                .setDescription(`${dctext}`)
                .setFooter({ text: 'Powered By Google Cloud Translate API' });
        }

        await interaction.editReply({ embeds: [embed] });
    }
};

