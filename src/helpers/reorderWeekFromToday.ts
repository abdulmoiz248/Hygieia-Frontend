const DAY_ALIASES: Record<number, string[]> = {
  0: ["sun", "sunday", "su"],
  1: ["mon", "monday", "m"],
  2: ["tue", "tues", "tuesday", "tu", "t"],
  3: ["wed", "wednesday", "w"],
  4: ["thu", "thur", "thurs", "thursday", "th"],
  5: ["fri", "friday", "f"],
  6: ["sat", "saturday", "sa"],
}

function normalizeDayValue(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z]/g, "")
}

function resolveDayIndex(dayLabel: string): number | null {
  const normalized = normalizeDayValue(dayLabel)

  for (const [dayIndex, aliases] of Object.entries(DAY_ALIASES)) {
    if (aliases.includes(normalized)) {
      return Number(dayIndex)
    }
  }

  return null
}

export function reorderWeekDataFromToday<T>(items: T[], getDayLabel: (item: T) => string): T[] {
  if (items.length <= 1) return items

  const todayIndex = new Date().getDay()

  const withDayIndex = items
    .map((item, originalIndex) => ({
      item,
      originalIndex,
      dayIndex: resolveDayIndex(getDayLabel(item)),
    }))
    .filter((entry) => entry.dayIndex !== null)

  if (withDayIndex.length === 0) return items

  const ordered = [...withDayIndex].sort((a, b) => {
    const aForwardDistance = ((a.dayIndex as number) - todayIndex + 7) % 7
    const bForwardDistance = ((b.dayIndex as number) - todayIndex + 7) % 7

    const aDistance = aForwardDistance === 0 ? 7 : aForwardDistance
    const bDistance = bForwardDistance === 0 ? 7 : bForwardDistance

    if (aDistance !== bDistance) return aDistance - bDistance
    return a.originalIndex - b.originalIndex
  })

  if (withDayIndex.length === items.length) {
    return ordered.map((entry) => entry.item)
  }

  const notMatched = items.filter((item) => resolveDayIndex(getDayLabel(item)) === null)
  return [...ordered.map((entry) => entry.item), ...notMatched]
}
