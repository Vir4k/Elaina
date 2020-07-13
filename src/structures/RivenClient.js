const { Client, Collection, Intents } = require('discord.js');
const Util = require('./Util.js');

module.exports = class RivenClient extends Client {

	/* eslint-disable func-names */
	constructor(options = {}) {
		super({
			ws: { intents: Intents.ALL }
		});
		this.validate(options);
		this.commands = new Collection();
		this.aliases = new Collection();
		this.events = new Collection();
		this.utils = new Util(this);
		this.embeds = new (require('./Embeds.js'))(this);
		this.functions = require('./Functions.js');
		this.database = require('./database/mongodb.js');

		this.guildsData = require('./database/models/Guild.js');

		this.databaseCache = {};
		this.databaseCache.guilds = new Collection();

		String.prototype.toProperCase = function () {
			return this.replace(/([^\W_]+[^\s-]*) */g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
		};

		Number.prototype.formatNumber = function () {
			return this.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
		};

		Array.prototype.random = function () {
			return this[Math.floor(Math.random() * this.length)];
		};
	}

	async findOrCreateGuild({ id: guildID, isLean }) { // eslint-disable-next-line no-async-promise-executor
		return new Promise(async (resolve) => {
			if (this.databaseCache.guilds.get(guildID)) {
				resolve(isLean ? this.databaseCache.guilds.get(guildID).toJSON() : this.databaseCache.guilds.get(guildID));
			} else {
				let guildData = isLean ? await this.guildsData.findOne({ id: guildID }).populate('members').lean() : await this.guildsData.findOne({ id: guildID }).populate('members');
				if (guildData) {
					resolve(guildData);
				} else { // eslint-disable-next-line new-cap
					guildData = new this.guildsData({ id: guildID });
					await guildData.save();
					resolve(isLean ? guildData.toJSON() : guildData);
				}
				this.databaseCache.guilds.set(guildID, guildData);
			}
		});
	}

	/* eslint-disable no-empty-function */ /* eslint-disable consistent-return */
	async resolveUser(search) {
		let user = null;
		if (!search || typeof search !== 'string') return;
		if (search.match(/^<@!?(\d+)>$/)) {
			const id = search.match(/^<@!?(\d+)>$/)[1];
			user = this.users.fetch(id).catch(() => {});
			if (user) return user;
		}
		if (search.match(/^!?(\w+)#(\d+)$/)) {
			const username = search.match(/^!?(\w+)#(\d+)$/)[0];
			const discriminator = search.match(/^!?(\w+)#(\d+)$/)[1];
			user = this.users.find((us) => us.username === username && us.discriminator === discriminator);
			if (user) return user;
		}
		user = await this.users.fetch(search).catch(() => {});
		return user;
	}

	validate(options) {
		if (typeof options !== 'object') throw new TypeError('Options should be a type of Object.');

		if (!options.token) throw new Error('You must pass the token for the client.');
		this.token = options.token;

		if (!options.prefix) throw new Error('You must pass a prefix for the client.');
		if (typeof options.prefix !== 'string') throw new TypeError('Prefix should be a type of String.');
		this.prefix = options.prefix;

		if (!options.owner) throw new Error('You must pass a owner id for the client.');
		this.owner = options.owner;
	}

	async start(token = this.token) {
		this.utils.loadCommands();
		this.utils.loadEvents();
		this.database.init();
		super.login(token);
	}

};
