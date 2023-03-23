import LRUCache from 'lru-cache';
import { Context } from '../../context';
export declare function assertCache(cache: LRUCache<string, Context>, expectedItems: number, requests: Record<string, any>): void;
