const express = require('express');
const userRoutes = require("./routes/users"); 
const courseRoutes = require("./routes/course"); 
const lessonRoutes = require("./routes/lesson"); 
const cors = require('cors');
const fileRoutes = require("./routes/file");
const authCheckRoutes=require("./routes/authCheck");
const cookieParser = require('cookie-parser');
const app = express();

app.use(cookieParser()); 

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));


app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/authcheck',authCheckRoutes);
app.use('/api/files',fileRoutes);


const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
