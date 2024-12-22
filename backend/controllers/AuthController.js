// const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Replace with your actual User model

// JWT Secret Key (use a secure method to store it in production)
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

const roles = ['admins', 'staff', 'student']

const AuthController = {
  /**
   * Login user and return a JWT
   * @route POST /api/login
   */
  login: async (req, res) => {
    const { email, pwd } = req.body;

    // Basic input validation
    if (!email || !pwd) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
      // Find the user in the database
      for (const user of roles) {
          const theUser = await db.query(
            `
                SELECT * FROM ${user} WHERE email = ?
            `)
      }
      const user = await User.findOne({ where: { email } }); // Adjust query for your ORM
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }

      // Compare provided password with the stored hash
      const isPasswordValid = await bcrypt.compare(pwd, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }

      // Generate a JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '1h' } // Token expires in 1 hour
      );

      // Respond with the token
      res.status(200).json({
        message: 'Login successful.',
        token,
        user: {
          id: user.id,
          email: user.email,
        },
      });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  },

  /**
   * Register a new user
   * @route POST /api/register
   */
  register: async (req, res) => {
    const { email, pwd } = req.body;

    // Basic input validation
    if (!email || !pwd) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
      // Check if the user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(409).json({ message: 'Email already in use.' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(pwd, 10);

      // Create a new user
      const newUser = await User.create({
        email,
        password: hashedPassword,
      });

      res.status(201).json({
        message: 'User registered successfully.',
        user: {
          id: newUser.id,
          email: newUser.email,
        },
      });
    } catch (error) {
      console.error('Error during registration:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  },

  /**
   * Verify JWT (example middleware)
   */
  verifyToken: (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Bearer <token>

    if (!token) {
      return res.status(403).json({ message: 'Access denied. No token provided.' });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded; // Add the decoded user to the request object
      next();
    } catch (error) {
      console.error('Token verification failed:', error);
      res.status(401).json({ message: 'Invalid or expired token.' });
    }
  },
};

module.exports = AuthController;
