const User = require('../Model').users
const bcrypt = require('bcryptjs');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const { ServerError } = require('../Config/utils');
const otpgen = require('otp-generator');
const moment = require('moment')
const mailSender = require('../Config/mailConfig');

exports.CreateAccount = async (req, res) => {
    try {
        const { fullname, email, password, confirmPassword } = req.body;
        if (!fullname) return res.json({ status: 400, msg: 'fullname is required.' });
        if (fullname.length < 10) return res.json({ status: 400, msg: 'fullname must be up to 15 characters.' });
        if (!email) return res.json({ status: 400, msg: 'email is required.' });
        if (!password) return res.json({ status: 400, msg: 'password is required.' });
        if (password.length < 7) return res.json({ status: 400, msg: 'password is too short.' });
        if (password !== confirmPassword) return res.json({ status: 400, msg: 'incorrect password detected.' });

        const checkEmail = await User.findOne({ where: { email: email } });
        if (checkEmail) return res.json({ status: 400, msg: 'email address already exists.' });

        const getSalt = await bcrypt.genSalt(15);
        const hashedPwd = await bcrypt.hash(password, getSalt);

        const { image } = req.files;
        if (!image) return res.json({ status: 400, msg: 'image is required.' });

        const filePath = './Public/profile';
        if (!fs.existsSync(filePath)) {
            fs.mkdirSync(filePath);
        }

        const date = new Date();
        const filename = `${fullname.slice(-3)}_${date.getTime()}.png`;
        await image.mv(`${filePath}/${filename}`);

        const otpCode = otpgen.generate(4, { specialChars: false, lowerCaseAlphabets: true });
        const timer = moment().add(3, 'minutes');
        const expires = timer.toString()

        let code = otpCode,
            // expires = timer,
            nums = 1;

        const newuser = { fullname, email, password: hashedPwd, image: filename, code: otpCode, expires, nums, role: 'user' };
        await User.create(newuser);

        // await mailSender(email, 'Account verification OTP', `This is your OTP verification code <h1>${otpCode}</h1>`);

        return res.json({ status: 200,msg: 'accoutn' });
    } catch (error) {
        return res.json({ status: 400, msg: `error ${error}` });
        // ServerError(res, error);
    }
};


exports.ResendOTP = async (req, res) => {
    try {
        const { email } = req.body
        if (!email) return res.json({ status: 400, msg: 'no email found' })

        const user = await User.findOne({ where: { email: email } })
        if (!user) return res.json({ status: 400, msg: 'user not found' })

        if (user.nums >= 3) {
            user.trial = moment().add(1, 'days')
            return res.json({ status: 400, msg: `you can't recieve more than three OTP's a day.` })
        }

        const otpCode = otpgen.generate(4, { specialChars: false, lowerCaseAlphabets: true, upperCaseAlphabets: false })
        const timer = moment().add(2, 'minutes')

        user.code = otpCode
        user.expires = timer.toString()
        user.nums = user.nums + 1,

            await user.save()

        await mailSender(email, 'Account verification OTP', `This is your OTP verification code <h1>${otpCode}</h1>`);

        return res.json({ status: 200, msg: 'mail sent successfully.' })
    } catch (error) {
        ServerError(res, error)
    }
}


exports.ActivateAccountWithOTP = async (req, res) => {
    try {

        const { code, email } = req.body
        if (!code) return res.json({ status: 400, msg: 'a valid OTP code is required' })
        const checkEmail = await User.findOne({ where: { email: email } })

        if (!checkEmail) return res.json({ status: 400, msg: 'invalid account' })
        if (checkEmail.code !== code) return res.json({ status: 400, msg: 'invalid verification OTP' });
        if (moment().isAfter(checkEmail.expires)) return res.json({ status: 400, msg: 'OTP has expired...' })

        checkEmail.verified = true
        checkEmail.code = null
        checkEmail.expires = null

        await checkEmail.save()

        const token = jwt.sign({ id: checkEmail.id, role: checkEmail.role }, process.env.JWT_SECRET, { expiresIn: '2d' })

        return res.json({ status: 200, msg: 'Account created successfully.', token })

    } catch (error) {
        ServerError(res, error)
    }
}

exports.LoginAccount = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email) return res.json({ status: 400, msg: 'email is required.' })
        if (!password) return res.json({ status: 400, msg: 'password is required.' })

        const checkEmail = await User.findOne({ where: { email: email } })
        if (!checkEmail) return res.json({ status: 400, msg: 'email address not found.' })

        const checkPass = await bcrypt.compare(password, checkEmail.password)
        if (!checkPass) return res.json({ status: 400, msg: 'incorrect password.' })

        const token = jwt.sign({ id: checkEmail.user, role: checkEmail.role }, process.env.JWT_SECRET, { expiresIn: '1d' })

        return res.json({ status: 200, msg: 'account logged in successfully.', token })
    } catch (error) {
        ServerError(res, error)
    }
}

exports.GetAccountInfo = async (req, res) => {
    try {
        const user = await User.findByPk(req.user)
        if (!user) return res.json({ status: 400, msg: 'user not found.' })

        return res.json({ status: 200, msg: user })
    } catch (error) {
        ServerError(res, error)
    }
}