/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "on-tertiary-fixed": "#261900",
        "on-primary-fixed-variant": "#153ea3",
        "on-tertiary-container": "#d0a036",
        "inverse-surface": "#dee2f1",
        "on-surface-variant": "#c4c5d5",
        "on-secondary-fixed-variant": "#930002",
        "background": "#0e131d",
        "inverse-primary": "#3557bc",
        "surface-tint": "#b5c4ff",
        "tertiary": "#f2bf52",
        "surface-container-lowest": "#090e18",
        "on-tertiary": "#402d00",
        "error-container": "#93000a",
        "outline": "#8e909e",
        "secondary-container": "#c00205",
        "on-primary-fixed": "#00164e",
        "primary-fixed": "#dce1ff",
        "on-secondary-container": "#ffcdc5",
        "tertiary-container": "#503900",
        "on-background": "#dee2f1",
        "secondary-fixed": "#ffdad5",
        "surface": "#0e131d",
        "inverse-on-surface": "#2b303b",
        "on-primary": "#00287d",
        "surface-container-low": "#171c26",
        "on-primary-container": "#8aa4ff",
        "tertiary-fixed": "#ffdea2",
        "surface-dim": "#0e131d",
        "surface-bright": "#343944",
        "on-tertiary-fixed-variant": "#5c4200",
        "error": "#ffb4ab",
        "tertiary-fixed-dim": "#f2bf52",
        "primary-container": "#003399",
        "on-error": "#690005",
        "surface-variant": "#303540",
        "surface-container-highest": "#303540",
        "primary": "#b5c4ff",
        "on-error-container": "#ffdad6",
        "on-secondary": "#690001",
        "outline-variant": "#444653",
        "secondary": "#ffb4a9",
        "surface-container": "#1b202a",
        "surface-container-high": "#252a35",
        "secondary-fixed-dim": "#ffb4a9",
        "on-secondary-fixed": "#410000",
        "primary-fixed-dim": "#b5c4ff",
        "on-surface": "#dee2f1",

        // Carry forward our custom FIFA brand overlays
        fifa: {
          green: {
            DEFAULT: '#00cc66',
            dark: '#006633',
            light: '#66ff99',
            deep: '#032c16'
          },
          gold: {
            DEFAULT: '#f59e0b',
            dark: '#b45309',
            light: '#fbbf24'
          },
          purple: {
            DEFAULT: '#4f46e5',
            dark: '#312e81',
            light: '#818cf8',
            deep: '#0f0e26'
          }
        }
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      spacing: {
        "gutter": "24px",
        "container-max": "1440px",
        "margin-mobile": "16px",
        "margin-desktop": "64px",
        "unit": "4px"
      },
      fontFamily: {
        "headline-md": ["Anybody"],
        "body-md": ["Inter"],
        "headline-lg": ["Anybody"],
        "display-lg-mobile": ["Anybody"],
        "caption": ["Inter"],
        "data-label": ["JetBrains Mono"],
        "display-lg": ["Anybody"],
        "body-lg": ["Inter"]
      },
      fontSize: {
        "headline-md": ["24px", {"lineHeight": "32px", "fontWeight": "700"}],
        "body-md": ["16px", {"lineHeight": "24px", "fontWeight": "400"}],
        "headline-lg": ["32px", {"lineHeight": "40px", "fontWeight": "700"}],
        "display-lg-mobile": ["40px", {"lineHeight": "44px", "letterSpacing": "-0.02em", "fontWeight": "800"}],
        "caption": ["12px", {"lineHeight": "16px", "fontWeight": "500"}],
        "data-label": ["14px", {"lineHeight": "20px", "letterSpacing": "0.05em", "fontWeight": "500"}],
        "display-lg": ["72px", {"lineHeight": "80px", "letterSpacing": "-0.04em", "fontWeight": "800"}],
        "body-lg": ["18px", {"lineHeight": "28px", "fontWeight": "400"}]
      }
    },
  },
  plugins: [],
}
