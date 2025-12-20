export const themes = {
  tactical: {
    name: "Black Market",

    // --- 1. Backgrounds ---
    "--bg-primary": "#0b0c10",
    "--bg-secondary": "#15161b",
    "--bg-tertiary": "#1f2128",
    "--bg-input": "#15161b",
    "--bg-switch": "#333333",

    // --- 2. Typography ---
    "--text-main": "#d1d5db",
    "--text-muted": "#9ca3af",
    "--text-inverse": "#0b0c10",

    // --- 3. Actions & Accents ---
    "--accent-color": "#ff9900",
    "--accent-hover": "#ff8800",
    "--accent-light": "#ffaa33",
    "--accent-dark": "#cc7a00",
    "--accent-glow": "rgba(255, 153, 0, 0.15)",
    "--accent-ring": "#ff9900",

    // --- 4. Borders & Lines ---
    "--border-color": "#333333",
    "--radius": "8px",

    // --- 5. Status Indicators ---
    "--status-success": "#00C950",
    "--status-error": "#ef4444",
    "--status-warning": "#ff9900",
    "--status-info": "#3b82f6",

    // --- 6. Charts ---
    "--chart-1": "#ff9900",
    "--chart-2": "#ffaa33",
    "--chart-3": "#cc7a00",
    "--chart-4": "#666666",
    "--chart-5": "#999999",

    // --- 7. Sidebar ---
    "--sidebar-bg": "#0b0c10",
    "--sidebar-fg": "#d1d5db",
    "--sidebar-primary": "#ff9900",
    "--sidebar-primary-fg": "#0b0c10",
    "--sidebar-accent": "#15161b",
    "--sidebar-accent-fg": "#d1d5db",
    "--sidebar-border": "#333333",
    "--sidebar-ring": "#ff9900",

    // --- 8. Component Specifics ---
    "--font-display": "'Open Sans', sans-serif",

    // Buttons
    "--btn-secondary-bg": "#1f2128",
    "--btn-secondary-hover": "#2d3039",
    "--btn-secondary-text": "#d1d5db",

    "--btn-destructive-bg": "#ef4444",
    "--btn-destructive-hover": "#dc2626",
    "--btn-destructive-text": "#ffffff",

    "--btn-ghost-hover-bg": "rgba(255, 153, 0, 0.1)",
  },
  light: {
    name: "Clean Day",

    // --- 1. Backgrounds ---
    "--bg-primary": "#ffffff",
    "--bg-secondary": "#f9fafb",
    "--bg-tertiary": "#f3f4f6",
    "--bg-input": "#ffffff",
    "--bg-switch": "#e5e7eb",

    // --- 2. Typography ---
    "--text-main": "#111827",
    "--text-muted": "#6b7280",
    "--text-inverse": "#ffffff",

    // --- 3. Actions & Accents ---
    "--accent-color": "#ff9900",
    "--accent-hover": "#e68a00",
    "--accent-light": "#ffb84d",
    "--accent-dark": "#cc7a00",
    "--accent-glow": "rgba(255, 153, 0, 0.2)",
    "--accent-ring": "#ff9900",

    // --- 4. Borders & Lines ---
    "--border-color": "#e5e7eb",
    "--radius": "8px",

    // --- 5. Status Indicators ---
    "--status-success": "#16a34a",
    "--status-error": "#dc2626",
    "--status-warning": "#ea580c",
    "--status-info": "#2563eb",

    // --- 6. Charts ---
    "--chart-1": "#ff9900",
    "--chart-2": "#f97316",
    "--chart-3": "#ea580c",
    "--chart-4": "#9ca3af",
    "--chart-5": "#d1d5db",

    // --- 7. Sidebar ---
    "--sidebar-bg": "#ffffff",
    "--sidebar-fg": "#374151",
    "--sidebar-primary": "#ff9900",
    "--sidebar-primary-fg": "#ffffff",
    "--sidebar-accent": "#f3f4f6",
    "--sidebar-accent-fg": "#111827",
    "--sidebar-border": "#e5e7eb",
    "--sidebar-ring": "#ff9900",

    // --- 8. Component Specifics ---
    "--font-display": "'Open Sans', sans-serif",

    // Buttons
    "--btn-secondary-bg": "#f3f4f6",
    "--btn-secondary-hover": "#e5e7eb",
    "--btn-secondary-text": "#111827",

    "--btn-destructive-bg": "#ef4444",
    "--btn-destructive-hover": "#dc2626",
    "--btn-destructive-text": "#ffffff",

    "--btn-ghost-hover-bg": "rgba(255, 153, 0, 0.1)",
  },
} as const;

export type ThemeKey = keyof typeof themes;
