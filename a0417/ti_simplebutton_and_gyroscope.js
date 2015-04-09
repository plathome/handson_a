/*
* $ npm install sandeepmistry/node-sensortag ## (require `libbluetooth-dev`)
* $ TI_UUID=your_ti_sensor_tag_UUID node this_file.js
*/
var myUUID = process.env["TI_UUID"] || "YOUR_TI_sensor_tag_UUID";

function ti_simple_key(conned_obj) {
	conned_obj.notifySimpleKey(function() {
		console.info("ready: notifySimpleKey");
		console.info("/* left right (true = pushed, false = released) */");
		conned_obj.on("simpleKeyChange", function(left, right) { /* run per pushed button */
			console.log(left, right);
		});
	});
}

function ti_gyroscope(conned_obj) {
	var period = 1000; // ms
	conned_obj.enableGyroscope(function() {
		conned_obj.setGyroscopePeriod(period, function() {
			conned_obj.notifyGyroscope(function() {
				console.info("ready: notifyGyroscope");
				console.info("notify period = " + period + "ms");
				conned_obj.on('gyroscopeChange', function(x, y, z) {
					console.log(x, y, z);
				});
			});
		});
	});
}

var SensorTag = require('sensortag');
console.info(">> STOP: Ctrl+C or SensorTag power off");
console.info("start");
console.info("waiting for connect from " + myUUID);
SensorTag.discoverByUuid(myUUID, function(sensorTag) {
	console.info("found: connect and setup ... (waiting 5~10 seconds)");
	sensorTag.connectAndSetup(function() {
		sensorTag.readDeviceName(function(error, deviceName) {
			console.info("connect: " + deviceName);
			ti_simple_key(sensorTag);
			ti_gyroscope(sensorTag);
		});
	});
	/* In case of SensorTag PowerOff or out of range when fired `onDisconnect` */
	sensorTag.on("disconnect", function() {
		console.info("disconnect and exit");
		process.exit(0);
	});
});

