const { EmbedBuilder } = require('discord.js');

const DEFAULT_COLOR = '#FF2DAF'; // matches the swats.lol pink from your screenshot, change if you want

/**
 * Builds an EmbedBuilder from the raw text the user typed into the modal.
 */
function buildEmbed({ title, message, image, color }) {
  const embed = new EmbedBuilder()
    .setTitle(title)
    .setDescription(message)
    .setColor(color || DEFAULT_COLOR)
    .setTimestamp();

  if (image && isValidUrl(image)) {
    embed.setImage(image);
  }

  return embed;
}

/**
 * Turns the same answers into a copy-pasteable discord.js code block,
 * so /embed can hand back reusable code instead of (or in addition to) posting.
 */
function buildEmbedCode({ title, message, image, color }) {
  const lines = [
    '```js',
    'const { EmbedBuilder } = require(\'discord.js\');',
    '',
    'const embed = new EmbedBuilder()',
    `  .setTitle(${JSON.stringify(title)})`,
    `  .setDescription(${JSON.stringify(message)})`,
    `  .setColor(${JSON.stringify(color || DEFAULT_COLOR)})`,
  ];

  if (image && isValidUrl(image)) {
    lines.push(`  .setImage(${JSON.stringify(image)})`);
  }

  lines.push('  .setTimestamp();', '', '// then send it:', 'channel.send({ embeds: [embed] });', '```');

  return lines.join('\n');
}

function isValidUrl(str) {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

module.exports = { buildEmbed, buildEmbedCode, isValidUrl, DEFAULT_COLOR };
