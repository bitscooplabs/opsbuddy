'use strict';

const assert = require('assert');

const Sequelize = require('sequelize');
const _ = require('lodash');

const Users = require('../models/sql/users');


module.exports = function(event, context, callback) {
	let sequelize, users;

	let bitscoop = global.env.bitscoop;

	let query = event.queryStringParameters || {};

	Promise.resolve()
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
			return bitscoop.getConnection(query.existing_connection_id || query.connection_id)
		})
		.then(function(connection) {
			if (connection == null) {
				return Promise.reject(new Error('Invalid connection'));
			}

			if (!_.get(connection, 'auth.status.authorized', false)) {
				return Promise.reject(new Error('Connection is not authorized. In order to use this account you must grant the requested permissions.'));
			}

			if (query.existing_connection_id) {
				return users.update({
					googleAnalyticsConnectionId: query.existing_connection_id
				}, {
					where: {
						googleAnalyticsConnectionId: query.connection_id
					}
				});
			}

			return Promise.resolve();
		})
		.then(function() {
			sequelize.close();

			callback(null, {
				statusCode: 302,
				headers: {
					Location: '/prod'
				}
			});
		})
		.catch(function(err) {
			if (sequelize) {
				sequelize.close();
			}

			console.log(err);

			callback(null, {
				statusCode: 404,
				body: err.toString()
			});

			return Promise.reject(err);
		});
};
