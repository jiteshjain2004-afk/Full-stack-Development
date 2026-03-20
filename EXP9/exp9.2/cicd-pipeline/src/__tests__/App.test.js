import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

// Test 1: App renders without crashing
test('renders CI/CD heading', () => {
  render(<App />);
  // Use getAllByText since CI appears multiple times, just check first one exists
  const elements = screen.getAllByText(/Pipeline/i);
  expect(elements.length).toBeGreaterThan(0);
});

// Test 2: Pipeline stages are displayed
test('displays Test stage chip', () => {
  render(<App />);
  const elements = screen.getAllByText(/Run Tests/i);
  expect(elements.length).toBeGreaterThan(0);
});

// Test 3: Docker stage shown
test('displays Docker stage', () => {
  render(<App />);
  const elements = screen.getAllByText(/Docker/i);
  expect(elements.length).toBeGreaterThan(0);
});
