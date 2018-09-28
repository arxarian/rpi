var express = require('express');
var app = express();

const pg = require('pg');

var config = {
  user: 'measuser', // env var: PGUSER
  database: 'measurements', // env var: PGDATABASE
  password: 'measuser', // env var: PGPASSWORD
  host: 'localhost', // Server hosting the postgres database
  port: 5432, // env var: PGPORT
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000 // how long a client is allowed to remain idle before being closed
}

app.set('port', 80);

app.get('/', function (req, res) {
	var pool = new pg.Pool(config);

	pool.connect(function(err, client, done) {
		if (err) {
			console.log("error:", err)
		}

		client.query('SELECT * FROM basecamp ORDER BY timestamp DESC LIMIT 3', function (err, result) {
			done()
			res.send(result.rows)
		})
	})

	pool.end()
});

app.listen(app.get('port'), function () {
	console.log('server started on port ' + app.get('port'));
});
