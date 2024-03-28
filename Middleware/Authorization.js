const { ServerError } = require('../Config/utils');
const jwt = require('jsonwebtoken');
exports.Auth = async (req, res, next) => {
    try {
        const tokenHead = req.headers.authorization
        if (!tokenHead) return res.json({ status: 405, msg: 'Forbidden: access denied' })

        const token = tokenHead.split(' ')[1]
        if (!token) res.status(400).send('Forbidden: invalid access.')

        const verify = jwt.verify(token, process.env.JWT_SECRET)
        if (!verify) return res.json({ status: 404, msg: ('Access Denied: session expired') })

        if (verify.role !== 'user') return res.json({ status: 400, msg: 'you cannot access these route' })

        req.user = verify.id

        next()
    } catch (error) {
        ServerError(res, error)
    }
}