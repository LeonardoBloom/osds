const express = require('express');

// const mysql = require('mysql2');
// const cors = require('cors');

// const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin.routes');
// const staffRoutes = require('./routes/staff.routes');
// const studentRoutes = require('./routes/student.routes');

const app = express();
app.use(express.json());
// app.use(cors());

app.use('/api/admin', adminRoutes);
// app.use('/api/staff', staffRoutes);
// app.use('/api/student', studentRoutes);


app.get('/', (req, res) => {
    res.send("School Server is up and running !");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})
