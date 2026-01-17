import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './contexts/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        screens: {
            xs: '480px',
            sm: '640px',
            md: '768px',
            lg: '1024px',
            xl: '1280px',
            '2xl': '1536px',
        },
        extend: {
            fontFamily: {
                display: ['"Playfair Display"', 'serif'],
                serif: ['Merriweather', 'serif'],
                sans: ['Inter', 'sans-serif'],
            },
            colors: {
                history: {
                    paper: '#FDFBF7',
                    parchment: '#F2EFE5',
                    dark: '#2A211C',
                    ink: '#1A110A',
                    wood: '#5C483F',
                    red: '#8B2E2E',
                    gold: '#C5A870',
                    subtle: '#E6E2D6',
                    glass: 'rgba(255, 255, 255, 0.7)',
                    'glass-border': 'rgba(42, 33, 28, 0.1)',
                },
            },
            boxShadow: {
                paper: '0 2px 8px -1px rgba(42, 33, 28, 0.08)',
                'paper-hover': '0 12px 24px -4px rgba(42, 33, 28, 0.12)',
                'inner-warm': 'inset 0 2px 6px 0 rgba(42, 33, 28, 0.04)',
                glass: '0 8px 32px 0 rgba(42, 33, 28, 0.05)',
            },
            animation: {
                'fade-in': 'fadeIn 0.8s ease-out forwards',
                'fade-in-up': 'fadeInUp 1s ease-out forwards',
                'slide-in': 'slideIn 0.6s ease-out forwards',
                float: 'float 8s ease-in-out infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(15px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideIn: {
                    '0%': { opacity: '0', transform: 'translateX(-10px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-6px)' },
                },
            },
        },
    },
    plugins: [],
};

export default config;
