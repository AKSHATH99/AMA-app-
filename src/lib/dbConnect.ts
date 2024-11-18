import { log } from "console";
import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {

  //Nextjs keep on stopping connection , unlike others where db connection remain constant after initial connection
  // So check if db is connectedbefore every transaction to db .
  // If you keep on doing many api calls in continously in small duration , you may not need to restart connection

  //So check if connection exist , then connect if not , move to api if yes
  if (connection.isConnected) {
    log("aLREADY CONNECTED DB");
    return;
  }

  try {
    const db = await mongoose.connect("process.env.MongoDB_URL");
    connection.isConnected = db.connections[0].readyState;
    log("DB connected");
  } catch (error) {
    log("DB connection failed");
    process.exit(1);
  }
}

export default dbConnect