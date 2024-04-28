const http = require('http');

var hostname = 'localhost';
var port = 4422;



var restartProcess = ["devImuServer"]
var logAfterRestarting = "devImuServer";
var gitBranch = "devServer"



const server = http.createServer(function(request, response) {
    console.log(request.method)
    if (request.method === 'POST' && request.url === '/pull') {
        console.log("here")
        var body = [];
        request.on('data', function(chunk) {
            console.log(chunk)
            body.push(chunk);
        }).on('end', function() {
            body = Buffer.concat(body).toString();
            console.log(body)


            var branch = body.branch || gitBranch;



            var fetchBranch = " git fetch origin "
            var resetBranch = " git reset --hard origin/" + branch;
            var restartNode = " sudo pm2 restart " + restartProcess[0] + ' ; ';
            var logPm2 = " sudo pm2 logs " + logAfterRestarting;

            var sys = require('sys');
            var exec = require('child_process').exec;

            function restart(callback) {
                console.log("here")
                exec(fetchBranch, function(err, result) {
                    console.log(err, result);
                    exec(resetBranch, function(err, result) {
                        console.log(err, result);

                        exec(restartNode, function(err, result) {
                            console.log(err, result);
                            callback(err, result);
                            exec(logPm2, function(err, result) {


                                console.log(err, result);

                                
                            })

                        })
                    })


                });
            }

            restart(function(err, result) {

                console.log(err, result);


                response.end(JSON.stringify({ "hiii": "teste5" }));

            })











        })
    } else {

        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/plain');
        response.end('Hello World\n');
    }
});


server.listen(port, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
