export function updateStreak(lastActiveDate: string, streak: number, today: string): number {
  if (!lastActiveDate) return 1
  if (lastActiveDate === today) return streak
  const last = new Date(lastActiveDate)
  const curr = new Date(today)
  const diffDays = Math.floor((curr.getTime() - last.getTime()) / 86400000)
  if (diffDays === 1) return streak + 1
  return 1
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10)
}
