import { ReactElement, ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';

type AllProvidersProps = {
  children: ReactNode;
  initialRoute?: string;
};

function AllProviders({ children, initialRoute = '/' }: AllProvidersProps) {
  return (
    <MemoryRouter initialEntries={[initialRoute]}>
      <AuthProvider>{children}</AuthProvider>
    </MemoryRouter>
  );
}

type CustomRenderOptions = Omit<RenderOptions, 'wrapper'> & {
  initialRoute?: string;
};

export function renderWithProviders(
  ui: ReactElement,
  { initialRoute, ...options }: CustomRenderOptions = {},
) {
  return render(ui, {
    wrapper: ({ children }) => (
      <AllProviders initialRoute={initialRoute}>{children}</AllProviders>
    ),
    ...options,
  });
}

export * from '@testing-library/react';
export { renderWithProviders as render };

