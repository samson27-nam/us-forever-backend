import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import connectDB from './config/db';
import imageRoutes from './routes/imageRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
// Cast middleware to any to resolve type conflicts between different express-related packages
app.use(cors() as any);
app.use(express.json() as any);

// Routes
// Cast imageRoutes to any to avoid overload resolution issues in app.use
app.use('/api/images', imageRoutes as any);

// Error Handling Middleware
// Use any for res to resolve "Property 'status' does not exist" type errors
app.use((err: any, req: express.Request, res: any, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;