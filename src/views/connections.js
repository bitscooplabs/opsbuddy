'use strict';

const assert = require('assert');

const Sequelize = require('sequelize');
const _ = require('lodash');
const cookie = require('cookie');

const Users = require('../models/sql/users');
const authenticate = require('../middleware/authentication');


function create(event, context, callback) {
	let sequelize, user, users;

	return Promise.resolve()
		.then(function() {
			try {
				assert(process.env.HOST != null, 'Unspecified RDS host.');
				assert(process.env.PORT != null, 'Unspecified RDS port.');
				assert(process.env.USER != null, 'Unspecified RDS user.');
				assert(process.env.PASSWORD != null, 'Unspecified RDS password.');
				assert(process.env.DATABASE != null, 'Unspecified RDS database.');
			} catch(err) {
				return Promise.reject(err);
			}

			sequelize = new Sequelize(process.env.DATABASE, process.env.USER, process.env.PASSWORD, {
				host: process.env.HOST,
				port: process.env.PORT,
				dialect: 'mysql',
				logging: false
			});

			users = new Users(sequelize);

			return Promise.resolve();
		})
		.then(function() {
			let cookies = _.get(event, 'headers.Cookie', '');
			let sessionId = cookie.parse(cookies).social_demo_session_id;

			return authenticate(sequelize, sessionId);
		})
		.then(function(result) {
			[, user] = result;

			let mapId = process.env.GOOGLE_ANALYTICS_MAP_ID;

			let bitscoop = global.env.bitscoop;

			return bitscoop.createConnection(mapId, {
				redirect_url: process.env.SITE_URL + '/complete-service'
			});
		})
		.then(function(result) {
				return users.update({
					googleAnalyticsConnectionId: result.id
				}, {
					where: {
						id: user.id
					}
				})
				.then(function() {
					sequelize.close();

					callback(null, {
						statusCode: 302,
						headers: {
							Location: result.redirectUrl
						}
					});
				});
		})
		.catch(function(err) {
			if (sequelize) {
				sequelize.close();
			}

			console.log(err);

			callback(null, {
				statusCode: 500,
				body: err.toString()
			});

			return Promise.reject(err);
		});
}



function del(event, context, callback) {
	let sequelize, user, users;

	return Promise.resolve()
		.then(function() {
			try {
				assert(process.env.HOST != null, 'Unspecified RDS host.');
				assert(process.env.PORT != null, 'Unspecified RDS port.');
				assert(process.env.USER != null, 'Unspecified RDS user.');
				assert(process.env.PASSWORD != null, 'Unspecified RDS password.');
				assert(process.env.DATABASE != null, 'Unspecified RDS database.');
			} catch(err) {
				return Promise.reject(err);
			}

			sequelize = new Sequelize(process.env.DATABASE, process.env.USER, process.env.PASSWORD, {
				host: process.env.HOST,
				port: process.env.PORT,
				dialect: 'mysql',
				logging: false
			});

			users = new Users(sequelize);

			return Promise.resolve();
		})
		.then(function() {
			let cookies = _.get(event, 'headers.Cookie', '');
			let sessionId = cookie.parse(cookies).social_demo_session_id;

			return authenticate(sequelize, sessionId);
		})
		.then(function(result) {
			[, user] = result;

			return users.findOne({
				where: {
					id: user.id
				}
			});
		})
		.then(function(result) {
			let bitscoop = global.env.bitscoop;

			return bitscoop.deleteConnection(result.googleAnalyticsConnectionId);
		})
		.then(function() {
			return users.update({
				googleAnalyticsConnectionId: null
			}, {
				where: {
					id: user.id
				}
			});
		})
		.then(function() {
			sequelize.close();

			callback(null, {
				statusCode: 204
			});
		})
		.catch(function(err) {
			if (sequelize) {
				sequelize.close();
			}

			console.log(err);

			callback(null, {
				statusCode: 500,
				body: err.toString()
			});

			return Promise.reject(err);
		});
}


module.exports = {
	create: create,
	delete: del
};
