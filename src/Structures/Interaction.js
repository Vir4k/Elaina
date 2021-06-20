module.exports = class Interaction {

	constructor(client, name, options = {}) {
		this.client = client;
		this.name = options.name || name;
		this.description = options.description || 'No description provided.';
		this.options = options.options || [];
	}

	/* eslint-disable no-unused-vars */ /* eslint-disable no-bitwise */ /* eslint-disable no-undef */
	async run(interaction, args = [string | number | boolean | undefined]) {
		throw new Error(`Interaction ${this.name} doesn't provide a run method!`);
	}

};
