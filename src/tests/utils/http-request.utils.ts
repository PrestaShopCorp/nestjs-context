import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

function getHttpResponse(
  app: INestApplication,
  route: string,
  testValue: string,
) {
  const response = request(app.getHttpServer())
    .get(route)
    .set('x-test-value', testValue)
    .expect(200);

  return response;
}

function getHttpResponsePromise(
  app: INestApplication,
  route: string,
  testValue: string,
) {
  return new Promise((resolve, reject) => {
    getHttpResponse(app, route, testValue).end((err, res) => {
      if (err) {
        return reject(err);
      }

      resolve(res);
    });
  });
}

export async function buildHttpRequest(
  app: INestApplication,
  nb = 1,
  isPromise = false,
) {
  const requests = {};
  const baseRoute = '/test-http-request';

  for (let i = 1; i <= nb; i++) {
    const testValue = `testValue${i}`;
    const route = isPromise ? `${baseRoute}/${i}` : baseRoute;
    const response = isPromise
      ? getHttpResponsePromise(app, route, testValue)
      : await getHttpResponse(app, route, testValue);

    requests[i] = { testValue, response };
  }

  return requests;
}
