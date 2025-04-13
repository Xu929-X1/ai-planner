import type { Config } from 'tailwindcss';

const config: Config = {
    content: ['./src/**/*.{html,ts,tsx}'],
    theme: {
        extend: {
            borderRadius: {
                lg: 'var(--radius)',
            },
            colors: {
                background: 'rgb(var(--background) / <alpha-value>)',
                foreground: 'rgb(var(--foreground) / <alpha-value>)',
                muted: 'rgb(var(--muted) / <alpha-value>)',
                'muted-foreground': 'rgb(var(--muted-foreground) / <alpha-value>)',
                primary: 'rgb(var(--primary) / <alpha-value>)',
                'primary-foreground': 'rgb(var(--primary-foreground) / <alpha-value>)',
                accent: 'rgb(var(--accent) / <alpha-value>)',
                'accent-foreground': 'rgb(var(--accent-foreground) / <alpha-value>)',
                border: 'rgb(var(--border) / <alpha-value>)',
            }
        }
    },
    plugins: [],
};

export default config;