/**
 * Validates if the selected date is at least minDays from today
 */
export const isDateValid = (dateString: string, minDays = 5): boolean => {
  if (!dateString) return false;

  const selectedDate = new Date(dateString);
  const today = new Date();

  // Reset time parts to compare dates only
  today.setHours(0, 0, 0, 0);

  // Calculate the minimum valid date (today + minDays)
  const minValidDate = new Date(today);
  minValidDate.setDate(today.getDate() + minDays);

  return selectedDate >= minValidDate;
};

/**
 * Returns the minimum valid date for scheduling (today + minDays)
 */
export const getMinValidDate = (minDays = 5): string => {
  const date = new Date();
  date.setDate(date.getDate() + minDays);

  // Format to YYYY-MM-DDThh:mm
  return date.toISOString().slice(0, 16);
};

/**
 * Formats a date string to a readable format
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
