var RoomDetail = require("../models/roomdetail");
var Room = require("../models/room");

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

var Data = ["Courtyard Room", "Heritage Room​​", "Postmaster Room", "Palladian Suite"];
function seedRoom() {

    for (var i = 0; i < 5; i++) {
        var newRoom = {
            Floor: 5,
            Number: i,
        }
        Room.findOne({ Price: 300 }, function (err, room) {
            if (err) { console.log(err); }
            else {
                console.log(room);
                RoomDetail.create(newRoom, function (err, roomAdded) {
                    if (err) { console.log(err); }
                    else {
                        room.Detail.push(roomAdded);
                        room.save();
                    }
                })
            }
        });
    }
}
module.exports = seedRoom;
