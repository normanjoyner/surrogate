var Surrogate = require([__dirname, "surrogate"].join("/"));
var pkg = require([__dirname, "package"].join("/"));

exports = module.exports = function(options){
    var surrogate = new Surrogate(options);
    surrogate.version = pkg.version;
    return surrogate;
}
