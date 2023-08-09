const { bind, call } = Function.prototype;
const uncurryThis = bind.bind(call);

module.exports.uncurryThis = uncurryThis;
