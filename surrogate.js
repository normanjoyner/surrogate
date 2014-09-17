var events = require("events");
var net = require("net");
var _ = require("lodash");

function Surrogate(configuration){
    if(_.isUndefined(configuration))
        configuration = {};

    this.configuration = _.defaults(configuration, {
        upstreams: [],
        port: Math.floor(Math.random() * 1024) + 1024,
        retries: 3,
        self_populate: undefined,
        self_populate_interval: 60000
    });

    this.init_socket();

    events.EventEmitter.call(this);
}

Surrogate.super_ = events.EventEmitter;
Surrogate.prototype = Object.create(events.EventEmitter.prototype, {
    constructor: {
        value: Surrogate,
        enumerable: false
    }
});

Surrogate.prototype.init_socket = function(retry){
    var self = this;

    this.proxy = net.createServer(function(socket){
        socket.on("data", function(data){
            var return_socket = new net.Socket();

            if(self.configuration.upstreams.length > 0 && self.index < self.configuration.upstreams.length){
                var upstream = self.configuration.upstreams[self.index].split(":");

                self.index++;

                if(self.index >= self.configuration.upstreams.length)
                    self.index = 0;

                return_socket.connect(upstream[1], upstream[0], function(){
                    return_socket.write(data);
                });

                return_socket.on("data", function(data){
                    socket.write(data);
                });
            }
        });
    });

    this.proxy.listen(this.configuration.port);

    this.proxy.on("listening", function(){
        if(self.configuration.self_populate){
            self.populator = setInterval(function(){
                self.configuration.upstreams = self.configuration.self_populate();
            }, self.configuration.self_populate_interval);
        }

        self.emit("listening");
    });

    this.proxy.on("close", function(){
        self.emit("close");
    });

    this.proxy.on("error", function(message){
        if(_.isUndefined(retry))
            retry = 1;
        else
            retry++;

        if(retry >= self.configuration.retries){
            self.deactivate();
        }

        else{
            self.init_socket(retry);
        }
    });
}

Surrogate.prototype.index = 0;

Surrogate.prototype.force_population = function(){
    this.configuration.upstreams = this.configuration.self_populate();
}

Surrogate.prototype.deactivate = function(){
    if(this.proxy._handle != null)
        this.proxy.close();
    else
        this.emit("close");
}

Surrogate.prototype.edit_upstreams = function(upstreams){
    if(_.isUndefined(upstreams))
        upstreams = [];

    this.configuration.upstreams = upstreams;
}

module.exports = Surrogate;
