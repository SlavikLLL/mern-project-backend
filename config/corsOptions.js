const allowedOrigins = require('./allowerOrigins')

const corsOptions = {
    origin:(origin,callback) =>{
        if(allowedOrigins.indexOf(origin !== -1 || !origin)){
            callback(null,true)
        }else{
            callback(new Error('not allowed by cors'))
        }
    },
    Credential:true,
    optionsSuccessState:200
}
module.exports = corsOptions;