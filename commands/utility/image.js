const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const braveKey = process.env.BRAVE_KEY;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('img')
		.setDescription('Embed an Image from a Search')
    .addStringOption(option => option
      .setName('term')
      .setDescription('The Term to Search on')
      .setRequired(true)),
	async execute(interaction) {
    const term = interaction.options.getString('term');
    console.log("/img " + term);

    // The API call can take longer than Discord's 3 second reply window
    await interaction.deferReply();

    const res = await fetch('https://api.search.brave.com/res/v1/images/search?count=1&safesearch=strict&q=' + encodeURIComponent(term), {
      headers: { 'Accept': 'application/json', 'X-Subscription-Token': braveKey },
    });
    if (!res.ok) { throw new Error('Brave Search returned ' + res.status); }
    const json = await res.json();

    const image = json.results && json.results[0];
    if (!image) {
      await interaction.editReply({ content: "No results found, hoot-hoot", allowedMentions: { parse: [] } });
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle((image.title || term).slice(0, 256))
      .setURL(image.url)
      .setImage(image.properties?.url ?? image.thumbnail?.src)
      .setFooter({ text: 'Image results for ' + term.slice(0, 200) });

		await interaction.editReply({ embeds: [embed], allowedMentions: { parse: [] } });
	},
};
