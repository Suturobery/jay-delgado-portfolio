// Tailwind CDN theme customization: brand palette and font families used across the site.
tailwind.config = {
  theme: {
    extend: {
      colors: {
        ink: '#0A0A0A',
        paper: '#F5F5F2',
        graphite: '#141414',
        steel: '#1F1F1F',
        line: '#2E2E2E',
        signal: '#3D5CFF',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      }
    }
  }
};
