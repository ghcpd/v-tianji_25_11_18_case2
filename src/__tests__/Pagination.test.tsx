import { render, screen } from '@testing-library/react';
import { Pagination } from '../components/Pagination';

describe('Pagination Component', () => {
  test('renders pagination info', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={jest.fn()}
        itemsPerPage={10}
        totalItems={50}
      />
    );
    
    expect(screen.getByText(/showing 1 to 10 of 50 items/i)).toBeInTheDocument();
  });

  test('renders page numbers', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={jest.fn()}
        itemsPerPage={10}
        totalItems={50}
      />
    );
    
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  test('handles page change', () => {
    const handlePageChange = jest.fn();
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={handlePageChange}
        itemsPerPage={10}
        totalItems={50}
      />
    );
    
    const nextButton = screen.getByText('Next');
    nextButton.click();
    
    expect(handlePageChange).toHaveBeenCalledWith(2);
  });

  test('disables Previous on first page', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={jest.fn()}
        itemsPerPage={10}
        totalItems={50}
      />
    );
    
    const prevButton = screen.getByText('Previous');
    expect(prevButton).toBeDisabled();
  });

  test('disables Next on last page', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={5}
        onPageChange={jest.fn()}
        itemsPerPage={10}
        totalItems={50}
      />
    );
    
    const nextButton = screen.getByText('Next');
    expect(nextButton).toBeDisabled();
  });

  test('highlights current page', () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={jest.fn()}
        itemsPerPage={10}
        totalItems={50}
      />
    );
    
    const pageButtons = screen.getAllByRole('button').filter(
      btn => btn.textContent === '3' && btn.className.includes('active')
    );
    
    expect(pageButtons.length).toBeGreaterThan(0);
  });

  test('shows ellipsis for many pages', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={20}
        onPageChange={jest.fn()}
        itemsPerPage={10}
        totalItems={200}
      />
    );
    
    expect(screen.getByText('...')).toBeInTheDocument();
  });
});
