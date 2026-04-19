import { act } from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./services/courseService', () => ({
  courseService: {
    getAllCourses: jest.fn(() => Promise.resolve({ data: [] })),
    getAllCategories: jest.fn(() => Promise.resolve({ data: [] })),
  },
}));

test('renders LearnHub navbar', async () => {
  await act(async () => {
    render(<App />);
    await Promise.resolve();
  });
  expect(screen.getByText('LearnHub')).toBeInTheDocument();
});
