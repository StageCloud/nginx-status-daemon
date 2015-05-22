

var startStopDaemon = require('start-stop-daemon');
var request = require("request");

var statsUrl = 'http://localhost:8080/stat.json';
var backendUrl = 'http://stage.performanceroom.com/mediaserver_push_status';

var options = {
	outFile: 'nginx-status-daemon.log',
	errFile: 'nginx-status-daemon-error.log',
//    max: 3 //the script will run 3 times at most
};

var daemon = startStopDaemon(options, function() {
	setInterval(postStreamStats, 3000);
});

daemon.on('start', function() {
	this.stdout.write('nginx-status-daemon started ' + new Date() + '\n');
});

daemon.on('restart', function() {
	this.stdout.write('nginx-status-daemon restarted ' + new Date() + '\n');
});

daemon.on('stop', function() {
	this.stdout.write('nginx-status-daemon stopped ' + new Date() + '\n');
});

function postStreamStats(){

	request({
		uri: statsUrl,
		method: "GET",
		timeout: 1000,
		followRedirect: false,
	}, function(error, response, body) {

		try {
			var data = JSON.parse(body);
		}
		catch(e){

		}

		request({
			uri: backendUrl,
			method: 'POST',
			form: data
		}, function(error, response, body){


		});
	});


}
