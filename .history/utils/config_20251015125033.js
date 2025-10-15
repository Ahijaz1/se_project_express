module.exports = {
  PORT: process.env.PORT || 3001,
  JWT_SECRET: process.env.JWT_SECRET || "secret-secret-key-for-development",
  MONGO_URI: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/wtwr_db",
};
