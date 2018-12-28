require("dotenv").config();
const bunyan = require("bunyan");

const log = {
    development: function(){
        return bunyan.createLogger({name: "IRIS-development", level: "debug"});
    },
    production: function(){
        return bunyan.createLogger({name: "IRIS-production", level:"info"});
    },
    test: function(){
        return bunyan.createLogger({name:"IRIS-test", level: "fatal"});
    }
};

module.exports = {
    witToken: process.env.WIT_TOKEN,
    slackToken : process.env.SLACK_TOKEN,
    slackLogLevel: "info",
    serviceTimeout: 30,
    irisApiToken : process.env.IRIS_API_TOKEN,
    log: (env) => {
        if(env) return log[env]();
        return log[process.env.NODE_ENV || "development"]();
    }
};
