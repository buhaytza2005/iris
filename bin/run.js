"use strict";
const config = require("../config");
const slackClient = require("../server/slackClient");
const service = require("../server/service")(config);
const http = require("http");
const server = http.createServer(service);
const bodyParser = require("body-parser") ;

const witToken = config.witToken;
const witClient = require("../server/witClient")(witToken);
const slackToken = config.slackToken;
const slackLogLevel = "debug";


service.use(bodyParser.json());
// service.use(bodyParser.urlencoded({extended : true}));
const serviceRegistry = service.get("serviceRegistry");
const rtm = slackClient.init(slackToken, slackLogLevel, witClient, serviceRegistry);
rtm.start();



slackClient.addAuthenticatedHandler(rtm, () => server.listen(process.env.PORT || 5000));

server.on("listening", function() {
    console.log(`IRIS is listening on ${server.address().port} in ${service.get("env")} mode.`);
});


//my own stuff - had to authenticate the url
service.get("/", (req, res) => {
    console.log("Yeah!!!!");
    res.end("Finally baby!!!!!");
});

// service.post("/post", (req, res) => {
//     console.log ("Post request made");
//     if (req.body.token ="iYBAq9eRBMQQegvOBrQ7DKeY"){
//         console.log(req.body.challenge)
//         res.writeHead(200, {"Content-type" : "text/plain"});
//         res.end(req.body.challenge);
//     } else {
//         res.writeHead(200, {"Content-type" : "text/plain"});
//         res.end("The token did not match!");
//     }
   
// })