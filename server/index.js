const express = require("express")
const dotenv = require('dotenv');
const cors = require("cors");

dotenv.config({ path: `${__dirname}/.env` });

const app = express();

const corsOptions = {
    optionsSuccessStatus: 200,
    preflightContinue: true,
  };

app.use(express.json());
app.use(cors(corsOptions));

app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

const userRoutes = require("./routes/userRoutes");
const landmarkRoutes = require('./routes/landmarkRoutes');

app.use('/user', userRoutes);
app.use('/landmark', landmarkRoutes)


app.listen(process.env.NODE_SERVER_PORT, () => {
    console.log(`Backend running on http://localhost:${process.env.NODE_SERVER_PORT}`);
  });