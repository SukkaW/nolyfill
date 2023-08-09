const { uncurryThis } = require('@nolyfill/shared');
const includes = uncurryThis(Array.prototype.includes);
module.exports = includes;
