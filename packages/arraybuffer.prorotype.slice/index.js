const { uncurryThis } = require('@nolyfill/shared');
module.exports = uncurryThis(ArrayBuffer.prototype.slice);
