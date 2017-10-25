'use strict';

const Sequelize = require('sequelize');


let schema = {
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
};


module.exports = function(db) {
	let model = db.define('users', schema, {
		timestamps: false
	});

	return model.sync()
		.then(function() {
			return model;
		});
};
