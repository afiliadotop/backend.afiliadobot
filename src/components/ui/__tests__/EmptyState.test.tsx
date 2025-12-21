import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EmptyState } from '../EmptyState';
import { Package } from 'lucide-react';

describe('EmptyState Component', () => {
    it('should render title and description', () => {
        render(
            <EmptyState
                icon={Package}
                title="No Products"
                description="Start by adding your first product"
            />
        );

        expect(screen.getByText('No Products')).toBeInTheDocument();
        expect(screen.getByText('Start by adding your first product')).toBeInTheDocument();
    });

    it('should render action button when provided', () => {
        const mockOnClick = vi.fn();

        render(
            <EmptyState
                icon={Package}
                title="No Products"
                description="Start by adding your first product"
                action={{
                    label: 'Add Product',
                    onClick: mockOnClick
                }}
            />
        );

        const button = screen.getByText('Add Product');
        expect(button).toBeInTheDocument();

        fireEvent.click(button);
        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('should not render action button when not provided', () => {
        render(
            <EmptyState
                icon={Package}
                title="No Products"
                description="Start by adding your first product"
            />
        );

        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
});
