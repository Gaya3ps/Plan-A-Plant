// DataBase connnection settings---
import { connect, connection } from 'mongoose';
import dotenv from "dotenv";
dotenv.config();


const dbConnect = () => {
    connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true, 
        
    });
    let db = connection;
    
    db.on('connected', () => {
        console.log('Connected to MongoDB');
    });
    db.on('error', (err) => {
        console.log(err);
    });
};

export default { dbConnect };