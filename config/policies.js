/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect
 * its actions individually.
 *
 * Any policy file (e.g. `api/policies/authenticated.js`) can be accessed
 * below by its filename, minus the extension, (e.g. "authenticated")
 *
 * For more information on configuring policies, check out:
 * http://sailsjs.org/#!documentation/
 */


module.exports.policies = {

  // Default policy for all controllers and actions
  // (`true` allows public access)
  '*': true,

  /**
   * Вставляем для нашего контроллера
   * Admin политику admin.js, которая
   * ограничивает доступ.
   */

  AdminController: {
  	'*': 'admin'
  },

  UserController: {
  	create: 'admin'
  },

  PostController: {
  	// То что могут видеть все
  	index  : true,
  	page   : true,
  	watch  : true,

  	// То что может только админ
  	create : 'admin',
  	update : 'admin',
  	delete : 'admin',
  }
};
