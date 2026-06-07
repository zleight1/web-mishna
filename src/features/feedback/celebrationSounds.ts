export type CelebrationKind = 'correct' | 'wrong' | 'perfect' | 'lessonComplete'

let audioCtx: AudioContext | null = null

function getCtx(): AudioContext | null {
  if (typeof AudioContext === 'undefined') return null
  if (!audioCtx) audioCtx = new AudioContext()
  if (audioCtx.state === 'suspended') void audioCtx.resume()
  return audioCtx
}

function tone(
  ctx: AudioContext,
  freq: number,
  start: number,
  duration: number,
  type: OscillatorType = 'sine',
  gain = 0.12,
) {
  const osc = ctx.createOscillator()
  const amp = ctx.createGain()
  osc.type = type
  osc.frequency.value = freq
  amp.gain.setValueAtTime(0.0001, start)
  amp.gain.exponentialRampToValueAtTime(gain, start + 0.02)
  amp.gain.exponentialRampToValueAtTime(0.0001, start + duration)
  osc.connect(amp)
  amp.connect(ctx.destination)
  osc.start(start)
  osc.stop(start + duration + 0.05)
}

function wobble(ctx: AudioContext, start: number) {
  const osc = ctx.createOscillator()
  const amp = ctx.createGain()
  osc.type = 'triangle'
  osc.frequency.setValueAtTime(220, start)
  osc.frequency.exponentialRampToValueAtTime(110, start + 0.18)
  amp.gain.setValueAtTime(0.0001, start)
  amp.gain.exponentialRampToValueAtTime(0.14, start + 0.02)
  amp.gain.exponentialRampToValueAtTime(0.0001, start + 0.22)
  osc.connect(amp)
  amp.connect(ctx.destination)
  osc.start(start)
  osc.stop(start + 0.28)
}

export function playCelebrationSound(kind: CelebrationKind, combo = 0) {
  const ctx = getCtx()
  if (!ctx) return
  const t = ctx.currentTime

  if (kind === 'correct') {
    tone(ctx, 523.25, t, 0.12)
    tone(ctx, 659.25, t + 0.1, 0.12)
    tone(ctx, 783.99, t + 0.2, 0.18, 'sine', 0.1)
    if (combo >= 3) {
      tone(ctx, 1046.5, t + 0.28, 0.14, 'triangle', 0.09)
    }
    if (combo >= 5) {
      tone(ctx, 1318.5, t + 0.36, 0.12, 'triangle', 0.08)
    }
    return
  }

  if (kind === 'wrong') {
    wobble(ctx, t)
    tone(ctx, 146.83, t + 0.08, 0.2, 'square', 0.05)
    return
  }

  if (kind === 'perfect') {
    ;[523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      tone(ctx, freq, t + i * 0.09, 0.16, 'triangle', 0.1)
    })
    return
  }

  // lessonComplete — little fanfare
  const melody = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5]
  melody.forEach((freq, i) => {
    tone(ctx, freq, t + i * 0.11, 0.2, i % 2 === 0 ? 'triangle' : 'sine', 0.11)
  })
}
