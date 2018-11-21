var express = require('express');
var app = express();
var moment = require('moment');

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

app.use(express.static('public'))
app.use('/scripts', express.static(__dirname + '/node_modules/moment/min/'))
app.use('/chartist', express.static(__dirname + '/node_modules/chartist-js/'))

app.set('port', 80);

app.get('/data', function (req, res) {
    range = req.query.range

    if (range !== "week" && range !== "day") {
        console.log("undefined range: ", range,", set default")
        range = "day"
    }

    console.log("request", range)

    console.time("request")
    var pool = new pg.Pool(config);

    pool.connect(function(err, client, done) {
        if (err) {
            console.log("error:", err)
        }
        console.time("connect")

        client.query("SELECT timestamp,temp FROM basecamp " +
                     "WHERE timestamp > now() - interval '1 " + range + "'" +
                     "ORDER BY timestamp", function (err, result) {
            done()
            console.time("end")
            res.send(result.rows)
            console.timeEnd("end")
            console.timeEnd("connect")
            console.timeEnd("request")
        })
    })

    pool.end()
});

app.listen(app.get('port'), function () {
    console.log('server started on port ' + app.get('port'));
});
