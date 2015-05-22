#!/usr/bin/env node


var startStopDaemon = require('start-stop-daemon');
var request = require("request");
var xml2js = require('xml2js');

var cli = require("cli");

var statsUrl = 'http://streamer.performanceroom.com:8080/stat';
var backendUrl = 'http://stage.performanceroom.com/mediaserver_push_status';

var options = {
	outFile: 'nginx-status-daemon.log',
	errFile: 'nginx-status-daemon-error.log',
//    max: 3 //the script will run 3 times at most
};

var parser = new xml2js.Parser({
	explicitArray: false,
	trim: true
});

function postStreamStats() {

	request({
		uri: statsUrl,
		method: "GET",
		timeout: 1000,
		followRedirect: false,
	}, function (error, response, body) {

		try {
			parser.parseString(body, function (error, data) {
				request({
					uri: backendUrl,
					method: 'POST',
					form: data
				}, function (error, response, body) {


				});

			});
		}
		catch (e) {

		}

	});
}

cli.main(function () {
	var daemon = startStopDaemon(options, function () {
		setInterval(postStreamStats, 30000);
	});

	daemon.on('start', function () {
		this.stdout.write('nginx-status-daemon started ' + new Date() + '\n');
	});

	daemon.on('restart', function () {
		this.stdout.write('nginx-status-daemon restarted ' + new Date() + '\n');
	});

	daemon.on('stop', function () {
		this.stdout.write('nginx-status-daemon stopped ' + new Date() + '\n');
	});
});
