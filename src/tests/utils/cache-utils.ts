import LRUCache from 'lru-cache';
import { Context } from '../../context';

export function assertCache(
  cache: LRUCache<string, Context>,
  expectedItems: number,
  requests: Record<string, any>,
): void {
  expect(cache.size).toEqual(expectedItems);

  for (let i = 1; i <= requests.length; i++) {
    const response = requests[i].response;

    expect(cache.get(response.clsId).getId()).toEqual(response.clsId);
  }
}
