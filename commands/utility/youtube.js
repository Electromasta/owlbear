const { SlashCommandBuilder } = require('discord.js');
const youtube = require("youtube-sr").default;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('yt')
		.setDescription('Embed a video from youtube')
    .addStringOption(option => option
      .setName('term')
      .setDescription('The Term to Search on')
      .setRequired(true)),
	async execute(interaction) {
    const term = interaction.options.getString('term');
    console.log("/yt " + term);

    // The search can take longer than Discord's 3 second reply window
    await interaction.deferReply();

    let reply = "No results found, hoot-hoot";
    const [video] = await youtube.search(term, { limit: 1, type: 'video' });

    if (video) {
      reply = 'Youtube Results for ' + term + ': ' + 'https://www.youtube.com/watch?v=' + video.id;
    }

    // Don't let the term ping @everyone, roles, or users
		await interaction.editReply({ content: reply, allowedMentions: { parse: [] } });
	},
};
