var input = require('fs').readFileSync("/dev/stdin", "utf8");

JSON.parse(input).Records.forEach(function(i){
	console.log("==> " + i.SequenceNumber);
	var r = new Buffer(i.Data, "base64");
	console.log(r.toString());
});

