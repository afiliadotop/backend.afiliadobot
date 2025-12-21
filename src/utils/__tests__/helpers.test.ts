import { describe, it, expect } from 'vitest';
import { sanitizeInput, sanitizeHTML, isValidEmail, isValidURL, formatCurrency, formatDate } from '../helpers';

describe('Utility Functions', () => {
    describe('sanitizeInput', () => {
        it('should remove dangerous HTML tags', () => {
            const input = '<script>alert("xss")</script>Hello';
            const result = sanitizeInput(input);
            expect(result).not.toContain('<script>');
            expect(result).not.toContain('</script>');
        });

        it('should remove javascript: protocol', () => {
            const input = 'javascript:alert("xss")';
            const result = sanitizeInput(input);
            expect(result).not.toContain('javascript:');
        });

        it('should handle empty input', () => {
            expect(sanitizeInput('')).toBe('');
            expect(sanitizeInput(null as any)).toBe('');
        });
    });

    describe('isValidEmail', () => {
        it('should validate correct email', () => {
            expect(isValidEmail('test@example.com')).toBe(true);
            expect(isValidEmail('user.name@domain.co')).toBe(true);
        });

        it('should reject invalid email', () => {
            expect(isValidEmail('invalid')).toBe(false);
            expect(isValidEmail('test@')).toBe(false);
            expect(isValidEmail('@example.com')).toBe(false);
        });
    });

    describe('isValidURL', () => {
        it('should validate correct URLs', () => {
            expect(isValidURL('https://example.com')).toBe(true);
            expect(isValidURL('http://localhost:3000')).toBe(true);
        });

        it('should reject invalid URLs', () => {
            expect(isValidURL('not a url')).toBe(false);
            expect(isValidURL('example')).toBe(false);
        });
    });

    describe('formatCurrency', () => {
        it('should format currency in BRL', () => {
            const result = formatCurrency(1234.56);
            expect(result).toContain('1.234,56');
            expect(result).toContain('R$');
        });

        it('should handle zero', () => {
            const result = formatCurrency(0);
            expect(result).toContain('0,00');
        });
    });

    describe('formatDate', () => {
        it('should format date in pt-BR', () => {
            const date = new Date('2025-01-15');
            const result = formatDate(date);
            expect(result).toContain('15');
            expect(result).toContain('01');
            expect(result).toContain('2025');
        });
    });
});
