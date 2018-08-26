'use-strict';

const config = require('./config');

const request = require('request');
const twitter = require('twitter');

const client = new twitter({
	consumer_key: config['consumer_key'],
	consumer_secret: config['consumer_secret'],
	access_token_key: config['token_key'],
	access_token_secret: config['token_secret']
});

const contentApiUrl = 'https://ta-prod-content-api.condenet.co.uk/2.0/article';

function getContent(url) {
	return new Promise((resolve, reject) => {
		request.get({
			"uri": url,
			"json": true
		}, (error, response, data) => {
			if (response.statusCode === 200) {
				resolve(data);
			}

			else {
				reject(err);
			}
		})
	})
}

function autoTweet(currentTime) {
	getContent(contentApiUrl)
		.then((content) => {
			items = content['items'];

			for (var i = 0; i < items.length; i++) {
				if (isPublished(items[i])) {
					if (isNew(items[i], currentTime)) {
						// tweet()
					}
				}

			}
		})
		.then(() => {
			
		})
}

function tweet(message) {
	client.post('statuses/update', {
		status: message
	})
	.then((tweet) => {
		console.log(tweet);
	})
	.catch((error) => {
		console.log(error);
	})
}

function isPublished(item) {
	return (item['data']['is_published'] ? true : false);
}

function isNew(item, now) {
	return (item['data']['published_at'] > now ? true : false);
}

function main() {
	let currentTime = new Date().toISOString();

	setInterval(() => {
		autoTweet(currentTime);
		currentTime = new Date().toISOString();
	}, 10000)
}

main();


