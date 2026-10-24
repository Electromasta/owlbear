const { SlashCommandBuilder } = require('discord.js');

// XdY, XdY+Z or XdY-Z, where X is optional (d20 means 1d20)
const DICE_PATTERN = /^(\d*)d(\d+)(?:([+-])(\d+))?$/i;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roll')
		.setDescription('Rolls a set of dice using Dice Notation adx+y')
    .addStringOption(option => option
      .setName('dice')
      .setDescription('The Dice to Roll')
      .setRequired(true)),
	async execute(interaction) {
    const dicestring = interaction.options.getString('dice');
    console.log("/roll " + dicestring);

    const match = dicestring.replace(/\s+/g, '').match(DICE_PATTERN);
    if (!match) {
      await interaction.reply("I can't read that, try something like 2d6+3, hoot-hoot");
      return;
    }

    const amount = match[1] === '' ? 1 : Number(match[1]);
    const sides = Number(match[2]);
    const modifier = match[3] === '-' ? -Number(match[4]) : Number(match[4] ?? 0);

    let error = null;
    if (amount < 1) { error = "I need at least one die, hoot-hoot"; }
    if (amount > 100) { error = "Amount can't be larger than 100, hoot-hoot"; }
    if (sides < 1) { error = "Dice need at least one side, hoot-hoot"; }
    if (sides > 100) { error = "Dice can't be larger than 100, hoot-hoot"; }
    if (Math.abs(modifier) > 1000) { error = "That's too scary, hoot-hoot"; }
    if (error) {
      await interaction.reply(error);
      return;
    }

    const rolls = [];
    for (let i = 0; i < amount; i++) {
      rolls.push(Math.floor(Math.random() * sides) + 1);
    }
    const result = rolls.reduce((sum, d) => sum + d, 0) + modifier;

    const modifierText = modifier === 0 ? "" : (modifier > 0 ? "+" : "") + modifier;
    let reply = "Rolling: " + amount + "d" + sides + modifierText + " => [ " + rolls.join(", ") + " ]";
    if (modifier !== 0) { reply += " " + modifierText; }
    reply += " = " + result;

		await interaction.reply(reply);
	},
};
