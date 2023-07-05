const express = require('express');
const PORT = process.env.PORT || 4050;


//
const app = express();
//
app.get('/', (req, res) => {
    res.send("Hey it's working")
});
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');

// import routes
const authRoute = require('./routes/auth/auth');
const authDashboard = require('./routes/auth/authDashboard');
// Accessing the  Environment variables
dotenv.config();

// connection to database
mongoose.connect( 
    process.env.DB_CONNECT,
    { useNewUrlParser: true, useUnifiedTopology: true},
    () => console.log("connected to db ")
);


// Middleware -> display cors and user for json output
app.use(express.json(), cors());
// Route Middleware
app.use('/api/users', authRoute);
app.use('/api/dashboard', authDashboard);






// server listen
app.listen(PORT, () => {
    console.log( `server up and running at ${PORT}` );
})