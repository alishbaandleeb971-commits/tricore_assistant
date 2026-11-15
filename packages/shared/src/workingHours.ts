export interface WorkingHoursResult {
  isWithinWorkingHours: boolean;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  pktHour: number;
  pktMinute: number;
  reason?: "outside_hours" | "weekend" | "within_hours";
}

/**
 * Working hours: 9:00 AM – 7:00 PM PKT (UTC+5), Monday to Friday.
 */
export function isWithinPktWorkingHours(date = new Date()): WorkingHoursResult {
  // Convert UTC time to PKT (UTC+5)
  const utcMillis = date.getTime() + date.getTimezoneOffset() * 60000;
  const pktMillis = utcMillis + 5 * 3600000;
  const pktDate = new Date(pktMillis);

  const dayOfWeek = pktDate.getDay();
  const pktHour = pktDate.getHours();
  const pktMinute = pktDate.getMinutes();

  // Check weekend: 0 = Sunday, 6 = Saturday
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return {
      isWithinWorkingHours: false,
      dayOfWeek,
      pktHour,
      pktMinute,
      reason: "weekend"
    };
  }

  // Check 9:00 AM (9) to 7:00 PM (19)
  if (pktHour >= 9 && pktHour < 19) {
    return {
      isWithinWorkingHours: true,
      dayOfWeek,
      pktHour,
      pktMinute,
      reason: "within_hours"
    };
  }

  return {
    isWithinWorkingHours: false,
    dayOfWeek,
    pktHour,
    pktMinute,
    reason: "outside_hours"
  };
}
