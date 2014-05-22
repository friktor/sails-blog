/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	//@API - создание пользователя

	/**
	 * Создание нового пользователя,
	 * в качестве параметров передаем
	 * имя пользователя, пароль, и булевое
	 * значение админ. После создания
	 * пользователя он аутентифицируется
	 * в сессии. После создания пользователя 
	 * администратора мы установим политику
	 * admin (api/policies/admin.js) чтобы к
	 * этой функции больше не могли обращаться
	 * не привелегированные пользователи
	 */
	 
	create: function (req, res) {
		var elem = {
			username : req.param('username'),
			password : req.param('password'),
			admin    : req.param('admin')
		};

		User.create(elem).exec(function (err, user) {
			if (err) return res.send(500);
			req.session.auth = true;
			res.redirect('/');
		});
	},

	// @MAIN
	index: function (req, res) {
		res.view();
	}
};

