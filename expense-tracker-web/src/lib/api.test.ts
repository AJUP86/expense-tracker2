import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { apiRequest } from './api';

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

describe('apiRequest', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should make a GET request with correct headers', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve(JSON.stringify({ data: 'test' })),
    });

    const result = await apiRequest('/test');

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/test'),
      expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
      }),
    );
    expect(result).toEqual({ data: 'test' });
  });

  it('should include Authorization header when token exists', async () => {
    localStorage.setItem('token', 'test-token');
    mockFetch.mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve(JSON.stringify({})),
    });

    await apiRequest('/test');

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-token',
        }),
      }),
    );
  });

  it('should not include Authorization header when no token', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve(JSON.stringify({})),
    });

    await apiRequest('/test');

    const callHeaders = mockFetch.mock.calls[0][1].headers;
    expect(callHeaders.Authorization).toBeUndefined();
  });

  it('should throw error with message from API response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      text: () => Promise.resolve(JSON.stringify({ message: 'Bad request' })),
    });

    await expect(apiRequest('/test')).rejects.toThrow('Bad request');
  });

  it('should throw generic error when no message in response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: () => Promise.resolve(JSON.stringify({})),
    });

    await expect(apiRequest('/test')).rejects.toThrow('API error');
  });

  it('should throw error for invalid JSON response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve('not json'),
    });

    await expect(apiRequest('/test')).rejects.toThrow(
      'Invalid JSON response from server',
    );
  });

  it('should clear localStorage and redirect on 401', async () => {
    localStorage.setItem('token', 'expired-token');
    localStorage.setItem('user', JSON.stringify({ id: '1' }));

    let redirectedTo = '';
    const locationSpy = vi.spyOn(window, 'location', 'get').mockReturnValue({
      ...window.location,
      set href(url: string) {
        redirectedTo = url;
      },
      get href() {
        return redirectedTo;
      },
    } as unknown as Location);

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      text: () => Promise.resolve(JSON.stringify({ message: 'Unauthorized' })),
    });

    await expect(apiRequest('/test')).rejects.toThrow('Session expired');

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
    expect(redirectedTo).toBe('/login');

    locationSpy.mockRestore();
  });

  it('should pass custom options to fetch', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve(JSON.stringify({})),
    });

    await apiRequest('/test', {
      method: 'POST',
      body: JSON.stringify({ name: 'test' }),
    });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ name: 'test' }),
      }),
    );
  });
});

