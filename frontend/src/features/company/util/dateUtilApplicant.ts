export const formatInterviewDate = (dateString: string): string => {
  if (!dateString) return "";

  const date = new Date(dateString);

  // Format options
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  return new Intl.DateTimeFormat("en-US", options).format(date);
};

export const getMinValidDate = (): string => {
  const today = new Date();
  const fiveDaysFromNow = new Date(today.setDate(today.getDate() + 5));

  // Format for datetime-local input
  return fiveDaysFromNow.toISOString().slice(0, 16);
};

export const isDateValid = (dateString: string): boolean => {
  if (!dateString) return false;

  const selectedDate = new Date(dateString);
  const today = new Date();
  const fiveDaysFromNow = new Date(today);
  fiveDaysFromNow.setDate(today.getDate() + 5);

  return selectedDate >= fiveDaysFromNow;
};
