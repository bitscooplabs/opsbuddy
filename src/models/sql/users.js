'use strict';

const Sequelize = require('sequelize');


class Users {
	constructor(sql) {
		this.Users = sql.define('user', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			username: {
				type: Sequelize.STRING
			},
			githubUser: {
				type: Sequelize.STRING,
				field: 'github_user'
			},
			githubRepo: {
				type: Sequelize.STRING,
				field: 'github_repo'
			},
			githubEnabled: {
				type: Sequelize.BOOLEAN,
				field: 'github_enabled'
			},
			googleId: {
				type: Sequelize.STRING,
				field: 'google_id'
			},
			googleAnalyticsConnectionId: {
				type: Sequelize.STRING,
				field: 'google_analytics_connection_id'
			},
			googleViewId: {
				type: Sequelize.STRING,
				field: 'google_view_id'
			},
			googleEnabled: {
				type: Sequelize.BOOLEAN,
				field: 'google_enabled'
			},
			postmanId: {
				type: Sequelize.STRING,
				field: 'postman_id'
			},
			postmanApiKey: {
				type: Sequelize.STRING,
				field: 'postman_api_key'
			},
			postmanEnabled: {
				type: Sequelize.BOOLEAN,
				field: 'postman_enabled'
			},
			statuscakeId: {
				type: Sequelize.STRING,
				field: 'statuscake_id'
			},
			statuscakeEnabled: {
				type: Sequelize.BOOLEAN,
				field: 'statuscake_enabled'
			},
			statuscakeApiKey: {
				type: Sequelize.STRING,
				field: 'statuscake_api_key'
			},
			statuscakeUsername: {
				type: Sequelize.STRING,
				field: 'statuscake_username'
			},
			email: {
				type: Sequelize.STRING
			},
			upperEmail: {
				type: Sequelize.STRING,
				field: '_upper_email'
			},
			joined: {
				type: Sequelize.DATE
			},
			accountConnectionId: {
				type: Sequelize.STRING,
				field: 'account_connection_id'
			}
		}, {
			timestamps: false
		});
	}

	count(options) {
		let self = this;

		return this.Users.sync()
			.then(function() {
				return self.Users.count(options);
			});
	}

	create(val) {
		let self = this;

		return this.Users.sync()
			.then(function() {
				return self.Users.create(val);
			});
	}

	destroy(options) {
		let self = this;

		return this.Users.sync()
			.then(function() {
				return self.Users.destroy(options);
			});
	}

	update(val, options) {
		let self = this;

		return this.Users.sync()
			.then(function() {
				return self.Users.update(val, options);
			});
	}

	find(options) {
		let self = this;

		return this.Users.sync()
			.then(function() {
				return self.Users.find(options);
			});
	}

	findAll() {
		let self = this;

		return this.Users.sync()
			.then(function() {
				return self.Users.findAll();
			});
	}

	findOne(options) {
		let self = this;

		return this.Users.sync()
			.then(function() {
				return self.Users.findOne(options);
			});
	}

	findOrCreate(options) {
		let self = this;

		return this.Users.sync()
			.then(function() {
				return self.Users.findOrCreate(options);
			});
	}
}


module.exports = Users;
