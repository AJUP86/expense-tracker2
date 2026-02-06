import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

function wrapper({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('initial state', () => {
    it('should finish loading with user null when no stored user', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.user).toBeNull();
    });

    it('should restore user from localStorage', async () => {
      const storedUser = { id: '123', email: 'test@example.com' };
      localStorage.setItem('user', JSON.stringify(storedUser));

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.user).toEqual(storedUser);
    });

    it('should handle invalid JSON in localStorage', async () => {
      localStorage.setItem('user', 'invalid-json');
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.user).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should call API and update state on successful login', async () => {
      const mockUser = { id: '456', email: 'user@example.com' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () =>
          Promise.resolve(
            JSON.stringify({ token: 'jwt-token', user: mockUser }),
          ),
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.login('user@example.com', 'password123');
      });

      expect(result.current.user).toEqual(mockUser);
      expect(localStorage.getItem('token')).toBe('jwt-token');
      expect(JSON.parse(localStorage.getItem('user')!)).toEqual(mockUser);
    });

    it('should throw error on failed login', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        text: () =>
          Promise.resolve(JSON.stringify({ message: 'Invalid credentials' })),
      });

      const locationSpy = vi
        .spyOn(window, 'location', 'get')
        .mockReturnValue({ href: '' } as unknown as Location);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await expect(
        act(async () => {
          await result.current.login('user@example.com', 'wrong');
        }),
      ).rejects.toThrow();

      locationSpy.mockRestore();
    });
  });

  describe('logout', () => {
    it('should clear user and localStorage on logout', async () => {
      const storedUser = { id: '123', email: 'test@example.com' };
      localStorage.setItem('user', JSON.stringify(storedUser));
      localStorage.setItem('token', 'some-token');

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.user).toEqual(storedUser);

      act(() => {
        result.current.logout();
      });

      expect(result.current.user).toBeNull();
      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
    });
  });

  describe('useAuth hook', () => {
    it('should throw error when used outside AuthProvider', () => {
      expect(() => {
        renderHook(() => useAuth());
      }).toThrow('useAuth must be used inside AuthProvider');
    });
  });
});

