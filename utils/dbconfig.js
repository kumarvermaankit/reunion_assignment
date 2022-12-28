
const mongoose = require("mongoose");
const colors = require("colors");
const MONGODB_URI = require("../keys").MONGODB_URI;

const dbConnect = async () => {
  try {
    const connectionString = await mongoose.connect(MONGODB_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log(
      colors.brightMagenta(
        `\nDB connected: ${connectionString.connection.host}\n`
      )
    );
  } catch (error) {
    console.log(error)
    console.log(colors.brightRed("\nConnection to link DB failed\n"));
  }
};



module.exports = {
    dbConnect
}