import mongoose from "mongoose"


export const connectDb = async () => {
    try {
        await mongoose.connect("mongodb+srv://jopy70751:0000@coder.hxzl8xq.mongodb.net/?retryWrites=true&w=majority&appName=coder")
        .then(()=>{console.log("DB conectada")})
    } catch (error) {
        console.log(error)
    }
}



