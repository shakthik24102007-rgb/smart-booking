export interface TimeSlot {
  id: string;
  name: string;
  shortLabel: string;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  displayTime: string;
}

export const ORDERING_TIME_SLOTS: TimeSlot[] = [
  {
    id: 'breakfast',
    name: 'Breakfast Slot',
    shortLabel: 'Breakfast',
    startHour: 8,
    startMinute: 30,
    endHour: 9,
    endMinute: 30,
    displayTime: '8:30 AM – 9:30 AM',
  },
  {
    id: 'morning_snack',
    name: 'Morning Refreshment',
    shortLabel: 'Morning Snack',
    startHour: 11,
    startMinute: 0,
    endHour: 11,
    endMinute: 45,
    displayTime: '11:00 AM – 11:45 AM',
  },
  {
    id: 'lunch',
    name: 'Lunch Slot',
    shortLabel: 'Lunch',
    startHour: 12,
    startMinute: 30,
    endHour: 14,
    endMinute: 30,
    displayTime: '12:30 PM – 2:30 PM',
  },
  {
    id: 'evening_snack',
    name: 'Tea & Evening Snack',
    shortLabel: 'Evening Snack',
    startHour: 16,
    startMinute: 0,
    endHour: 16,
    endMinute: 30,
    displayTime: '4:00 PM – 4:30 PM',
  },
];

/**
 * Converts a Date object to total minutes from midnight (0 - 1439)
 */
export function getMinutesFromMidnight(date: Date): number {
  return date.getHours() * 60 + date.getMinutes();
}

/**
 * Converts hours and minutes to total minutes from midnight
 */
export function toMinutes(hour: number, minute: number): number {
  return hour * 60 + minute;
}

/**
 * Returns the currently active ordering time slot if current time falls within one, otherwise null.
 */
export function getCurrentOrderingSlot(date: Date): TimeSlot | null {
  const currentMinutes = getMinutesFromMidnight(date);

  for (const slot of ORDERING_TIME_SLOTS) {
    const startMins = toMinutes(slot.startHour, slot.startMinute);
    const endMins = toMinutes(slot.endHour, slot.endMinute);

    if (currentMinutes >= startMins && currentMinutes < endMins) {
      return slot;
    }
  }

  return null;
}

export interface NextSlotInfo {
  slot: TimeSlot;
  secondsUntilStart: number;
  isToday: boolean;
}

/**
 * Calculates the next upcoming ordering slot and remaining seconds until it starts.
 */
export function getNextOrderingSlot(date: Date): NextSlotInfo {
  const currentMinutes = getMinutesFromMidnight(date);
  const currentSecondsInDay = currentMinutes * 60 + date.getSeconds();

  // Find next slot today
  for (const slot of ORDERING_TIME_SLOTS) {
    const startSeconds = toMinutes(slot.startHour, slot.startMinute) * 60;
    if (startSeconds > currentSecondsInDay) {
      return {
        slot,
        secondsUntilStart: startSeconds - currentSecondsInDay,
        isToday: true,
      };
    }
  }

  // If past all slots today, the next slot is the first slot tomorrow (Breakfast)
  const firstSlotTomorrow = ORDERING_TIME_SLOTS[0];
  const firstSlotSecondsTomorrow = toMinutes(firstSlotTomorrow.startHour, firstSlotTomorrow.startMinute) * 60;
  const secondsLeftToday = 86400 - currentSecondsInDay;
  const totalSeconds = secondsLeftToday + firstSlotSecondsTomorrow;

  return {
    slot: firstSlotTomorrow,
    secondsUntilStart: totalSeconds,
    isToday: false,
  };
}

/**
 * Returns seconds remaining in the currently active slot.
 */
export function getSecondsRemainingInSlot(date: Date, slot: TimeSlot): number {
  const currentSecondsInDay = getMinutesFromMidnight(date) * 60 + date.getSeconds();
  const endSeconds = toMinutes(slot.endHour, slot.endMinute) * 60;
  return Math.max(0, endSeconds - currentSecondsInDay);
}

/**
 * Formats seconds into a human readable timer string (e.g., "15m 32s" or "1h 24m")
 */
export function formatTimerSeconds(totalSeconds: number): string {
  if (totalSeconds <= 0) return '0s';

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
}

/**
 * Formats seconds into a compact HH:MM:SS clock string (e.g. "01:24:05")
 */
export function formatClockTimer(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');

  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }
  return `${pad(minutes)}:${pad(seconds)}`;
}
