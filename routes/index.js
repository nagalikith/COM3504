var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Image Browsing' });
  let userData = req.body;
});

router.post('/', function (req,res) {
  let userData = req.body;
  let roomNo = req.body.roomNo;
  let image_url = req.body.image_url;
  var room_id = roomNo + image_url;
  console.log("Room ID" + room_id);
  res.end(JSON.stringify(userData));
})

module.exports = router;

/**
 *
 * @param room_id
 * @param chat_history
 * @constructor
 */
class UserChat{
  constructor (room_id, chat_history) {
    this.room_id= room_id;
    this.chat_history=chat_history;
  }
}

/**
 *
 * @param room_id
 * @param image
 * @param chat_history
 * @param canvas_drawings
 * @constructor
 */
class Usercanvas{
  constructor (room_id, image ,chat_history,canvas_drawings) {
    this.room_id= room_id;
    this.image = image;
    this.chat_history=chat_history;
    this.canvas_drawings = canvas_drawings;
  }
}