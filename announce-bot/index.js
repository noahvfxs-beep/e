require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { buildEmbed, buildEmbedCode } = require('./utils');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

// Load every command file in ./commands
const commandsPath = path.join(__dirname, 'commands');
for (const file of fs.readdirSync(commandsPath).filter((f) => f.endsWith('.js'))) {
  const command = require(path.join(commandsPath, file));
  client.commands.set(command.data.name, command);
}

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async (interaction) => {
  try {
    // Slash command -> shows the modal (title/message/image questions)
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;
      await command.execute(interaction);
      return;
    }

    // Modal submitted -> build the embed from the answers
    if (interaction.isModalSubmit()) {
      const title = interaction.fields.getTextInputValue('title');
      const message = interaction.fields.getTextInputValue('message');
      const image = interaction.fields.getTextInputValue('image');

      if (interaction.customId === 'announceModal') {
        const embed = buildEmbed({ title, message, image });
        // Posts publicly in the channel the command was run in
        await interaction.channel.send({ embeds: [embed] });
        await interaction.reply({ content: 'Announcement posted.', ephemeral: true });
        return;
      }

      if (interaction.customId === 'embedModal') {
        const embed = buildEmbed({ title, message, image });
        const code = buildEmbedCode({ title, message, image });
        // Ephemeral: only the person who ran /embed sees the preview + code
        await interaction.reply({
          content: `Here's your embed code:\n${code}`,
          embeds: [embed],
          ephemeral: true,
        });
        return;
      }
    }
  } catch (err) {
    console.error(err);
    if (interaction.isRepliable() && !interaction.replied && !interaction.deferred) {
      await interaction.reply({ content: 'Something went wrong. Check the console log.', ephemeral: true });
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
