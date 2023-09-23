const mongoose = require('mongoose')

const connectDB = async()=>{
    try{
        const conn = await mongoose.connect(process.env.DB_ULI)
        console.log(`DB Connected: ${conn.connection.host}`)
    }catch(err){
        console.log(err)
    }
}


module.exports = connectDB;