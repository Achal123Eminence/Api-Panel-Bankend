import bcrypt from 'bcrypt';
import User from '../model/user.model.js';

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