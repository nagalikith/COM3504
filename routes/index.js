var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Image Browsing' });

  let userData = req.body;
});

router.post('/', function (req,res) {
  let userData = req.body;
  let room_id = req.body.roomNo;
  let image_url = req.body.image_url;
  console.log("Room ID" + room_id);
  console.log("Image url" + image_url);
  if (userData == null) {
    res.setHeader('Content-Type', 'application/json');
    res.status(403).json({error: 403, reason: 'no user data provided'});
  }  else if (!userData.roomNo) {
    res.setHeader('Content-Type', 'application/json');
    res.status(403).json({error: 403, reason: 'Room Number is invalid'});
  } else if (!userData.image_url) {
    res.setHeader('Content-Type', 'application/json');
    res.status(403).json({error: 403, reason: 'Image URL is invalid'});
  }
})

module.exports = router;

/**
 *
 * @param room_id
 * @param image
 * @param chat_history
 * @param canvas_drawings
 * @constructor
 */
class UserChat{
  constructor (room_id, image ,chat_history,canvas_drawings) {
    this.room_id= room_id;
    this.image = image;
    this.chat_history=chat_history;
    this.canvas_drawings = canvas_drawings;
  }
}