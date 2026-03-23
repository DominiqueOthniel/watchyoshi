module.exports = {
    content: [
      "./pages/*.{html,js}",
      "./index.html",
      "./js/*.js",
      "./components/*.{html,js}"
    ],
    theme: {
      extend: {
        colors: {
          // Dark base for headers / hero
          dark: {
            DEFAULT: "#0f172a",
            50: "#f8fafc",
            100: "#f1f5f9",
            200: "#e2e8f0",
            300: "#cbd5e1",
            400: "#94a3b8",
            500: "#64748b",
            600: "#475569",
            700: "#334155",
            800: "#1e293b",
            900: "#0f172a",
            950: "#020617",
          },
          // Primary - Electric blue
          primary: {
            DEFAULT: "#0ea5e9", // sky-500
            50: "#f0f9ff",
            100: "#e0f2fe",
            200: "#bae6fd",
            300: "#7dd3fc",
            400: "#38bdf8",
            500: "#0ea5e9",
            600: "#0284c7",
            700: "#0369a1",
            800: "#075985",
            900: "#0c4a6e",
          },
          // Secondary - Deep blue
          secondary: {
            DEFAULT: "#0c4a6e",
            50: "#f0f9ff",
            100: "#e0f2fe",
            200: "#bae6fd",
            300: "#7dd3fc",
            400: "#38bdf8",
            500: "#0ea5e9",
            600: "#0284c7",
            700: "#0369a1",
            800: "#075985",
            900: "#0c4a6e",
          },
          // Accent - Amber for CTAs / status
          accent: {
            DEFAULT: "#f59e0b",
            50: "#fffbeb",
            100: "#fef3c7",
            200: "#fde68a",
            300: "#fcd34d",
            400: "#fbbf24",
            500: "#f59e0b",
            600: "#d97706",
            700: "#b45309",
            800: "#92400e",
            900: "#78350f",
          },
          background: "#f8fafc",
          surface: {
            DEFAULT: "#f1f5f9",
            hover: "#e2e8f0",
          },
          text: {
            primary: "#0f172a",
            secondary: "#475569",
            muted: "#64748b",
          },
          // Status Colors
          success: {
            DEFAULT: "#059669", // emerald-600
            50: "#ECFDF5", // emerald-50
            100: "#D1FAE5", // emerald-100
            500: "#10B981", // emerald-500
            600: "#059669", // emerald-600
            700: "#047857", // emerald-700
          },
          warning: {
            DEFAULT: "#D97706", // amber-600
            50: "#FFFBEB", // amber-50
            100: "#FEF3C7", // amber-100
            500: "#F59E0B", // amber-500
            600: "#D97706", // amber-600
            700: "#B45309", // amber-700
          },
          error: {
            DEFAULT: "#DC2626", // red-600
            50: "#FEF2F2", // red-50
            100: "#FEE2E2", // red-100
            500: "#EF4444", // red-500
            600: "#DC2626", // red-600
            700: "#B91C1C", // red-700
          },
          // Border Colors
          border: {
            DEFAULT: "#CBD5E1",   // slate-300, plus visible
            light: "#E2E8F0",    // slate-200
            dark: "#94A3B8",     // slate-400
          },
          // Info (pour messages d’info)
          info: {
            50: "#EFF6FF",
            100: "#DBEAFE",
            700: "#1D4ED8",
          },
        },
        fontFamily: {
          sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
          display: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
          mono: ['JetBrains Mono', 'monospace'],
        },
        fontSize: {
          'xs': ['0.8125rem', { lineHeight: '1.25rem' }],   // 13px
          'sm': ['0.9375rem', { lineHeight: '1.375rem' }],   // 15px
          'base': ['1rem', { lineHeight: '1.6rem' }],       // 16px
          'lg': ['1.125rem', { lineHeight: '1.75rem' }],
          'xl': ['1.25rem', { lineHeight: '1.75rem' }],
          '2xl': ['1.5rem', { lineHeight: '2rem' }],
          '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
          '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
          '5xl': ['3rem', { lineHeight: '1' }],
          '6xl': ['3.75rem', { lineHeight: '1' }],
        },
        spacing: {
          '18': '4.5rem',
          '88': '22rem',
          '128': '32rem',
        },
        borderRadius: {
          'xl': '0.75rem',
          '2xl': '1rem',
          '3xl': '1.5rem',
          'pill': '9999px',
        },
        boxShadow: {
          'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -1px rgba(0, 0, 0, 0.04)',
          'medium': '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
          'large': '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 12px 24px -8px rgba(0, 0, 0, 0.08)',
          'glow': '0 0 40px -5px rgba(14, 165, 233, 0.35)',
          'glow-sm': '0 0 20px -5px rgba(14, 165, 233, 0.25)',
        },
        animation: {
          'fade-in': 'fadeIn 0.3s ease-out',
          'slide-up': 'slideUp 0.3s ease-out',
          'pulse-soft': 'pulseSoft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        },
        transitionDuration: {
          '200': '200ms',
          '300': '300ms',
        },
        transitionTimingFunction: {
          'out': 'cubic-bezier(0, 0, 0.2, 1)',
        },
      },
    },
    plugins: [],
  }