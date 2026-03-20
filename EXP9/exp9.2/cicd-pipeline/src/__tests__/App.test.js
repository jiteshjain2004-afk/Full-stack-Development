import { render, screen } from '@testing-library/react';
import App from '../App';

// Test 1: App renders without crashing
test('renders CI/CD heading', () => {
  render(<App />);
  const heading = screen.getByText(/CI/i);
  expect(heading).toBeInTheDocument();
});

// Test 2: Pipeline stages are displayed
test('displays Test stage', () => {
  render(<App />);
  expect(screen.getAllByText(/Test/i)[0]).toBeInTheDocument();
});

// Test 3: Build stage shown
test('displays Build stage', () => {
  render(<App />);
  expect(screen.getAllByText(/Build/i)[0]).toBeInTheDocument();
});