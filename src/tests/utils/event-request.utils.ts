import { TestService } from '../mocks/module/test-service.mock';

function getEventResponse(
  service: TestService,
  testValue: string,
  awaitId: string = null,
) {
  return service.testEmitEvent(testValue, awaitId);
}

function getEventResponsePromise(
  service: TestService,
  testValue: string,
  awaitId: string,
) {
  return new Promise((resolve) => {
    resolve(getEventResponse(service, testValue, awaitId));
  });
}

export async function buildEventRequest(
  service: TestService,
  nb = 1,
  isPromise = false,
) {
  const requests = {};

  for (let i = 1; i <= nb; i++) {
    const testValue = `testValue${i}`;
    const response = isPromise
      ? getEventResponsePromise(service, testValue, i.toString())
      : await getEventResponse(service, testValue);

    requests[i] = { testValue, response };
  }

  return requests;
}
