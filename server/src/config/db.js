const mongoose = require('mongoose');

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err.message);
});

mongoose.connect(process.env.MONGO_URI || '').catch((err) => {
  console.error('MongoDB initial connection failed:', err.message);
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
});
