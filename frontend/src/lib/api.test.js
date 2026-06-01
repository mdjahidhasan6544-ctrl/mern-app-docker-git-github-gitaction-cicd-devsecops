import { apiUrl } from './api';

describe('API Library', () => {
  it('appends the path correctly', () => {
    const result = apiUrl('/test-endpoint');
    // It will prepend the Vite API URL, which is currently undefined or '' in test env
    // So it should end with /test-endpoint
    expect(result.endsWith('/test-endpoint')).toBe(true);
  });
});
