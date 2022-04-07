/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
const logger = require('./Logger');
const request = require('request');
const _ = require('underscore');

const isHigher = user => {
	const roles = getHigherRoles();
	for (let i = 0; i < user._roles.length; i++) {
		for (let x = 0; x < roles.length; x++) {
			if (user._roles[i] === roles[x]) {
				return true;
			}
		}
	}
	return false;
};

const getHigherRoles = () => {
	return process.env.MANAGEMENT_ROLES.split(',');
};

// Query the API to check if the user is verified.
const isVerified = (member) => {
	logger.debug(`Checking if ${member.user.username} is verified`);

	request.get({
		url: `${process.env.VERIFICATION_URL}?task=isVerified&id=${member.user.id}&api_key=${process.env.VERIFICATION_API_KEY}`,
		json: true,
	}, async (err, res, data) => {
		if (err) {
			logger.error('Verification API Error:', err);
			return;
		}

		if (res.statusCode !== 200) {
			logger.warn('Verification API returned following status:', res.statusCode);
			return;
		}

		if (_.isEmpty(data)) {
			logger.debug(`${member.user.username} is not verified.`);
		} else {
			logger.debug(`${member.user.username} got verified at ${data[0].created_at}, adding role.`);
			member.roles.add(process.env.VERIFIED_ROLE, 'Previously Verified').catch(console.error);
		}
	});
};

module.exports = { isHigher, getHigherRoles, isVerified };