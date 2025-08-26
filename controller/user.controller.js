import { createUserValidation, loginSchema } from '../validation/user.validation.js';
import { createUserService, loginService } from '../service/user.service.js';

export const createUser = async(req,res) =>{
    try {
        const { error } = createUserValidation.validate(req.body);
        if(error){
            return res.status(400).json({message:error.details[0].message});
        };

        const user = await createUserService(req.body);
        return res.status(201).json({message:"User created successfully",data:user});
    } catch (error) {
        console.error("Error creating user:", err.message);
        if (err.message.includes("already exists")) {
          return res.status(409).json({ message: err.message });
        }
        res.status(500).json({ message: "Internal server error" });
    }
};

export const login = async (req, res) => {
  try {
    // Validate input
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    // Call service
    const result = await loginService(req.body);

    res.status(200).json({
      message: "Login successful",
      ...result,
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(401).json({ message: err.message });
  }
};