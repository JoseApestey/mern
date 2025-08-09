
import mongoose from "mongoose";

const username = encodeURIComponent("jopy70751");
const password = encodeURIComponent("0000");


export const connectMongoDB = async () => {
  try {

    mongoose.connect(`mongodb+srv://${username}:${password}@coder.hxzl8xq.mongodb.net/?retryWrites=true&w=majority&appName=coder`)
    console.log("Mongo DB Connected");
  } catch (error) {
    console.log(error);
  }
}