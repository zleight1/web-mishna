import { describe, it, expect } from 'vitest'
import { createCelebration } from './useCelebration'

describe('createCelebration combo', () => {
  it('resets combo on wrong and blocks rebuild until activity ends', () => {
    const ctx = createCelebration()
    ctx.celebrate('correct')
    ctx.celebrate('correct')
    ctx.celebrate('correct')
    expect(ctx.combo.value).toBe(3)

    ctx.celebrate('wrong')
    expect(ctx.combo.value).toBe(0)
    expect(ctx.comboBroken.value).toBe(true)

    ctx.celebrate('correct')
    ctx.celebrate('correct')
    expect(ctx.combo.value).toBe(0)
    expect(ctx.comboBonusForActivity()).toBe(0)

    ctx.beginActivityCombo()
    ctx.celebrate('correct')
    expect(ctx.combo.value).toBe(1)
    expect(ctx.comboBroken.value).toBe(false)
  })

  it('keeps combo across correct answers without mistakes', () => {
    const ctx = createCelebration()
    ctx.celebrate('correct')
    ctx.celebrate('correct')
    expect(ctx.comboBonusForActivity()).toBe(1)
    ctx.beginActivityCombo()
    ctx.celebrate('correct')
    expect(ctx.combo.value).toBe(3)
    expect(ctx.comboBonusForActivity()).toBe(3)
  })
})
