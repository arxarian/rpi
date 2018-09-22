var express = require('express');
var app = express();

const pg = require('pg');
const connectionString = 'postgres://measuser:measuser@localhost:5432/measurements';
const client = new pg.Client(connectionString);

client.connect();

var lastRows = "empty"

async function getLastRows(var count) {
	client.query('SELECT * FROM basecamp ORDER BY timestamp DESC LIMIT 3', (err, res) => {
	//  console.log(err ? err.stack : res.rows)
		lastRows = res.rows;
	  client.end()
	})
}

app.get('/', function (req, res) {
	await client.query('SELECT * FROM basecamp ORDER BY timestamp DESC LIMIT 3', (err, res) => {
		lastRows = res.rows;
		client.end()
	})
	res.send(lastRows);
});

app.listen(80, function () {
  console.log('Example app listening on port 3000!');
});
