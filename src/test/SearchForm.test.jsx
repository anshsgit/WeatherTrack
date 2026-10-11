/**
 * SearchForm.test.jsx
 * Component integration tests for SearchForm.
 * Tests rendering, validation behaviour, and form submission.
 *
 * Run with: npm test
 */
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchForm from '../components/SearchForm';

describe('SearchForm', () => {
  let mockOnSearch;

  beforeEach(() => {
    // Create a fresh mock function before each test
    mockOnSearch = vi.fn();
  });

  it('renders the search input and button', () => {
    render(<SearchForm onSearch={mockOnSearch} loading={false} />);
    expect(screen.getByRole('textbox', { name: /search city/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('shows a validation error when submitted with an empty input', async () => {
    render(<SearchForm onSearch={mockOnSearch} loading={false} />);
    const submitBtn = screen.getByRole('button', { name: /search/i });

    await userEvent.click(submitBtn);

    expect(await screen.findByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/required/i)).toBeInTheDocument();
    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  it('shows a validation error for a single-character input', async () => {
    render(<SearchForm onSearch={mockOnSearch} loading={false} />);
    await userEvent.type(screen.getByRole('textbox'), 'A');
    await userEvent.click(screen.getByRole('button', { name: /search/i }));

    expect(await screen.findByText(/at least 2/i)).toBeInTheDocument();
    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  it('calls onSearch with the trimmed city name on valid submission', async () => {
    render(<SearchForm onSearch={mockOnSearch} loading={false} />);
    const input = screen.getByRole('textbox');
    await userEvent.type(input, '  Mumbai  ');
    await userEvent.click(screen.getByRole('button', { name: /search/i }));

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('Mumbai');
    });
  });

  it('disables the input and button while loading', () => {
    render(<SearchForm onSearch={mockOnSearch} loading={true} />);
    expect(screen.getByRole('textbox')).toBeDisabled();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('clears the validation error when the user starts typing', async () => {
    render(<SearchForm onSearch={mockOnSearch} loading={false} />);

    // Trigger error first
    await userEvent.click(screen.getByRole('button', { name: /search/i }));
    expect(await screen.findByText(/required/i)).toBeInTheDocument();

    // Start typing — error should disappear
    await userEvent.type(screen.getByRole('textbox'), 'L');
    await waitFor(() => {
      expect(screen.queryByText(/required/i)).not.toBeInTheDocument();
    });
  });
});
