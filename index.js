const dotenv = require('dotenv');
const Start = require('./start');

dotenv.config();
try {
  const startUp = new Start();
  startUp.startExpress();
} catch (e) {
  console.error('Fatal error while starting up app: ', e && e.message);
}
