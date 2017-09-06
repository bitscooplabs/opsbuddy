'use strict';

const Sessions = require('../models/sql/sessions');
const Users = require('../models/sql/users');


module.exports = function(sequelize, cookie) {
	let sessions = new Sessions(sequelize);
	let users = new Users(sequelize);

	return Promise.resolve()
		.then(function() {
			return sessions.findOne({
				where: {
					token: cookie
				}
			})
			.then(function(session) {
				if (session) {
					return users.findOne({
						where: {
							id: session.user
						}
					})
						.then(function(user) {
							return Promise.resolve([session, user]);
						});
				}
				else {
					return Promise.resolve([null, null]);
				}
			});
		})
		.catch(function(err) {
			return Promise.reject(err);
		});
};
