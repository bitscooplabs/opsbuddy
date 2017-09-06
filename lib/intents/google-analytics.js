'use strict';

const assert = require('assert');


module.exports = function(user) {
	let bitscoop = global.env.bitscoop;

	try {
		assert(user.googleViewId != null, 'Google Analytics view configuration cannot be `null`.');
	} catch(err) {
		return Promise.resolve('Google is missing some important configuration parameters.');
	}

	try {
		assert(user.googleAnalyticsConnectionId != null, 'Google Analytics connection ID cannot be `null`.');
	} catch(err) {
		return Promise.resolve('Google is missing some important configuration parameters.');
	}

	let map = bitscoop.api(process.env.GOOGLE_ANALYTICS_MAP_ID);
	let cursor = map.endpoint('Metrics').method('GET');

	return cursor({
		headers: {
			'X-Connection-Id': user.googleAnalyticsConnectionId
		},
		query: {
			view_id: user.googleViewId
		}
	})
		.then(function(result) {
			let [data] = result;

			let totals = data.totalsForAllResults;

			let response = 'There were ' + totals['ga:users'] + ' visitors to the site in the last 24 hours, and ' + totals['ga:newUsers'] + ' were new visitors.';

			return Promise.resolve(response);
		})
		.catch(function(err) {
			console.log(err);

			return Promise.resolve('I ran into some issues reaching Google Analytics.');
		});
};
