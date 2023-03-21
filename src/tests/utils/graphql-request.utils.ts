import { INestApplication } from '@nestjs/common';
import gql from 'graphql-tag';
import request from 'supertest-graphql';

function getGraphQLResponse(
  app: INestApplication,
  testValue: string,
  awaitId: string = null,
) {
  return request(app.getHttpServer())
    .query(
      gql`
        query TestGQLQuery($awaitId: String) {
          testGQLQuery(awaitId: $awaitId) {
            clsId
            context {
              id
              request_id
              correlation_id
              platform
              hostname
              bin
              path
              protocol
              testValue
            }
            contexts
          }
        }
      `,
    )
    .set('x-test-value', testValue)
    .variables({ awaitId })
    .expectNoErrors();
}

function getGraphQLResponsePromise(
  app: INestApplication,
  testValue: string,
  awaitId: string,
) {
  return new Promise((resolve) => {
    resolve(getGraphQLResponse(app, testValue, awaitId).end());
  });
}

export async function buildGraphQLRequest(
  app: INestApplication,
  nb = 1,
  isPromise = false,
) {
  const requests = {};

  for (let i = 1; i <= nb; i++) {
    const testValue = `testValue${i}`;
    const response = isPromise
      ? getGraphQLResponsePromise(app, testValue, i.toString())
      : await getGraphQLResponse(app, testValue);

    requests[i] = { testValue, response };
  }

  return requests;
}
