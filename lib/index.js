'use strict';

const assert = require('assert');

const Alexa = require('alexa-sdk');
const BitScoop = require('bitscoop-sdk');
const Sequelize = require('sequelize');
const request = require('request');

const intents = require('./intents');


global.env = {
	name: 'Ops Buddy',
	bitscoop: new BitScoop(process.env.BITSCOOP_API_KEY)
};


var handlers = {
	StackIntent: function() {
		let sequelize, users;
		let self = this;

		Promise.resolve()
			.then(function() {
				try {
					assert(process.env.HOST != null, 'Unspecified RDS host.');
					assert(process.env.PORT != null, 'Unspecified RDS port.');
					assert(process.env.USER != null, 'Unspecified RDS user.');
					assert(process.env.PASSWORD != null, 'Unspecified RDS password.');
					assert(process.env.DATABASE != null, 'Unspecified RDS database.');
					assert(process.env.BITSCOOP_API_KEY != null, 'Unspecified BitScoop API key.');
					assert(process.env.ALEXA_APP_ID != null, 'Unspecified Alexa app ID.');
				} catch(err) {
					return Promise.reject(err);
				}

				sequelize = new Sequelize(process.env.DATABASE, process.env.USER, process.env.PASSWORD, {
					host: process.env.HOST,
					port: process.env.PORT,
					dialect: 'mysql',
					logging: false
				});

				return Promise.resolve();
			})
			.then(function() {
				let applicationId = self.event.session.application.applicationId;

				if (applicationId === process.env.ALEXA_APP_ID) {
					return Promise.resolve();
				}
				else {
					return Promise.reject(new Error('Invalid Application ID'));
				}
			})
			.then(function() {
				let accessToken = self.event.session.user.accessToken;

				if (accessToken) {
					return new Promise(function(resolve, reject) {
						request({
							url: 'https://people.googleapis.com/v1/people/me?requestMask.includeField=person.email_addresses,person.names',
							qs: {
								access_token: accessToken
							}
						}, function(err, response) {
							if (err) {
								reject(new Error('I ran into some issues authenticating you with Google'));
							}

							resolve(JSON.parse(response.body));
						});
					});
				}
				else {
					self.emit(':tellWithLinkAccountCard', 'You haven\'t successfully linked this skill with a Google account through the Alexa app. If you have already created an Ops Buddy account, make sure to link with the same Google account you used to sign up for that.');
				}
			})
			.then(function(response) {
				users = sequelize.define('user', {
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

				return users.sync()
					.then(function() {
						return users.find({
							where: {
								googleId: response.resourceName
							}
						});
					});
			})
			.then(function(user) {
				if (!user) {
					return Promise.resolve('You have not created an account at opsbuddy.bitscoop.com using this Google account. Please do so, and then configure the services for which you want to retrieve data.');
				}

				let promises = [];

				if (user.googleEnabled === true) {
					promises.push(intents.googleAnalytics(user));
				}

				if (user.statuscakeEnabled === true) {
					promises.push(intents.statuscakeAlerts(user));
				}

				if (user.postmanEnabled === true) {
					promises.push(intents.postmanMonitor(user));
				}

				if (user.githubEnabled === true) {
					promises.push(intents.githubIssues(user));
				}

				if (promises.length === 0) {
					return Promise.resolve('You haven\'t enabled any status checks.');
				}

				return Promise.all(promises);
			})
			.then(function(results) {
				if (Array.isArray(results)) {
					let response = results.join(' ');

					return Promise.resolve(response);
				}

				return Promise.resolve(results);
			})
			.catch(function(err) {
				console.log(err);

				return Promise.resolve('There was a problem executing your request; please try again. Make sure you have linked the Alexa skill with your Google account. If your problems persist, please try again later, or let us know at support@bitscoop.com.');
			})
			.then(function(message) {
				self.emit(':tellWithCard', message, global.env.name, message);
			});
	},

	AboutIntent: function () {
		let message = 'BitScoop Labs is an Orange County, California-based company that develops API integration products.';

		this.emit(':tellWithCard', message, global.env.name, message);
	},

	LaunchRequest: function () {
		let message = '';

		message += 'Welcome to ' + global.env.name + '.  ';
		message += 'You can ask this skill to get information about the status of your software stack, as configured at opsbuddy.bitscoop.com.';

		let reprompt = 'For instructions on what you can say, please say help me.';

		this.emit(':ask', message, reprompt);
	},

	'AMAZON.CancelIntent': function () {
		this.emit(':tell', 'Goodbye');
	},

	'AMAZON.HelpIntent': function () {
		let message = '';

		message += 'Here are some things you can say: ';
		message += 'How is the stack doing?';
		message += 'Tell me how the stack is doing. ';

		message += 'You can also say stop if you\'re done. ';
		message += 'So how can I help?';

		this.emit(':ask', message, message);
	},

	'AMAZON.StopIntent': function () {
		this.emit(':tell', 'Goodbye');
	}
};


exports.handler = function (event, context) {
	let alexa = Alexa.handler(event, context);

	alexa.APP_ID = process.env.ALEXA_APP_ID;

	alexa.registerHandlers(handlers);
	alexa.execute();
};
