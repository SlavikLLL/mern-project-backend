const {logEvents} = require('./logEvent')

const errorHandler = (err,req,res,next)=>{
    logEvents(`${err.name}\t${err,message}\t${req.method}\t${req.url}`,'errLogs.txt')
    const status = res.statusCode ? res.statusCode : 500
    res.status(status);
    res.json({message:err.message})
}

module.exports = errorHandler