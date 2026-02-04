/**
 * Design System tokens based on MERX Platform specifications.
 */

export const designSystem = {
    colors: {
        brand: {
            primary: '#00C287',      // MERX Green (from logo "X")
            gradientStart: '#00C287',
            gradientEnd: '#008CFF',  // Blueish tone from "X"
            navy: '#0B1B32',         // Sidebar Dark Blue
        },
        primary: {
            main: '#00C287',
            hover: '#00A372',
            textOnPrimary: '#FFFFFF',
        },
        secondary: {
            action: '#0B1B32',       // Dark buttons
            informational: '#6B7280', // Gray text for metadata
        },
        neutral: {
            background: '#F3F4F6',   // Light Gray Platform Background
            surface: '#FFFFFF',      // Card Background
            border: '#E5E7EB',       // Light Border
            textPrimary: '#111827',  // Gray 900
            textSecondary: '#6B7280',// Gray 500
        },
        status: {
            success: {
                text: '#065F46',     // Dark Green text
                bg: '#D1FAE5',       // Light Green bg
            },
            warning: {
                text: '#92400E',
                bg: '#FEF3C7',
            },
            error: {
                text: '#991B1B',
                bg: '#FEE2E2',
            },
        },
    },

    shadows: {
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        hover: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    },

    typography: {
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        sizes: {
            h1: '24px',
            h2: '20px',
            h3: '16px',
            body: '14px',
            small: '12px',
            referencePrice: '48px',
        },
        weights: {
            regular: 400,
            medium: 500,
            semibold: 600,
            bold: 700,
        }
    },

    spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
    },

    borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
    }
};

