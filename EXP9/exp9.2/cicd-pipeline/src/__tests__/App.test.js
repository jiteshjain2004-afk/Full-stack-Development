import { render, screen } from '@testing-library/react';
import App from '../App';

// Test 1: App renders without crashing
test('renders CI/CD Pipeline heading', () => {
  render(<App />);
  const heading = screen.getByText(/CI\/CD Pipeline/i);
  expect(heading).toBeInTheDocument();
});

// Test 2: Pipeline stages are displayed
test('displays all pipeline stages', () => {
  render(<App />);
  expect(screen.getByText(/Test/i)).toBeInTheDocument();
  expect(screen.getByText(/Build/i)).toBeInTheDocument();
  expect(screen.getByText(/Docker/i)).toBeInTheDocument();
});

// Test 3: GitHub Actions label shown
test('shows GitHub Actions label', () => {
  render(<App />);
  expect(screen.getByText(/GitHub Actions/i)).toBeInTheDocument();
});
