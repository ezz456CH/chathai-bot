const path = require('path');
const fs = require('fs');
const { Client, Collection, REST, Routes, GatewayIntentBits, EmbedBuilder } = require('discord.js');
require('dotenv/config');

const date = new Date();
const nowutcstring = date.toUTCString();

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
})

module.exports = client;

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

console.log(`${[nowutcstring]} [INFO] Loading commands from ${commandsPath}...`);
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.warn(`${[nowutcstring]} [WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

console.log(`${[nowutcstring]} [INFO] Registering slash commands...`);
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
(async () => {
    try {
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: client.commands.map(cmd => cmd.data.toJSON()) },
        );

        console.log(`${[nowutcstring]} [INFO] Slash commands were registered successfully!`);
    } catch (error) {
        console.error(`${[nowutcstring]} [ERROR] There was an error while registering slash commands:`, error);
    }
})();

client.on('ready', () => {
    console.log(`${[nowutcstring]} [INFO] Bot is ready Meow!`);

    client.user.setActivity({
        name: '> /help',
    });
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(`[ERROR] [${nowutcstring}] An error occurred!:`, error);
        let embed;
        if (interaction.locale === 'th') {
            embed = new EmbedBuilder()
                .setColor('#FF5555')
                .setTitle(`(╯°□°）╯︵ ┻━┻ ▹ อิหยังวะ!?`)
                .setDescription(`ขออภัย ดูเหมือนว่าจะมีข้อผิดพลาดเกิดขึ้นน่ะ`)
                .setFooter({ text: 'เจอปัญหางั้นเหรอ สามารถแจ้งได้ที่ https://discord.gg/hdXVK6fMpD หรือตั้ง Issue ที่ Github ก็ได้นะ (っ◕‿◕)っ' });
        } else {
            embed = new EmbedBuilder()
                .setColor('#FF5555')
                .setTitle(`(╯°□°）╯︵ ┻━┻ ▹ What's happening!?`)
                .setDescription(`Sorry it looks like there was an error.`)
                .setFooter({ text: 'If you find a problem, you can report it at https://discord.gg/hdXVK6fMpD or create an issue on Github (っ◕‿◕)っ' });
        }
        try {

            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ embeds: [embed] });
            } else {
                await interaction.reply({ embeds: [embed] });
            }
        } catch (error) {
            console.error(`[ERROR] [${nowutcstring}] An error occurred while sending the error message:`, error);
        }
    }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction) return;
    if (!interaction.isChatInputCommand()) return;
    else {
        try {
            const channel = client.channels.cache.get(process.env.logchannel);

            if (channel === undefined) {
                console.warn(`[WARNING] [${nowutcstring}] failed to send log: seem like log channel id is invalid`)
                return;
            }

            const commandname = interaction.commandName;

            let embed = new EmbedBuilder()
                .setColor('ADD8E6')
                .setTitle('Command Log')
                .addFields(
                    { name: 'Command', value: `/${commandname}`, inline: true },
                )
                .setTimestamp()

            await channel.send({ embeds: [embed] })
        } catch (error) {
            console.error(`[ERROR] [${nowutcstring}] failed to send log:`, error)
        }
    }
});

client.login(process.env.TOKEN);