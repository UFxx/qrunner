const indexer         = require('./handlers/indexer.js');
const searchHandler = require('./handlers/search.js');
const launcher      = require('./handlers/launcher.js');
const closer        = require('./handlers/closer.js')

function init()
{
	indexer();
	searchHandler();
	launcher();
	closer();
}

module.exports = init;