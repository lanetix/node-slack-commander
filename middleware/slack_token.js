(function () {
  'use strict';

  module.exports = function (token) {
    return function (req, res, next) {
      if (req.body.token !== token) {
        return res.status(401).send();
      }
      next();
    };
  };

})();
