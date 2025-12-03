import mongoose from "mongoose";

/**
 * Connect to MongoDB database
 * @returns {Promise<void>}
 */
export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    const conn = await mongoose.connect(mongoURI, {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log("MongoDB Connected Successfully");
    console.log(`Connected to: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);

    return conn;
  } catch (error) {
    console.error("MongoDB Connection Failed");
    console.error(`Error: ${error}`);

    // Exit process if database connection fails
    process.exit(1);
  }
};

/**
 * Disconnect from MongoDB database
 * @returns {Promise<void>}
 */
export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log("MongoDB Disconnected Successfully");
  } catch (error) {
    console.error("Error disconnecting from MongoDB:", error);
    process.exit(1);
  }
};

/**
 * Get database connection status
 * @returns {boolean}
 */
export const isDBConnected = () => {
  return mongoose.connection.readyState === 1;
};

/**
 * Get connection statistics
 * @returns {Object}
 */
export const getDBStats = () => {
  const conn = mongoose.connection;
  return {
    state: conn.readyState,
    stateNames: {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
    },
    host: conn.host,
    database: conn.name,
    models: Object.keys(conn.models),
  };
};

export default connectDB;
