const shortId = require('shortid');

const generateMeetingLink = (req, res)=>{
    try {
        const meetingId = shortId.generate();
        const redirectUrl = `http://localhost:3000/${meetingId}`;
        res.json({ redirectUrl });

    } catch (error) {
        console.log(error.message);
        res.status(500).send({ err: error.message });   
    };
};

const redirectToMeetingPage = (req, res)=>{
    try {
        res.render('meeting');
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ err: error.message });
    };
};

module.exports = {
    generateMeetingLink,
    redirectToMeetingPage,
};