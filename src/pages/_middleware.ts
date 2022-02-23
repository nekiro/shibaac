import type { NextFetchEvent, NextRequest } from 'next/server';
import { fetchApi } from 'src/util/request';

(async () => {
  await fetchApi('GET', '/api/startup');
})();

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  // do nothing
}
