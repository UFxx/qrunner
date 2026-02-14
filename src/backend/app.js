const index         = require('./handlers/indexer.js');
const searchHandler = require('./handlers/search.js');
const launcher      = require('./handlers/launcher.js');

function init()
{
	index();
	searchHandler();
	launcher();
}

module.exports = init;