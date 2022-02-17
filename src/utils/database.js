const mongoose = require('mongoose');

const connect = async (connectionUri) => {
  const { connection } = mongoose;
  connection.on('connected', () => console.info(`${__filename}:connect Successfully established connection with mongodb on ${connectionUri}`));
  connection.on('close', () => console.info(`${__filename}:connect:close Connection to mongodb has been closed`));
  connection.on('error', (e) => console.error(`${__filename}:connect:FATAL Connection to mongodb has thrown error with: ${e && e.message}`));
  console.info(`${__filename}:connect opening connection to database`);
  const conn = await mongoose.connect(connectionUri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });

  return conn;
};

const closeConnection = async () => {
  await mongoose.connection.close();
};

module.exports = {
  connect,
  closeConnection,
};
