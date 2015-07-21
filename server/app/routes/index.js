'use strict';
var router = require('express').Router();
var GtfsRealtimeBindings = require('gtfs-realtime-bindings');
var request = require('request');
var path = require('path');
var accountSid = require(path.join(__dirname, '../../env')).ACCOUNT_SID;
var authToken = require(path.join(__dirname, '../../env')).AUTH_TOKEN;
var twilio = require('twilio');
var client = twilio(accountSid, authToken);
var API_KEY = require(path.join(__dirname, '../../env')).MTA_DEV_KEY;
var requestSettings = {
    method: 'GET',
    url: 'http://datamine.mta.info/mta_esi.php?key=' + API_KEY + '&feed_id=' + userTrain,
    encoding: null
};

module.exports = router;

router.get('/next/:train/:stop', function (req, res, next) {
    var userStop = req.params.stop;
    // MTA codes:
    // L train === 2
    // 1, 2, 3, 4, 5, 6, S Lines === 1
    //Staten Island Rail = 11;
    var userTrain = req.params.train === 'L' ? 2 : 1;

    function getMinutesUntilDeparture(feed) {
        var allDepartureTimes = [];

        // Fills array 'allDepartureTimes' with Epoch time of next departure
        // using the train defined by trainToGet
        // and the stop defined by stopToGet
        // then finds the minimum from this array
        function getAllScheduledDepartureTimes(entity) {
            var update = entity.trip_update;
            if (update) {
                var stopTimesArray = update.stop_time_update;
                stopTimesArray.forEach(function (stopTimeUpdate) {
                    if (stopTimeUpdate.stop_id === userStop) {
                        allDepartureTimes.push(stopTimeUpdate.departure.time.low);
                    }
                });
            }
        }

        feed.entity.forEach(getAllScheduledDepartureTimes);

        // The smallest number in allDepartures
        // is the next departure time in Epoch time
        var nextDepartureEpochTime = Math.min.apply(Math, allDepartureTimes);
        // Convert Epoch time in milliseconds to minutes
        return parseInt((nextDepartureEpochTime - (Date.now() / 1000)) / 60);
    }

    // Request feed info from MTA, store it in the feed,
    // send response with minutes until departure.
    var feed;
    request(requestSettings, function (error, response, body) {
        if (error) next(error);
        if (response.statusCode === 200) {
            feed = GtfsRealtimeBindings.FeedMessage.decode(body);
            var sendData = getMinutesUntilDeparture(feed);
            res.json(sendData);
        }
    });
});

//TODO: Integrate Twilio

//router.get('/sendText', function (req, res, next) {
//    console.log(req);
//    var fromNum = "+19177454433"; // My Twilio phone number
//    var toNum = req.body; // || "+4178485114";
//    var body = req.body.body;
//
//    var resp = new twilio.TwimlResponse();
//    // The TwiML response object will have functions on it that correspond
//    // to TwiML "verbs" and "nouns". This example uses the "Say" verb.
//    // Passing in a string argument sets the content of the XML tag.
//    // Passing in an object literal sets attributes on the XML tag.
//    //client.sendMessage({
//    //    to  : toNum,
//    //    from: fromNum,
//    //    body: body
//    //}, function (err, responseData) {
//    //    console.log("Oh no: ", err, "Great success: ", responseData);
//    //    res.send(responseData);
//    //});
//    //Render the TwiML document using "toString"
//    resp.say('hello world', req);
//    console.log(resp.toString());
//
//    res.writeHead(200, {
//        'Content-Type':'text/xml'
//    });
//    res.end(resp.toString());
//
//});

// Make sure this is after all of
// the registered routes!
router.use(function (req, res) {
    res.status(404).end();
});