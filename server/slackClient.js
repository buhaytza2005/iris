"use strict";

const RtmClient = require("@slack/client").RTMClient;





// module.exports.init = function slackClient(token, logLevel, nlpClient, serviceRegistry) {
//     rtm = new RtmClient(token, {logLevel: logLevel});
//     nlp = nlpClient;
//     registry = serviceRegistry;
//     addAuthenticatedHandler(rtm, handleOnAuthenticated);
//     rtm.on("message", handleOnMessage);
//     return rtm;
// };
class SlackClient {

    constructor(token, logLevel, nlp, registry) {
        this._rtm = new RtmClient(token, {logLevel: logLevel});
        this._nlp = nlp;
        this._registry = registry;
        
        this._addAuthenticatedHandler(this._handleOnAuthenticated);
        this._rtm.on("message", this._handleOnMessage.bind(this));
    }
    _handleOnAuthenticated(rtmStartData) {
        console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
    }
    _addAuthenticatedHandler(handler) {
        this._rtm.on("authenticated", handler.bind(this));
    }
    _handleOnMessage(message) {
        if(message.text.toLowerCase().includes("iris")) {
            this._nlp.ask(message.text, (err, res) => {
                if (err) {
                    console.log(err);
                    return;
                }
                
                try {
                    if (!res.intent || !res.intent[0] || !res.intent[0].value){
                        throw new Error("Could not extract intent");
                    }
    
                    const intent = require("./intents/" + res.intent[0].value + "Intent");
                    console.log("made is this far");
                    intent.process(res, this._registry, (error, response) => {
                        if (error){
                            console.log(error.message);
                            return;
                        }
                        return this._rtm.sendMessage(response, message.channel);
                    });
                } catch (error) {
                    console.log(error);
                    console.log(res);
                    console.log("It went wrong in response");
                    this._rtm.sendMessage("Sorry, I don't know what you are talking about", message.channel);
                }
    
            });
        }
    
    }
    start(handler) {
        this._addAuthenticatedHandler(handler);
        this._rtm.start();
    }
}


module.exports = SlackClient;