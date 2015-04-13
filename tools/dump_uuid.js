/*
 * node dump_uuid.js | tee -a uuid.list
 */
var SensorTag = require("sensortag");
SensorTag.discover(function(sensorTag) {
	console.log(sensorTag.uuid);
	process.exit(0);
});

