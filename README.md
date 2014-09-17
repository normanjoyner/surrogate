surrogate
======

## About

### Description
Surrogate is a dynamic TCP proxy implemented in nodejs. Surrogate proxies traffic to an upstream in a round-robin fashion.

### Author
* Norman Joyner - <norman.joyner@gmail.com>

## Getting Started

### Installation
```npm install tcp-surrogate```

### Usage
To get started, simply require ```tcp-surrogate``` in your program, and instantiate a new Surrogate object. Once instantiated, you are free to spawn new surrogates.
```javascript
var Surrogate = require("tcp-surrogate");
var surrogate = new Surrogate();
```

If you want to configure your surrogate, pass in an object with the values you would like to configure during instantiation.
```javascript
var Surrogate = require("tcp-surrogate");
var surrogate = new Surrogate({
    port: 12345
});
```

The possible configuration values are as follows:
* ```port``` - Integer (optional) - Port the surrogate should run on. Defaults to a random port between 1024 and 2048.
* ```retries``` - Integer (optional) - Number of times to attempt to create the surrogate. Defaults to 3.
* ```upstreams``` - Array (optional) - List of upstreams in "host:port" format. Defaults to [].
* ```self_update``` - Function (optional) - Function which will run on interval and populate upstreams. Defaults to undefined.
* ```self_update_interval``` - Integer (optional) - Interval (in milliseconds) on which to run the ```self_update``` function. Defaults to 60000.

To modify upstreams after the surrogate has been spawned, you can use the ```edit_upstreams``` function.
```javascript
var Surrogate = require("tcp-surrogate");
var surrogate = new Surrogate({
    port: 12345,
    upstreams: ["myupstream:myport"]
});

surrogate.on("listening", function(){
    surrogate.edit_upstreams(["myusptream:myport", "mysecondupstream:mysecondport"]);
});
```

Alternatively you can rely on the ```self_update``` function to keep upstreams in sync. This function runs on an interval set by ```self_update_interval```, or can be triggered manually by calling ```force_population```.
```javascript
var Surrogate = require("tcp-surrogate");
var surrogate = new Surrogate({
    port: 12345,
    self_update: function(){
        return [Math.random()]
    },
    self_update_interval: 10000
});

surrogate.on("listening", function(){
    surrogate.force_population();
});
```

To deactivate a surrogate in use, you can use the ```deactivate``` function.
```javascript
var Surrogate = require("tcp-surrogate");
var surrogate = new Surrogate({
    port: 12345,
    upstreams: ["myupstream:myport"]
});

surrogate.on("listening", function(){
    surrogate.deactivate();
});

surrogate.on("close", function(){
    console.log("deactivated!");
});
```

### Events
Surrogate emits two events, ```listening``` and ```close```. ```listening``` is emitted when the surrogate can start accepting connections. ```close``` is emitted when the surrogate is deactivated, and can no longer accept connections.
```javascript
var Surrogate = require("tcp-surrogate");
var surrogate = new Surrogate();

surrogate.on("listening", function(){
    console.log("accepting connections ...");
});

surrogate.on("close", function(){
    console.log("... no longer accepting connections");
});
```
