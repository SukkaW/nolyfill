const { uncurryThis } = require('@nolyfill/shared');
module.exports = uncurryThis(Object.prototype.hasOwnProperty);
