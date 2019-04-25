var Room = require("../models/room");
function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}


function seedReserve() {
    randomDate(new Date(2019, 5, 1), new Date(2019, 8, 25));
    Room.
        find({}).
        populate([{ path: 'Detail', match: { DateIn: { $gt: new Date(2019, 3, 20), $lt: new Date(2019, 6, 20) } }, }]).
        exec(function (err, room) {
            if (err) console(err);
            console.log(room);

        });
}
module.exports = seedReserve;