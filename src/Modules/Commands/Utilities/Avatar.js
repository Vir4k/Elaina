const Command = require('../../../Structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Colors } = require('../../../Structures/Configuration.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['av'],
			description: 'Showing avatar of the mentioned user!',
			category: 'Utilities',
			usage: '(member)',
			cooldown: 5000
		});
	}

	async run(message, [target]) {
		const user = await this.client.resolveUser(target) || message.author;

		const embed = new MessageEmbed()
			.setColor(Colors.DEFAULT)
			.setAuthor(user.tag, user.displayAvatarURL({ dynamic: true }))
			.setDescription([
				`\`ID: ${user.id}\``,
				`[Click here to download](${user.displayAvatarURL({ format: 'png', dynamic: true, size: 4096 })})`
			].join('\n'))
			.setImage(user.displayAvatarURL({ dynamic: true, size: 512 }))
			.setFooter(`Responded in ${this.client.utils.responseTime(message)}`, message.author.avatarURL({ dynamic: true }));

		return message.reply({ embeds: [embed] });
	}

};
