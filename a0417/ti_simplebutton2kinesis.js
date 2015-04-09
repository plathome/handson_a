/*
* $ npm install sandeepmistry/node-sensortag aws-sdk moment-timezone
* $ TI_UUID=your_ti_sensor_tag_UUID AK_STREAM=your_kinesis_stream node this_file.js
*/
var myUUID   = process.env["TI_UUID"]   || "YOUR_TI_sensor_tag_UUID";
var mySTREAM = process.env["AK_STREAM"] || "YOUR_KINESIS_STREAM";

var AWS = require("aws-sdk");
AWS.config.region = "us-east-1";
/* Using ~/.aws/credentials */
var kinesis = new AWS.Kinesis();
console.info("Using AWS Kinesis Stream: " + mySTREAM);

var moment = require("moment-timezone");

function ti_simple_key(conned_obj) {
	conned_obj.notifySimpleKey(function() {
		console.info("ready: notifySimpleKey");
		console.info("/* left right (true = pushed, false = released) */");
		conned_obj.on("simpleKeyChange", function(left, right) { /* run per pushed button */
			var data = {
				device_uuid: conned_obj.uuid,
				time: moment().tz("Asia/Tokyo").format(),
				payload: {L: left, R: right}
			};
			var kparams = {Data: JSON.stringify(data), PartitionKey: "any", StreamName: mySTREAM};
			kinesis.putRecord(kparams, function(err, data) {
				if (err) {
					console.log(err, err.stack);
				} else {
					console.log(kparams);
					console.log(data);
				}
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
		});
	});
	/* In case of SensorTag PowerOff or out of range when fired `onDisconnect` */
	sensorTag.on("disconnect", function() {
		console.info("disconnect and exit");
		process.exit(0);
	});
});

