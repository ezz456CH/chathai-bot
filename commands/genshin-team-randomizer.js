const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const characters = require('../data/gi-characters.json');

const client = require('../index');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('genshin-team-randomizer')
        .setDescription('Generate a random Genshin Impact team')
        .setDescriptionLocalizations({
            th: 'สุ่มทีม Genshin Impact'
        }),
    async execute(interaction) {
        await interaction.deferReply();

        const elements = {
            pyro: '1236278501594759178',
            hydro: '1236278499334029332',
            anemo: '1236278490123341864',
            electro: '1236278494497869875',
            dendro: '1236278496997675088',
            cryo: '1236278503528464434',
            geo: '1236278492363096146',
        };

        const characterelements = characters.reduce((acc, { name, element }) => {
            acc[name] = elements[element];
            return acc;
        }, {});

        const getRandomCharacter = () => characters[Math.floor(Math.random() * characters.length)];

        let rc1, rc2, rc3, rc4;

        do {
            rc1 = getRandomCharacter();
            rc2 = getRandomCharacter();
            rc3 = getRandomCharacter();
            rc4 = getRandomCharacter();
        } while (new Set([rc1, rc2, rc3, rc4]).size < 4);

        const eemoji1 = client.emojis.cache.get(characterelements[rc1.name]);
        const eemoji2 = client.emojis.cache.get(characterelements[rc2.name]);
        const eemoji3 = client.emojis.cache.get(characterelements[rc3.name]);
        const eemoji4 = client.emojis.cache.get(characterelements[rc4.name]);

        let embed;

        if (interaction.locale === 'th') {
            embed = new EmbedBuilder()
                .setColor('#1ABC9C')
                .setTitle('สุ่มทีม Genshin Impact')
                .setDescription(`${eemoji1} ${rc1.name}\n${eemoji2} ${rc2.name}\n${eemoji3} ${rc3.name}\n${eemoji4} ${rc4.name}`)
                .setFooter({ text: 'ไม่มีส่วนเกี่ยวข้องกับ HoYoverse อันนี้มีไว้เพื่อความบันเทิงเฉยๆ น่ะ' });
        } else {
            embed = new EmbedBuilder()
                .setColor('#1ABC9C')
                .setTitle('Genshin Impact Team Randomizer')
                .setDescription(`${eemoji1} ${rc1.name}\n${eemoji2} ${rc2.name}\n${eemoji3} ${rc3.name}\n${eemoji4} ${rc4.name}`)
                .setFooter({ text: 'Not affiliated with HoYoverse. This is just for entertainment purposes.' });
        }

        await interaction.editReply({ embeds: [embed] });
    }
};