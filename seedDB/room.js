var mongoose = require("mongoose");
var Room = require("../models/room");

var data = [{
    Name: "Courtyard Room",
    Zone: "A",
    Type: "Standard",

    Tag: [{ description: "Beach-view" }, { description: "Mountain-view" }, { description: "Beach-view" }],
    Price: 100,
    Image: [{
        url: "https://www.fullertonhotels.com/uploads/9/8/1/8/98182264/courtyard-room-01-23-orig_1.jpeg"
    },
    ]
}, {
    Name: "Postmaster Room",
    Zone: "A",
    Type: "Standard",
    Tag: [{ description: "City-view" }, { description: "Mountain-view" }],
    Price: 150,
    Image: [{
        url: "https://www.fullertonhotels.com/uploads/9/8/1/8/98182264/postmaster-room01-25-orig_2.jpeg"
    },
    ]
}, {
    Name: "Heritage Room​",
    Zone: "B",
    Type: "Standard",
    Tag: [{ description: "Mountain-view" }],
    Price: 200,
    Image: [{
        url: "https://www.fullertonhotels.com/uploads/9/8/1/8/98182264/heritage-room-01-42-orig-orig_1.jpeg"
    },
    ]

}, {
    Name: "Palladian Suite",
    Zone: "D",
    Type: "Luxury",
    Tag: [{ description: "Beach-view" }, { description: "Mountain-view" }, { description: "Beach-view" }],
    Price: 300,
    Image: [{
        url: "https://www.fullertonhotels.com/uploads/9/8/1/8/98182264/palladian-suite-living-room-the-fullerton-hotel-singapore_3.jpeg"
    },
    ]
}
]
function roomDB() {
    Room.remove({}, function (err) {
        if (err) { console.log(err); }
        else {
            data.forEach((room) => {
                Room.create(room, function (err, roomAdded) {
                    if (err) { console.log(err) }
                    else { }
                });
            });
        }
    });
}
module.exports = roomDB;