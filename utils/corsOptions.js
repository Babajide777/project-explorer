const corsOptions = {
  origin: ["http://localhost:3000"],
  methods: ["GET", "POST", "PUT"],
  preflightContinue: true,
  // optionsSuccessStatus: 200,
  credentials: true,
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Origin",
    "X-Auth-Token",
    "X-Requested-With",
  ],
};

module.exports = corsOptions;
