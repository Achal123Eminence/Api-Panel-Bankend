import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../model/user.model.js';
import { JWT_SECRET } from '../common/constants.js';

export const createUserService = async ({username,email,password,phone}) =>{
    const existingUser = await User.findOne({ $or: [{email},{username}]});
    if(existingUser){
        throw new Error("User with this email or username already exists");
    };

    const hashedPassword = await bcrypt.hash(password,10);

    const user = new User({
        username,
        email,
        password:hashedPassword,
        phone
    });

    await user.save();

    return { id: user._id, username: user.username, email: user.email, phone: user.phone }
};

export const loginService = async ({ username, password }) => {
  // Find user
  const user = await User.findOne({ username:username.toLowerCase() });
  if (!user) {
    throw new Error("Invalid username or password");
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid username or password");
  }

  // Generate JWT token
  const token = jwt.sign(
    { id: user._id, email: user.email, username: user.username },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  return {
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone,
    },
  };
};