/* eslint-disable class-methods-use-this */
const { onShutdown } = require('node-graceful-shutdown');
const swaggerUI = require('swagger-ui-express');
const { connect, closeConnection } = require('./src/utils/database');
const app = require('./src/config/express');
const videoRoutes = require('./src/routes/videoRoute');
const CustomError = require('./src/utils/customError');
const swaggerFile = require('./swagger.json');

class Start {
  constructor() {
    this.port = process.env.PORT || 8000;
  }

  /**
     * @param null
     * ensure database connection is connected
     * @returns Void
     */
  async connectDB() {
    const connectionUri = process.env.DEFAULT_DATABASE_URI;
    if (!connectionUri) {
      throw new CustomError('A database connection uri must be provided.');
    }

    if (connectionUri && !connectionUri.startsWith('mongodb')) {
      throw new CustomError('Please confirm that the URI starts with the right protocol');
    }
    await connect(connectionUri);
  }

  /**
     * @param null
     * set up routes for the app
     * @returns Void
     */
  setAppRoutes() {
    app.use('/guide', swaggerUI.serve, swaggerUI.setup(swaggerFile));
    app.use('/healthCheck', (_, res) => res.status(200).json({ ok: true, message: 'Server up! Go to /guide to see usage guide.' }));
    app.use('/video', videoRoutes);
    app.use((_req, _res, next) => {
      const err = new CustomError('Not Found', 404);
      err.status = 404;
      next(err);
    });
  }

  /**
     * @param null
     * listen on given port
     * @returns Void
     */
  listenOnApp() {
    this.server = app.listen(this.port, () => {
      console.info(`${new Date().toISOString()}: app listening on ${this.port}`);
    });
  }

  /**
     * @param null
     * close up connections when process is being terminated
     * @returns Void
     */
  handleCloseUp() {
    onShutdown('http-server', async () => {
      await this.closeServer();
      process.exit();
    });
  }

  /**
     * @param null
     * Load up and start the express app
     * @returns Void
     */
  async startExpress() {
    try {
      await this.connectDB();
      this.setAppRoutes();
      this.listenOnApp();
      this.handleCloseUp();
    } catch (e) {
      console.error(`${__filename}: Fatal error while starting up app: ${e && e.message}`);
    }
  }

  /**
     * @param null
     * wraps up the express server
     * @returns Void
     */
  async closeServer() {
    await closeConnection();
    this.server.close();
  }
}

module.exports = Start;
