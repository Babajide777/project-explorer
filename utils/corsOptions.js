const corsOptions = {
  origin: ["http://localhost:3000"],
  methods: ["GET", "POST", "PUT"],
  preflightContinue: true,
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
