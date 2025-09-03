"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sun, Moon, Monitor, Palette } from "lucide-react"

type Theme = "light" | "dark" | "system"
type ColorScheme = "default" | "blue" | "green" | "purple" | "orange"

export function ThemeSwitcher() {
  const [theme, setTheme] = React.useState<Theme>("system")
  const [colorScheme, setColorScheme] = React.useState<ColorScheme>("default")

  React.useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme
    const savedColorScheme = localStorage.getItem("colorScheme") as ColorScheme

    if (savedTheme) setTheme(savedTheme)
    if (savedColorScheme) setColorScheme(savedColorScheme)

    applyTheme(savedTheme || "system", savedColorScheme || "default")
  }, [])

  const applyTheme = (newTheme: Theme, newColorScheme: ColorScheme) => {
    const root = document.documentElement

    // Remove existing theme classes
    root.classList.remove("light", "dark")

    // Apply theme
    if (newTheme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      root.classList.add(systemTheme)
    } else {
      root.classList.add(newTheme)
    }

    // Apply color scheme
    root.setAttribute("data-color-scheme", newColorScheme)

    // Store preferences
    localStorage.setItem("theme", newTheme)
    localStorage.setItem("colorScheme", newColorScheme)
  }

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme)
    applyTheme(newTheme, colorScheme)
  }

  const handleColorSchemeChange = (newColorScheme: ColorScheme) => {
    setColorScheme(newColorScheme)
    applyTheme(theme, newColorScheme)
  }

  const themeOptions = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ]

  const colorSchemeOptions = [
    { value: "default", label: "Default" },
    { value: "blue", label: "Blue" },
    { value: "green", label: "Green" },
    { value: "purple", label: "Purple" },
    { value: "orange", label: "Orange" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Palette className="h-5 w-5" />
          <span>Appearance</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="text-sm font-medium mb-3 block">Theme</label>
          <div className="grid grid-cols-3 gap-2">
            {themeOptions.map((option) => {
              const Icon = option.icon
              return (
                <Button
                  key={option.value}
                  variant={theme === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleThemeChange(option.value as Theme)}
                  className="flex flex-col items-center space-y-1 h-auto py-3"
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-xs">{option.label}</span>
                </Button>
              )
            })}
          </div>
        </div>

        <Select
          label="Color Scheme"
          value={colorScheme}
          onValueChange={(value) => handleColorSchemeChange(value as ColorScheme)}
          options={colorSchemeOptions}
        />

        <div className="grid grid-cols-5 gap-2">
          {colorSchemeOptions.map((scheme) => (
            <button
              key={scheme.value}
              onClick={() => handleColorSchemeChange(scheme.value as ColorScheme)}
              className={`h-8 w-full rounded-md border-2 transition-all ${
                colorScheme === scheme.value ? "border-primary" : "border-border"
              }`}
              style={{
                backgroundColor: {
                  default: "hsl(var(--primary))",
                  blue: "#3b82f6",
                  green: "#10b981",
                  purple: "#8b5cf6",
                  orange: "#f59e0b",
                }[scheme.value],
              }}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
