/**
 * PostController
 *
 * @Описание 	:: Полность закоментированный контроллер постов 
 				   для блога, с подробным описанием всех действий
 				   для начинающих свой путь в SailsJS

 * @Помощь		:: Смотрите http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	// @API - функции запросов для работы с БД

	create: function (req, res) {

		/***
		 * Функция CRUD которая работает с запросами
		 * которые на нее направляют (GET or POST для безоп.)
		 * в свою очередь атрибуты запросов, назначают 
		 * к спискам которые сопоставляют с БД
		 ***/

		/*@subject: (req.param('атрибут') == атрибут запроса)
		 *@example: GET: /example/u1234 | где 'u1234' это :id
		 *				 /example/:id 	| или в req.param('id')
		 */

		var params = { 
			description : req.param('description'),
			content		: req.param('content'),
			title		: req.param('title'),
		}

		/**
		 * Метод для создания новой записи в БД, в качестве аргумента
		 * передаем созданный ранее список с сопоставлением запросов
		 * и атрибутом таблицы.
		 */

		Post.create(params).exec(function (err, post) {
			res.redirect('/post/watch/' + post.id);
			if (err) return res.send(500);
		});

		/**
		 * Функция после создания записи делает 
		 * редирект на страницу с полным описаним
		 * только что созданного поста
		 */
	},
	update: function (req, res) {
		var Id = req.param('id');

		var elem = {
			description : req.param('description'),
			content     : req.param('content'),
			title       : req.param('title')
		};

		Post.update(Id, elem).exec(function (err) {
			if (err) return res.send(500);
			res.redirect('/admin');
		});
			
	},
	delete: function (req, res) {
		var Id = req.param('id');
		Post.destroy(Id).exec(function (err) {
			if (err) return res.send(500);
			res.redirect('/post');
		});
	},

	/**
	 * @MAIN - Конечная обработка 
	 * и отображение данных из БД
	 */


	/**
	 * Индексный контроллер - в REST это основная страница 
	 * @example /example/ это index: контроллера example.
	 * В данном случае данный котроллер просматривает
	 * все записи в БД для модели Post, производит сортировку,
	 * первичную пагинацию постов и на выходе мы получаем 
	 * заветный список постов.
	 */

	index: function (req, res) {
		// Поиск в модели Post
		Post.find()
			
			// Сортировка по дате постов (на убывание)
			.sort('id DESC')
			.limit(5)

			/** 
			 * Метод в котором в анонимной функции
			 * на выходе мы обрабатываем ошибки 
			 * и полученный список
			 */

			.exec(function (err, posts) {
				// Если ошибка вывести страницу 500 (с логом)
				if (err) return res.send(500);
				res.view({
					posts: posts
				});

			});
	},

	/**
	 * Контроллер для отображение информации 
	 * отдельного элемента БД из модели Post
	 * в нашем случае: findOne - поиск одной записи.
	 * В качестве параметра мы передаем в строке
	 * GET запрос: '/post/watch/:id' - где 
	 * :id - req.param('id'), и передав параметр
	 * сервер ищет запись и выдает на ее полностью.   
	 */

	watch: function (req, res) {
		var Id = req.param('id');
		Post.findOne(Id).exec(function (err, post) {
			if (!post) return res.send(404);
			if (err)   return res.send(500);
			res.view({
				post: post
			});

		});
	},

	/**
	 * Ключевая пагинация, контроллер разбиения
	 * списка постов по категориям, стндартно
	 * читаем БД модели Post - далее сортируем
	 * данные по убыванию, в параметре page 
	 * (метод paginate - в коде ниже) 
	 * указывается страница разбивки. Для задания
	 * страницы мы создаем GET параметр page 
	 * @this: 'get /:controller/:page'
	 * который и указывает нам нужную страницу
	 * разбивки, далее чтобы назначит наш :page
	 * перейдите на config/routes.js
	 */
	page: function (req, res) {
		var page = req.param('page');
		Post.find()
			.sort('id DESC')
			.paginate({
				page : page,
				limit: 5
			})
			.exec(function (err, posts) {
				if (err) return res.send(500);
				res.view({
					posts: posts
				});

			});
	}
};

