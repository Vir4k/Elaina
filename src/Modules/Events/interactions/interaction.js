const Event = require('../../../Structures/Event.js');

module.exports = class extends Event {

	async run(interaction) {
		if (!interaction.isCommand()) return;

		try {
			const command = this.client.interactions.get(interaction.command.name);
			// eslint-disable-next-line id-length
			await command.run(interaction, interaction.options.array().map((v) => v.value));
		} catch (error) {
			console.log(error);
		}
	}

};
