import wrapper from "@pact-foundation/pact-core"
import deasync from "deasync"
import needle from "needle"


var pacts = [{port: 8992}];

// If pact options is object, wrap in array
if (!Array.isArray(pacts)) {
    pacts = [pacts];
}

var startingServers = [];

pacts.map(function (pact) {
    var server = wrapper.createServer(pact);
    server.start().then(function () {
        console.log('Pact Mock Server running on port: ' + server.options.port);
        // Remove current server from starting servers array
        startingServers = startingServers.filter(x => x !== server.options.port);
    }, function (err) {
        console.error('Error while trying to run karma-pact: ' + err);
    });
    // Add current server to starting servers array
    startingServers.push(server.options.port);
});

deasync.loopWhile(function () {
    return !isMockServerReady();
});

function isMockServerReady() {
    return startingServers.length === 0;
}

console.log("mock server ready: " + isMockServerReady())

needle.get("http://localhost:8992", {}, function (error, value) {
    console.log("value")
    console.log(value)
    console.log("error")
    console.log(error)
});
