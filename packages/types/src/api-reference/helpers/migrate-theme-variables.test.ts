import { describe, expect, it, vi } from 'vitest'

import legacyTheme from '@test/fixtures/legacy-theme.css?raw'
import { migrateThemeVariables } from './migrate-theme-variables.ts'

describe('migrateThemeVariables', () => {
  it('Changes a legacy theme variable', () => {
    const res = migrateThemeVariables('--theme-color-1')
    expect(res).toBe('--scalar-color-1')
  })

  it('Changes a legacy sidebar variable', () => {
    const res = migrateThemeVariables('--sidebar-color-1')
    expect(res).toBe('--scalar-sidebar-color-1')
  })

  it("Doesn't change a new scalar variable", () => {
    const res = migrateThemeVariables('--scalar-color-1')
    expect(res).toBe('--scalar-color-1')
  })

  it("Doesn't change a new sidebar variable", () => {
    const res = migrateThemeVariables('--scalar-sidebar-color-1')
    expect(res).toBe('--scalar-sidebar-color-1')
  })

  it.skip('Can migrate a long style string', () => {
    const res = migrateThemeVariables(legacyTheme)
    expect(res).toMatchFileSnapshot('../fixtures/updatedTheme.css')
  })

  it('Shows a warning in the console', () => {
    const consoleSpy = vi.spyOn(console, 'warn')
    migrateThemeVariables('--theme-color-1')
    expect(consoleSpy).toHaveBeenCalled()
  })
})
