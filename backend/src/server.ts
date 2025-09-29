import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config';
import authRoutes from './routes/auth';
import noteRoutes from './routes/notes';

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

app.get('/', (req, res) => res.send('API Running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
