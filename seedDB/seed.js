var mongoose = require("mongoose");
var Post = require("../models/post");
var Comment = require("../models/comment");


var data = [{
    Title: "A",
    Image: "https://loremflickr.com/800/400/phanthiet",
    Body: "blaj balkjbr lorem ipsum the hekc is taht",
    Author: "Jakc"
}, {
    Title: "B",
    Image: "https://loremflickr.com/800/400/binhthuan",
    Body: "blaj balkjbr lorem ipsum the hekc is taht",
    Author: "Mew"
}, {
    Title: "C",
    Image: "https://loremflickr.com/800/400/phanthiet",
    Body: "blaj balkjbr lorem ipsum the hekc is taht",
    Author: "Plot"
}, {
    Title: "D",
    Image: "https://loremflickr.com/800/400/muine",
    Body: "blaj balkjbr lorem ipsum the hekc is taht",
    Author: "POkin"
}]


function seedDB() {
    //remove all the post
    Post.remove((err) => {
        if (err) { console.log(err) }
        Comment.remove({}, function (err) {
            if (err) {
                console.log(err);
            }
            //add some post
            data.forEach((seed) => {
                Post.create(seed, (err, post) => {
                    if (err) { console.log(err) }
                    else {
                        //add comment to post
                        // Comment.create({
                        //     Body: "lorem great Ich bin Wasser DO",
                        //     Author: "Gru"
                        // }, function (err, comment) {
                        //     if (err) { console.log(err) }
                        //     else {
                        //         post.Comments.push(comment);
                        //         post.save();
                        //     }
                        // });
                    }
                });
            });
        });
    });
}
module.exports = seedDB;