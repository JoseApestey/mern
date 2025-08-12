import { UserDTO } from "../dto/user.dto.js";
import { userService } from "../services/userService.js";

export class AuthController {
  static async register(req, res) {
    try {
      const newUser = await userService.register(req.body);
      const userDTO = new UserDTO(newUser);
      res.status(201).json({ status: "success", payload: userDTO });
    } catch (error) {
      res.status(400).json({ status: "error", message: error.message });
    }
  }

  static async login(req, res) {
    try {
     
      const { email, password } = req.body;
      
      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      
      const emailString = String(email).trim();
      const passwordString = String(password);

      const { token, user } = await userService.login({
        email: emailString,
        password: passwordString
      });

      const userDTO = new UserDTO(user);
      
      res.cookie("token", token, { 
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
      }).json({
        status: "success",
        payload: { user: userDTO, token },
      });
    } catch (error) {
      res.status(401).json({ 
        status: "error", 
        message: error.message || "Authentication failed" 
      });
    }
  }

  static async current(req, res) {
    try {
      const userDTO = new UserDTO(req.user);
      res.json({ status: "success", payload: userDTO });
    } catch (error) {
      res.status(500).json({ 
        status: "error", 
        message: error.message || "Failed to get current user" 
      });
    }
  }
}