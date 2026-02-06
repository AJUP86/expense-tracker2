import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../test/test-utils';
import Login from './Login';

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should render login form', () => {
    render(<Login />, { initialRoute: '/login' });

    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
    expect(screen.getByText(/Don't have an account/)).toBeInTheDocument();
  });

  it('should show loading state when submitting', async () => {
    const user = userEvent.setup();

    mockFetch.mockImplementationOnce(
      () => new Promise((resolve) => setTimeout(resolve, 100)),
    );

    render(<Login />, { initialRoute: '/login' });

    await user.type(screen.getByPlaceholderText('Email'), 'test@example.com');
    await user.type(screen.getByPlaceholderText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(screen.getByRole('button', { name: 'Signing in...' })).toBeDisabled();
  });

  it('should show error message on failed login', async () => {
    const user = userEvent.setup();

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      text: () => Promise.resolve(JSON.stringify({ message: 'Invalid credentials' })),
    });

    const locationSpy = vi
      .spyOn(window, 'location', 'get')
      .mockReturnValue({ href: '' } as unknown as Location);

    render(<Login />, { initialRoute: '/login' });

    await user.type(screen.getByPlaceholderText('Email'), 'test@example.com');
    await user.type(screen.getByPlaceholderText('Password'), 'wrongpassword');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    await waitFor(() => {
      expect(screen.getByText('Session expired')).toBeInTheDocument();
    });

    locationSpy.mockRestore();
  });

  it('should call login and navigate on successful submit', async () => {
    const user = userEvent.setup();
    const mockUser = { id: '1', email: 'test@example.com' };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve(JSON.stringify({ token: 'jwt-token', user: mockUser })),
    });

    render(<Login />, { initialRoute: '/login' });

    await user.type(screen.getByPlaceholderText('Email'), 'test@example.com');
    await user.type(screen.getByPlaceholderText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe('jwt-token');
    });

    expect(JSON.parse(localStorage.getItem('user')!)).toEqual(mockUser);
  });

  it('should have link to register page', () => {
    render(<Login />, { initialRoute: '/login' });

    const registerLink = screen.getByRole('link', { name: 'Register' });
    expect(registerLink).toHaveAttribute('href', '/register');
  });
});

