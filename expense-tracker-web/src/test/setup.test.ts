import { describe, it, expect } from 'vitest';

describe('Test Setup', () => {
  it('should run vitest correctly', () => {
    expect(1 + 1).toBe(2);
  });

  it('should have jest-dom matchers available', () => {
    const div = document.createElement('div');
    div.textContent = 'Hello';
    document.body.appendChild(div);
    expect(div).toBeInTheDocument();
    document.body.removeChild(div);
  });
});

