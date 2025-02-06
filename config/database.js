import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();


const dbConnect = () => {
    mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true, 
        
    });
    let db = mongoose.connection;
    
    db.on('connected', () => {
        console.log('Connected to MongoDB');
    });
    db.on('error', (err) => {
        console.log(err);
    });
};

export default  dbConnect ;

