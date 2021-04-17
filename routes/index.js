var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Image Browsing' });

  let userData = req.body;


});

module.exports = router;

/**
 *
 * @param room_id
 * @param image_url
 * @param chat_history
 * @constructor
 */
class UserChat{
  constructor (room_id, image_url, chat_history) {
    this.room_id= room_id;
    this.image_url= image_url;
    this.chat_history=chat_history;
  }
}