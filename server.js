// Importing core and third party modules
import http from 'http';
import express from 'express';
import cors from "cors";
import helmet from 'helmet';

// Importing Contants
import { PORT } from './common/constants.js';
import databaseConnection from './database/db.js';
import router from './routes/index.routes.js';


// Initialize express app
const app = express();
databaseConnection();

// Apply middleware to enhance app security and functionality
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.text());

// Health check route to test if server is running
app.get('/ping', (req, res) => {
    res.status(200).json({ message: 'Server is up and running....' });
});

// Routes
app.use('/api',router);

// Create HTTP server and listen on defined port
let httpServer = http.createServer(app);
httpServer.listen({port:PORT},async ()=>{
    console.log(`Server running at PORT:${PORT}`);
});