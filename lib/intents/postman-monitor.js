'use strict';

const assert = require('assert');

const _ = require('lodash');


module.exports = function(user) {
	let bitscoop = global.env.bitscoop;

	try {
		assert(user.postmanId != null, 'Postman monitor configuration cannot be `null`.');
		assert(user.postmanApiKey != null, 'Postman API Key cannot be `null`.');
	} catch(err) {
		return Promise.resolve('Postman is missing some important configuration parameters.');
	}

	let map = bitscoop.api(process.env.POSTMAN_MAP_ID);
	let cursor = map.endpoint('RunMonitor').method('POST');

	return cursor({
		query: {
			api_key: user.postmanApiKey,
			monitor_id: user.postmanId
		}
	})
		.then(function(result) {
			let [data, response] = result;

			if (data.code && !/^2/.test(data.code)) {
				return Promise.reject();
			}

			if (_.has(data, 'run.stats.assertions.failed') && data.run.stats.assertions.failed > 0) {
				return Promise.resolve('The API status check has failed.');
			}

			return Promise.resolve('The API status check has succeeded.');
		})
		.catch(function(err) {
			console.log(err);

			return Promise.resolve('I ran into some issues reaching Postman.');
		});
};
