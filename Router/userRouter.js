const { CreateAccount, LoginAccount, GetAccountInfo, SendMailToUSer, ResendOTP, ActivateAccountWithOTP } = require('../Controller/userControl');
const { Auth } = require('../Middleware/Authorization');

const router = require('express').Router()

router.post('/signup', CreateAccount)
router.post('/login', LoginAccount)
router.get('/getinfo', Auth, GetAccountInfo);
router.post('/resend-otp', ResendOTP)
router.post('/verify', ActivateAccountWithOTP)

module.exports = router