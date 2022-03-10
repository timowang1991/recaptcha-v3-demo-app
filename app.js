const express = require('express');
const request = require('request');
const { RECAPTCHA_SITE_KEY } = process.env;

const app = express();

app.use(express.json());

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
})

app.post('/verify', (req, res) => {
    const { captcha } = req.body;
    if (!captcha) {
        res.json({ 'msg': 'captcha token is undefined' });
    }
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SITE_KEY}&response=${captcha}`;

    request(verifyUrl, (err, response, body) => {
        if (err) {
            return console.log(err);
        }

        body = JSON.parse(body)
        
        console.log('captcha return body', body);

        if (!body.success || body.score < 0.4) {
            return res.json({ msg: 'You might be a robot, sorry!! You are banned!', score: body.score });
        }
        return res.json({ msg: 'You have been verified! You may proceed', score: body.score });
    })
})

app.listen(3000, () => {
    console.log('app is running')
})