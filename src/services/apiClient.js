import { createOpenAPIFetchClient } from 'openapi-fetch';
import path from '../types/openapi';

const apiUrl = 'https://team-b-api-koa-production.up.railway.app/swagger.json';

export const apiClient = createOpenAPIFetchClient<path>({
  url: apiUrl,
  headers: {
    'Content-Type': 'application/json'
  }
});
