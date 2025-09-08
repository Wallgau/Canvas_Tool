import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../App/App';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByRole('application')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<App />);
    const app = screen.getByRole('application');
    expect(app).toHaveAttribute('aria-label', 'Tool Canvas Application');
  });
});
