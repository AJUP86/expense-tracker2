const mongoose = require('mongoose');

describe('Test Setup', () => {
  it('should connect to in-memory MongoDB', () => {
    expect(mongoose.connection.readyState).toBe(1);
  });

  it('should have a valid database name', () => {
    expect(mongoose.connection.db.databaseName).toBeDefined();
  });
});

