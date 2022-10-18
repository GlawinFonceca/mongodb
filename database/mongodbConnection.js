require('dotenv').config();
const  mongoose = require('mongoose');
mongoose.connect(`mongodb://${process.env.mongodb_Host}:${process.env.mongodb_Port}/${process.env.mongodb_Connection}`);//mongodb connection