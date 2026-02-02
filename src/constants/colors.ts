export const colors = {
  // Primary colors
  primary: {
    50: '#e6f7ff',
    100: '#bae7ff',
    200: '#91d5ff',
    300: '#69c0ff',
    400: '#40a9ff',
    500: '#1890ff',
    600: '#096dd9',
    700: '#0050b3',
    800: '#003a8c',
    900: '#002766',
  },
  
  // Secondary colors
  secondary: {
    50: '#f6ffed',
    100: '#d9f7be',
    200: '#b7eb8f',
    300: '#95de64',
    400: '#73d13d',
    500: '#52c41a',
    600: '#389e0d',
    700: '#237804',
    800: '#135200',
    900: '#092b00',
  },
  
  // Neutral colors
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e8e8e8',
    300: '#d9d9d9',
    400: '#bfbfbf',
    500: '#8c8c8c',
    600: '#595959',
    700: '#434343',
    800: '#262626',
    900: '#1f1f1f',
  },
  
  // Semantic colors
  success: '#52c41a',
  warning: '#faad14',
  error: '#ff4d4f',
  info: '#1890ff',
  
  // Background colors
  background: {
    light: '#ffffff',
    dark: '#121212',
  },
  
  // Text colors
  text: {
    light: {
      primary: '#262626',
      secondary: '#595959',
      disabled: '#bfbfbf',
    },
    dark: {
      primary: '#f5f5f5',
      secondary: '#bfbfbf',
      disabled: '#595959',
    },
  },
  
  // Border colors
  border: {
    light: '#e8e8e8',
    dark: '#434343',
  },
};

export type ColorPalette = typeof colors;