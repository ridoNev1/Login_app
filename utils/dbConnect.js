import Mongoose from "mongoose";

const connection = {
  isConnected: 0,
  connectType: "db not connected",
};

async function dbConnect() {
  if (connection.isConnected) {
    return;
  }

  const db = await Mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  require("./model/user.js");

  connection.isConnected = db.connections[0].readyState;
  connection.connectType = "db connected";

  console.log(connection.isConnected, connection.connectType);
}

export default dbConnect;
