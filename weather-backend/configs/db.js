const mongoose = require("mongoose")


const db = () =>{
    // console.log("process.env.MONGO_URI",process.env.MONGO_URI)
    mongoose.connect(process.env.MONGO_URI).then((con)=>{
        console.log(`Database connected: ${con.connection.host}`)
    }).catch((err)=>{
        console.log(err)
    })
}

module.exports = db