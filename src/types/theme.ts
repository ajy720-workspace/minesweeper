export type Theme = 'light' | 'dark' | 'system'
export type ColorTheme = 'classic' | 'modern' | 'neon'

export interface ThemeContextType {
  theme: Theme
  colorTheme: ColorTheme
  resolvedTheme: 'light' | 'dark'
  setTheme: (theme: Theme) => void
  setColorTheme: (colorTheme: ColorTheme) => void
}

export interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
  defaultColorTheme?: ColorTheme
}