# Simple video API
An Api that allows you to fetch/create/update/delete video reocrds.


### Installation 
Run the following 
```
1. $ git clone https://github.com/samuelayo/simple_video_api.git
2. $ cd simple_video_api

```

### Running the app

#### with Docker-compose:

Run:

```
docker-compose up
```

#### Without Docker

- Rename `env.sample` file to `.env`, fill the variables and save.
- `DEFAULT_DATABASE_URI` Takes the default mongodb connection string.
- `PORT` Takes the port in which we want the app to run on, defaults to 4000 if not set.
if you need sample set, please import `init.json` into the videos collection

Run
```
$ yarn 
$ npm start
```


#### With Docker (not using docker-compose)

- Rename `env.sample` file to `.env`, fill the variables and save.
- `DEFAULT_DATABASE_URI` Takes the default mongodb connection string.
- `PORT` Takes the port in which we want the app to run on, defaults to 4000 if not set.

if you need sample set, please import `init.json` into the videos c

Run the following
```
1. Build the docker image - $ docker build -t getir-challenge .
2. Run the docker image - $ docker run -d -p 80:${PORT} getir-challenge

```

### API Documentation
Navigate your browser to the /guide route of the app.

### Testing
To test the app, run:
` $ npm run test`