'use client'

import { Palette } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { ColorTheme } from '@/types/theme'

const colorThemeLabels: Record<ColorTheme, string> = {
  classic: 'Classic',
  modern: 'Modern',
  neon: 'Neon',
}

const colorThemeDescriptions: Record<ColorTheme, string> = {
  classic: 'Traditional gray tones',
  modern: 'Subtle blue accents',
  neon: 'Vibrant purple highlights',
}

export function ColorThemeSelector() {
  const { colorTheme, setColorTheme } = useTheme()

  return (
    <div className="flex items-center gap-2">
      <Palette className="h-4 w-4 text-muted-foreground" />
      <Select value={colorTheme} onValueChange={setColorTheme}>
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(colorThemeLabels).map(([value, label]) => (
            <SelectItem 
              key={value} 
              value={value}
              className="flex flex-col items-start"
            >
              <div className="font-medium">{label}</div>
              <div className="text-xs text-muted-foreground">
                {colorThemeDescriptions[value as ColorTheme]}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}