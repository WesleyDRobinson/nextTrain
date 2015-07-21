'use strict';
var mongoose = require('mongoose');

var Stops = new mongoose.Schema({
    stop_id       : String,
    stop_cod      : String,
    stop_name     : String,
    stop_desc     : String,
    stop_lat      : Number,
    stop_lon      : Number,
    zone_id       : String,
    stop_url      : String,
    location_type : Number,
    parent_station: Number
});

mongoose.model('Stops', Stops);