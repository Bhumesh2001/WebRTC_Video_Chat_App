const express = require('express');
const router = express.Router();
const meetingCtrl = require('../controllers/meetingController');

router.post('/generate-link',meetingCtrl.generateMeetingLink);
router.get('/:meetingId',meetingCtrl.redirectToMeetingPage);

module.exports = router;