/**
 * SessionController
 *
 * @description :: Server-side logic for managing sessions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var passwordHash = require('password-hash');

module.exports = {


	// @API основные функции сессии

	create: function (req, res) {
		/**
		 * Задаем переменные запрашиваемых
		 * параметров, в нашем случае логин
		 * и пароль
		 */
		var username = req.param('username'),
			password = req.param('password');

		/**
		 * Если нет логина или пароля в запросе
		 * вывести ошибку, и перенаправить на 500
		 * (прим. здесь лучше сделать подробную
		 * обработку ошибок)
		 */

		if (!username || !password) {
			return res.redirect('/session');
		};

		/**
		 * Найти пользователя из запроса логина
		 * (username - req.param('username'))
		 * когда пользователь найден производиться 
		 * сравнение зашифрованного пароля с паролем
		 * который был отправлен запросом, если он
		 * валиден, то создается внешний статус - 
		 * авторизован или нет, и даеться доступ к
		 * данным через внешний доступ сессии. Это
		 * позволит нам в дальнейшем создать политику
		 * для ограничивания доступа к определенным 
		 * разделам нашего блога (используя cookie)
		 */
		User.findOneByUsername(username).exec(function (err, user) {
			if (!user || err) return res.send(500);
			if (passwordHash.verify(password, user.encryptPassword)) {
				// Авторизовать пользователя в сессии
				req.session.auth = true;
				req.session.User = user;
				
				if (req.session.User.admin) {
					return res.redirect('/admin');
				};
			};
		});
	},
	/**
	 * Создаем выход из сессии который 
	 * просматривает есть ли пользователь
	 * в онлайне, и уничтожает сессию
	 */
	destroy: function (req, res) {
		User.findOne(req.session.User.id).exec(function (err, user) {
			if (user) {
				req.session.destroy();
				res.redirect('/');
			} else { res.redirect('/login'); };
		});
	},

	// @MAIN

	index: function (req, res) {
		res.view();
	}
};

