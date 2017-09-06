'use strict';

const assert = require('assert');

const moment = require('moment');


module.exports = function(user) {
	let bitscoop = global.env.bitscoop;

	try {
		assert(user.statuscakeId != null, 'StatusCake test configuration cannot be `null`.');
	} catch(err) {
		return Promise.resolve('StatusCake is missing some important configuration parameters.');
	}

	let map = bitscoop.api(process.env.STATUSCAKE_MAP_ID);
	let cursor = map.endpoint('Alerts').method('GET');

	return cursor({
		query: {
			api_key: user.statuscakeApiKey,
			username: user.statuscakeUsername,
			test_id: user.statuscakeId,
			since: moment().utc().subtract(1, 'day').unix()
		}
	})
		.then(function(result) {
			let [data] = result;

			let response = 'There have been ' + data.length + ' outage alerts in the last 24 hours.';

			return Promise.resolve(response);
		})
		.catch(function() {
			return Promise.resolve('I ran into some issues reaching StatusCake.');
		});
};
