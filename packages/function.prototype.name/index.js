const { uncurryThis } = require('@nolyfill/shared');
module.exports = uncurryThis(Function.prototype.name);
