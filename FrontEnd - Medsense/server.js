import express from 'express';
import cors from 'cors';
import pg from 'pg';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const { Pool } = pg;

const app = express();
app.use(cors());
app.use(express.json());

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function(req, file, cb) {
    // Create unique filename using timestamp + original name
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Database connection
const pool = new Pool({
  user: 'mm',
  host: 'localhost',
  database: 'postgres',
  password: 'mm',
  port: 5432,
});

// Test database connection
pool.connect()
  .then(() => console.log('Connected to PostgreSQL database!'))
  .catch(err => {
    console.error('Database connection error:', err.message);
  });

// Get all users
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).send(err.message);
  }
});

// Register endpoint
app.post('/register', upload.single('file_attachment'), async (req, res) => {
  const { name, email, password, role, phone_number, location, date_of_birth } = req.body;
  const file = req.file;
  let filePath = null;
  
  if (file) {
    filePath = file.path;
  }
  
  try {
    
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    // Insert user
    const result = await pool.query(
      `INSERT INTO users (name, email, password, role, phone_number, dob) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [name, email, password, role, phone_number, date_of_birth]
    );
    
    const userId = result.rows[0].id;
    
    // Insert additional info based on role
    // if (role === 'patient' || role === 'pending_doctor') {
    //   if (location) {
    //     await pool.query(
    //       'INSERT INTO patient_profile (user_id, location) VALUES ($1, $2)',
    //       [userId, location]
    //     );
    //   }
    // }
    
    if (role === 'pending_doctor' && filePath) {
      await pool.query(
        'INSERT INTO doctor_registration (user_id, file_path, status) VALUES ($1, $2, $3)',
        [userId, filePath, 'pending']
      );
    }
    
    res.status(201).json({ 
      message: 'User registered successfully',
      userId: userId,
      requiresVerification: role === 'pending_doctor'
    });
    
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const result = await pool.query(
      'SELECT id, name, email, role, phone_number FROM users WHERE email = $1 AND password = $2',
      [email, password]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    const user = result.rows[0];
    
    res.json({ user });
    
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// GET all doctor verification requests
app.get('/doctor-requests', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT dr.registration_id, dr.user_id, dr.file_path, dr.status, 
             u.id as user_id, u.name, u.email, u.phone_number 
      FROM doctor_registration dr
      JOIN users u ON dr.user_id = u.id
      WHERE dr.status = 'pending'
    `);
    
    // Format the response
    const requests = result.rows.map(row => ({
      id: row.registration_id,
      user_id: row.user_id,
      file_path: row.file_path,
      status: row.status,
      user: {
        id: row.user_id,
        name: row.name,
        email: row.email,
        phone_number: row.phone_number
      }
    }));
    
    res.json(requests);
  } catch (error) {
    console.error('Error fetching doctor requests:', error);
    res.status(500).json({ error: 'Failed to fetch doctor requests' });
  }
});

// Approve a doctor verification request
app.put('/doctor-requests/:id/approve', async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }
  
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Update the doctor registration status
    await client.query(
      'UPDATE doctor_registration SET status = $1 WHERE registration_id = $2',
      ['approved', id]
    );
    
    // Update the user role from pending_doctor to doctor
    await client.query(
      'UPDATE users SET role = $1 WHERE id = $2',
      ['doctor', userId]
    );
    
    await client.query('COMMIT');
    res.json({ message: 'Doctor application approved successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error approving doctor request:', error);
    res.status(500).json({ error: 'Failed to approve doctor request' });
  } finally {
    client.release();
  }
});

// Reject a doctor verification request
app.put('/doctor-requests/:id/reject', async (req, res) => {
  const { id } = req.params;
  
  try {
    await pool.query(
      'UPDATE doctor_registration SET status = $1 WHERE registration_id = $2',
      ['rejected', id]
    );
    
    res.json({ message: 'Doctor application rejected successfully' });
  } catch (error) {
    console.error('Error rejecting doctor request:', error);
    res.status(500).json({ error: 'Failed to reject doctor request' });
  }
});

// Make sure uploads are accessible
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(3001, () => {
  console.log('Server running at http://localhost:3001');
});

app.get('/forum-posts', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT fp.*, u.name as user_name
      FROM forum_post fp
      JOIN users u ON fp.user_id = u.id
      WHERE fp.status = 'active'
      ORDER BY fp.created_at DESC
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching forum posts:', error);
    res.status(500).json({ error: 'Failed to fetch forum posts' });
  }
});

// Get a specific forum post
app.get('/forum-posts/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query(`
      SELECT fp.*, u.name as user_name
      FROM forum_post fp
      JOIN users u ON fp.user_id = u.id
      WHERE fp.forum_id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Forum post not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching forum post:', error);
    res.status(500).json({ error: 'Failed to fetch forum post' });
  }
});

// Create a new forum post
app.post('/forum-posts', async (req, res) => {
  const { user_id, forum_title, status = 'active' } = req.body;
  
  if (!user_id || !forum_title) {
    return res.status(400).json({ error: 'User ID and forum title are required' });
  }
  
  try {
    const result = await pool.query(
      'INSERT INTO forum_post (user_id, forum_title, status) VALUES ($1, $2, $3) RETURNING forum_id',
      [user_id, forum_title, status]
    );
    
    res.status(201).json({ 
      message: 'Forum created successfully',
      forum_id: result.rows[0].forum_id 
    });
  } catch (error) {
    console.error('Error creating forum post:', error);
    res.status(500).json({ error: 'Failed to create forum post' });
  }
});

// Get all replies for a forum post
app.get('/forum-posts/:id/replies', async (req, res) => {
  const { id } = req.params;
  
  try {
    // Changed to match your forum_reply table structure
    const result = await pool.query(`
      SELECT fr.*, u.name as user_name
      FROM forum_reply fr
      JOIN users u ON fr.user_id = u.id
      WHERE fr.forum_id = $1
      ORDER BY fr.reply_id ASC
    `, [id]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching forum replies:', error);
    res.status(500).json({ error: 'Failed to fetch forum replies' });
  }
});

// Add a reply to a forum post
app.post('/forum-posts/:id/replies', async (req, res) => {
  const { id } = req.params;
  const { user_id, reply_message } = req.body; // Changed from reply_content to reply_message
  
  if (!user_id || !reply_message) {
    return res.status(400).json({ error: 'User ID and reply message are required' });
  }
  
  try {
    // Changed to match your table and column names
    const result = await pool.query(
      'INSERT INTO forum_reply (forum_id, user_id, reply_message) VALUES ($1, $2, $3) RETURNING reply_id',
      [id, user_id, reply_message]
    );
    
    res.status(201).json({ 
      message: 'Reply posted successfully',
      reply_id: result.rows[0].reply_id 
    });
  } catch (error) {
    console.error('Error posting reply:', error);
    res.status(500).json({ error: 'Failed to post reply' });
  }
});