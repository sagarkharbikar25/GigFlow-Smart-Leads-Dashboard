import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Establish connection to MongoDB Database
 */
export const connectDB = async (): Promise<void> => {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    console.error('🔥 MONGODB_ERROR: MONGO_URI is not defined in the environment variables!');
    process.exit(1);
  }

  let retries = 5;
  while (retries > 0) {
    try {
      const conn = await mongoose.connect(mongoURI, {
        autoIndex: true, // Auto-build indexes in development
      });
      console.log(`🔌 MongoDB Connected Successfully: ${conn.connection.host}`);
      return; // Exit loop on success
    } catch (error: any) {
      console.error(`🔥 MongoDB Connection Failure: ${error.message}. Retrying... (${retries} attempts left)`);
      retries -= 1;
      await new Promise((res) => setTimeout(res, 5000)); // Wait 5 seconds before retrying
    }
  }

  console.error('🔥 MongoDB Connection Failed after 5 retries. Exiting...');
  process.exit(1);
};

// Monitor connection events
mongoose.connection.on('error', (err) => {
  console.error(`🔥 MongoDB connection error event: ${err}`);
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB connection disconnected!');
});

// Close Mongoose connection if the Node process terminates
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('🔌 MongoDB connection closed gracefully due to app termination');
  process.exit(0);
});

export default connectDB;
