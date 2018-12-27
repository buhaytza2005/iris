"use strict";

require("should");

const config = require("../../config");
const SlackClient = require("../../server/slackClient");

describe("slackClient", () => {
    it("should succesfully connect to slack", (done) => {
        const slackClient = new SlackClient(
            config.slackToken, config.slackLogLevel, null, null, config.log());
        slackClient.start((slackResponse) => {
            slackResponse.ok.should.be.true;
            return done();
        });
    });
});
