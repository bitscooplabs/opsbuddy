'use strict';

const assert = require('assert');


module.exports = function(accessToken) {
	let bitscoop = global.env.bitscoop;

	return request('https://api.github.com/user?access_token=' + accessToken)
		.then(function(result) {
			return Promise.resolve(result);
		})
		.catch(function() {
			return Promise.resolve('I ran into some issues authenticating you with GitHub');
		});
};
