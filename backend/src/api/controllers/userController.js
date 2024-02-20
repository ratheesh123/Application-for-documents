const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../../models/user');

exports.register = async (req, res) => {
    
        try {
          const { name, email, password } = req.body;
      
          if (!name || !email || !password) {
            return res.status(400).send({ message: "All fields are required" });
          }
      
          // Hash password
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(password, salt);
      
          // Create a new user and save to the database
          const user = new User({ name, email, password: hashedPassword });
          await user.save();
      
          res.status(201).send({ message: "User registered successfully" });
        } catch (error) {
          console.error("Registration error:", error);
          if (error.code === 11000) {
            return res.status(400).send({ message: "Email already exists" });
          } else if (error.message) {
            return res.status(400).send({ message: error.message });
          } else {
            return res.status(500).send({ message: "Internal Server Error" });
          }
        }
     
};

exports.login = async (req, res) => {
    
        try {
          const { email, password } = req.body;
      
          // Attempt to find the user by email
          //const user = await User.findOne({ email });
          const user = await User.findOne({ email }); // Ensure 'user' is declared here
          if (!user) {
            return res.status(404).send({ message: "User not found" });
          }
          console.log("User object from DB:", user);
          console.log("User Role from DB:", user.role);
          // Check if the provided password matches the stored hash
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            return res.status(400).send({ message: "Invalid credentials" });
          }
      
          // Determine if the user has an admin role after the user is found
          const isAdmin = user.role === "admin";
          console.log(`Is Admin from variable: ${isAdmin}`);
      
          // Debugging
          console.log(`User Role: ${user.role}`);
          console.log(`Is Admin: ${isAdmin}`);
      
          // Generate a token
          const token = jwt.sign(
            {
              userId: user._id,
              name: user.name,
              role: isAdmin ? "admin" : "user",
            },
            process.env.JWT_SECRET, // Use the JWT_SECRET from your environment variables
            { expiresIn: "1h" } // Token expires in 1 hour
          );
      
          // Send back the token and user details excluding the password
          res.status(200).send({
            message: "Login successful",
            token,
            user: {
              id: user._id,
              name: user.name,
              email: user.email,
              role: user.role,
            },
          });
        } catch (error) {
          console.error("Login error:", error);
          res.status(500).send({ message: "Internal Server Error" });
        }
      
};

// ... other user-related functions
