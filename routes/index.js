var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Image Browsing' });
  let userData = req.body;
});

router.post('/getdata', function (req,res) {
  if (req.body == null) {
    res.setHeader('Content-Type', 'application/json');
    res.status(403).json({error: 403, reason: 'no user data provided'});
  }
   else if (!req.body.image_url) {
    res.setHeader('Content-Type', 'application/json');
    res.status(403).json({error: 403, reason: 'Image URL is invalid'});
  } else if (!req.body.roomNo) {
    res.setHeader('Content-Type', 'application/json');
    res.status(403).json({error: 403, reason: 'Room Number is invalid'});
  }
  let roomNo = req.body.roomNo;
  let image_url = req.body.image_url;
  let userData = getUserData(roomNo,image_url);
  console.log("Room ID" + userData);
  res.setHeader('Content-Type', 'application/json');
  res.json(userData);

});

module.exports = router;

/**
 * User chat class which takes roomNo and Image url as parameters
 * @param room_id
 * @param Image_Url
 * @constructor
 */
class UserChat{
  constructor (roomNo, image_url) {
    this.roomNo= roomNo;
    this.image_url=image_url;
  }
}

/**
 *  Returns a new UserChat object
 * @param room_id
 * @param image_url
 * @returns {UserChat}
 */
function  getUserData(roomNo, image_url) {
  return new UserChat(
      roomNo,
      image_url
  )
}