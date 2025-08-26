import mongoose from 'mongoose';
import { MONGO_URI_LOCAL } from '../common/constants.js';
import bcrypt from 'bcrypt';
import User from '../model/user.model.js';

const databaseConnection = async() =>{
    try {
        const connection = await mongoose.connect(MONGO_URI_LOCAL, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log(`MongoDB Connected: ${connection.connection.host}`);

        // Create default user if not exists
        const defaultUser = { username: "achal97", email: "achal97@gmail.com",password: "Abcd@123", phone: "9988776655" };
        
        const userExists = await User.findOne({ email: defaultUser.email });
        if (!userExists) {
          const hashedPassword = await bcrypt.hash(defaultUser.password, 10);
          const newUser = new User({
            username: defaultUser.username,
            email: defaultUser.email,
            password: hashedPassword,
            phone: defaultUser.phone,
          });

          await newUser.save();
          console.log("Default admin user created:", defaultUser.email);
        } else {
          console.log("Default admin user already exists");
        }
    } catch (error) {
        console.error("MongoDB connection error:", err.message);
        process.exit(1);
    }
}

export default databaseConnection;