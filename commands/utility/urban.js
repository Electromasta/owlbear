const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ud')
		.setDescription('Embed a Link from Urban Dictionary')
    .addStringOption(option => option
      .setName('term')
      .setDescription('The Term to Search on')
      .setRequired(true)),
	async execute(interaction) {
    const term = interaction.options.getString('term');
    console.log("/ud " + term);

    // The API call can take longer than Discord's 3 second reply window
    await interaction.deferReply();

    let reply = "No results found, hoot-hoot";
    const res = await fetch('https://api.urbandictionary.com/v0/define?term=' + encodeURIComponent(term));
    if (!res.ok) { throw new Error('Urban Dictionary returned ' + res.status); }
    const json = await res.json();

    if (json.list && json.list.length > 0) {
      reply = "From Urban Dictionary, " + term + ": " + json.list[0].definition;
      // Discord rejects messages over 2000 characters
      if (reply.length > 2000) { reply = reply.slice(0, 1997) + "..."; }
    }

    // Don't let the term or definition ping @everyone, roles, or users
		await interaction.editReply({ content: reply, allowedMentions: { parse: [] } });
	},
};
