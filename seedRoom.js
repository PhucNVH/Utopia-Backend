var RoomDetail = require("./models/roomdetail");
var Room = require("./models/room");
var Data = [
  "Courtyard Room",
  "Heritage Room​​",
  "Postmaster Room",
  "Palladian Suite"
];
function seedRoom() {
  for (var i = 0; i < 20; i++) {
    var newRoom = {
      Floor: 6,
      Number: i,
      DateIn: new Date(),
      DataOut: new Date(),
      Adult: 2
    };
    Room.findOne({ Name: "​" }, function(err, room) {
      if (err) {
        console.log(err);
      } else {
        console.log(room);
        RoomDetail.create(newRoom, function(err, roomAdded) {
          if (err) {
            console.log(err);
          } else {
            room.Detail.push(roomAdded);
            room.save();
          }
        });
      }
    });
  }
}
module.exports = seedRoom;
