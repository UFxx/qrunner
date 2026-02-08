const index = require('./handlers/indexer.js');
const searchHandler = require('./handlers/search.js');

function init()
{
	index();
	searchHandler();
}

module.exports = init;