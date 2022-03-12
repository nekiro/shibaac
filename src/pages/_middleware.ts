import type { NextFetchEvent, NextRequest } from 'next/server';
import { fetchApi } from 'src/util/request';

// this is kind of workaround to execute startup api route only once
// not the best way to handle that, but next.js doesn't provide better option for now...

(async () => {
  await fetchApi('GET', '/api/startup');
})();

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  // do nothing
}
