/**
 * Created by scottrogener on 12/30/15.
 */

'use strict';

module.exports = function (app) {
    // Root routing
    var nhl = require('../controllers/nhl.server.controller.js');
    app.route('/api/nhl/test').get(nhl.test);

    app.route('/api/nhl/threeyears_reg_gPg').get(nhl.threeyears_reg_gPg);
    app.route('/api/nhl/threeyears_playoffs_gPg').get(nhl.threeyears_playoffs_gPg);

};

