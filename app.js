require("dotenv").config();
require("express-async-errors");

// Creating Express App
const express = require("express");
const app = express();
const helmet = require("helmet");
const cors = require("cors");
const xssclean = require("xss-clean");
const rateLimiter = require("express-rate-limit");

// ConnectDB
const connectDB = require("./db/connect");

// Routers
const authRouter = require("./routes/auth");
const jobsRouter = require("./routes/jobs");

// Middlewares
const userAuthentication = require("./middlewares/authentication");
const notFoundMiddleware = require("./middlewares/not-found");
const errorHandlerMiddleware = require("./middlewares/error-handler");

// Extra packages
app.use(express.json());

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  })
);
app.use(helmet());
app.use(cors());
app.use(xssclean());

// Home route
app.get('/', (req, res) => {
  res.send('Jobs API');
});

// Using Middlewares and routes
app.use("/api/v1/auth", authRouter);

// -Placing the userAuthentication middleware for all job routes
app.use("/api/v1/jobs", userAuthentication, jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// PORT
const port = process.env.PORT || 5000;

// Starting the server
const start = async () => {
  try {
    // Connect Database
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => console.log(`Server is listening at ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
