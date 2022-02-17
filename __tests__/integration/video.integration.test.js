const supertest = require('supertest');
const dotenv = require('dotenv');
const { expect } = require('@jest/globals');
const Start = require('../../start');
const Video = require('../../src/models/Video');

dotenv.config();
const APP_URI = `http://0.0.0.0:${process.env.PORT}`;
const request = supertest(APP_URI);
const END_POINT_HEALTHCHECK = '/healthCheck';
const END_POINT_VIDEO = '/video';

// load up the app:
const startUp = new Start();

const before = (done) => {
  startUp.startExpress()
    .then((_) => done());
};

const after = (done) => {
  Video.deleteMany({})
    .then(() => {
      startUp.closeServer()
        .then((_) => done());
    });
};

let usabaleId;

describe('Integration tests', () => {
  beforeAll((done) => before(done));

  afterAll((done) => after(done));

  it('returns 200 on health check', async () => {
    const { body } = await request.get(END_POINT_HEALTHCHECK).send({});
    expect(body.message).toEqual('Server up! Go to /guide to see usage guide.');
  });

  it('Should create two new videos', async () => {
    const vid1 = {
      name: 'Through the window',
      url: 'https://url.com/mov.mp4',
      thumbnailUrl: 'https://url.com/mov.jpg',
      isPrivate: true,
      timesViewed: 24,
    };

    const vid2 = {
      name: 'Through the chair',
      url: 'https://nonewone.com/mov.mp4',
      thumbnailUrl: 'https://nonewone.com/mov.jpg',
      isPrivate: false,
      timesViewed: 54,
    };

    const vid3 = {
      name: 'Through the window2',
      url: 'https://url.com/mov.mp4',
      thumbnailUrl: 'https://url.com/mov.jpg',
      isPrivate: true,
      timesViewed: 24,
    };

    const {
      body: body1,
    } = await request.post(`${END_POINT_VIDEO}/new`).send(vid1);

    const {
      body: body2,
    } = await request.post(`${END_POINT_VIDEO}/new`).send(vid2);

    const {
      body: body3,
    } = await request.post(`${END_POINT_VIDEO}/new`).send(vid3);

    usabaleId = body1.data._id;
    expect(body1.data.url).toEqual(vid1.url);
    expect(body2.data.url).toEqual(vid2.url);

    expect(body1.data.timesViewed).toEqual(vid1.timesViewed);
    expect(body2.data.timesViewed).toEqual(vid2.timesViewed);

    expect(body1.data.isPrivate).toEqual(vid1.isPrivate);
    expect(body2.data.isPrivate).toEqual(vid2.isPrivate);

    expect(body3.data.name).toEqual(vid3.name);
  });

  it('Should retrieve one video', async () => {
    const {
      body,
    } = await request.get(`${END_POINT_VIDEO}/${usabaleId}`).send();
    expect(body.data._id).toEqual(usabaleId);
    expect(body.data.isPrivate).toEqual(true);
  });

  it('Should update one video', async () => {
    const {
      body,
    } = await request.put(`${END_POINT_VIDEO}/${usabaleId}`).send({ timesViewed: 10 });
    expect(body.data._id).toEqual(usabaleId);
    expect(body.data.timesViewed).toEqual(10);
  });

  it('Should delete one video', async () => {
    const {
      body,
    } = await request.delete(`${END_POINT_VIDEO}/${usabaleId}`).send();
    expect(body.message).toEqual('Success');
  });

  it('Should get all available vidoes', async () => {
    const {
      body,
    } = await request.get(`${END_POINT_VIDEO}/all`).send();
    expect(body.message).toEqual('Success');
    expect(body.data.items.length).toEqual(2);
    expect(body.data.totalCount).toEqual(2);
    expect(body.data.hasPreviousPage).toEqual(false);
    expect(body.data.hasNextPage).toEqual(false);
  });

  it('Should get videos with more than 42 views', async () => {
    const {
      body,
    } = await request.get(`${END_POINT_VIDEO}/all?above42=true`).send();
    expect(body.message).toEqual('Success');
    expect(body.data.items.length).toEqual(1);
    expect(body.data.totalCount).toEqual(1);
    expect(body.data.hasPreviousPage).toEqual(false);
    expect(body.data.hasNextPage).toEqual(false);
  });

  it('Should get videos that are public', async () => {
    const {
      body,
    } = await request.get(`${END_POINT_VIDEO}/all?publicOnly=true`).send();
    expect(body.message).toEqual('Success');
    expect(body.data.items.length).toEqual(1);
    expect(body.data.totalCount).toEqual(1);
    expect(body.data.hasPreviousPage).toEqual(false);
    expect(body.data.hasNextPage).toEqual(false);
  });
});
