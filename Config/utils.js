exports.ServerError = async (res, error)  => {
    return res.json({status: 400, msg: 'something went wrong', response: `error ${error}`})
}