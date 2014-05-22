/**
 * AdminController
 *
 * @description :: Server-side logic for managing admins
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	
	index: function (req, res) {
		Post.find()
			.sort('id DESC')
			.exec(function (err, posts) {
				if (err) return res.send(500);
				res.view({
					posts: posts
				});
			});
	},

	edit: function (req, res) {
		var Id = req.param('id');

		Post.findOne(Id).exec(function (err, post) {
			if (!post) return res.send(404);
			if (err) return res.send(500);
			res.view({
				post: post
			});
		});
	}
};

