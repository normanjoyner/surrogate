surrogate
======

## About

### Description
Surrogate is a dynamic TCP proxy implemented in nodejs. Surrogate proxies traffic to an upstream in a round-robin fashion.

### Author
* Norman Joyner - <norman.joyner@gmail.com>

## Getting Started

### Installation
```npm install surrogate```

### Usage
To get started, simply require surrogate in your program, and instantiate a new Surrogate object. Once instantiated, you are free to spawn new surrogates.
```javascript
var Surrogate = require("surrogate");
var surrogate = new Surrogate();
```

If you want to configure your surrogate, pass in an object with the values you would like to configure during instantiation.
```javascript
var Surrogate = require("surrogate");
var surrogate = new Surrogate({
    port: 12345
});
```

The possible configuration values are as follows:
* ```port``` - Integer (optional) - Port the surrogate should run on. Defaults to a random port between 1024 and 2048.
* ```retries``` - Integer (optional) - Number of times to attempt to create the surrogate. Defaults to 3.
* ```upstreams``` - Array (optional) - List of upstreams in "host:port" format. Defaults to [].

To modify upstreams after the surrogate has been spawned, you can use the ```edit_upstreams``` function.
```javascript
var Surrogate = require("surrogate");
var surrogate = new Surrogate({
    port: 12345,
    upstreams: ["myupstream:myport"]
});

surrogate.on("listening", function(){
    surrogate.edit_upstreams(["myusptream:myport", "mysecondupstream:mysecondport"]);
});
```

To deactivate a surrogate in use, you can use the ```deactivate``` function.
```javascript
var Surrogate = require("surrogate");
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
var Surrogate = require("surrogate");
var surrogate = new Surrogate();

surrogate.on("listening", function(){
    console.log("accepting connections ...");
});

surrogate.on("close", function(){
    console.log("... no longer accepting connections");
});
```
