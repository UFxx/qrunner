const fs = require('fs');
const path = require('path');

function init() {
	const handlersDir = path.join(__dirname, 'handlers');

	const files = fs.readdirSync(handlersDir);

	files.forEach(file => {
		const handlerPath = path.join(handlersDir, file);

		try {
			const registerHandler = require(handlerPath);

			if (typeof registerHandler === 'function')
			{
				registerHandler();
				console.log(`Зарегистрирован: ${file}`);
			}
			else
				console.warn(`Файл ${file} не экспортирует функцию`);
		}
		catch (error) {
			console.error(`Ошибка загрузки ${file}:`, error.message);
		}
	});

	console.log('Все обработчики зарегистрированы');
}

module.exports = init;