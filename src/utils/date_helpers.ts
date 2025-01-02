export const getWeeklyDateRange = (year: any, month: any, day: any) => {
  const dateFromDay = (dateString: any) => {
    const day = new Date(dateString).getDate();
    return day;
  };

  const dayModified = dateFromDay(day);
  // Handle edge cases where the month might have different days (28, 29, 30, or 31)
  const lastDayOfMonth = new Date(year, month, 0).getDate(); // Get the last day of the month (28, 29, 30, or 31)

  // Create a Date object with the given year, month, and day
  const startDate = new Date(year, month - 1, dayModified); // Month is 0-indexed

  // Check if the selected day is within the last 7 days of the month
  if (dayModified > lastDayOfMonth - 6) {
    // If the selected day is in the last part of the month, return the range from the selected day to the last day of the month
    const endDate = new Date(year, month - 1, lastDayOfMonth); // End date is the last day of the month

    // Format dates as YYYY-MM-DD


    return {
      startDate: new Date(startDate).toISOString().split("T")[0],
      endDate: new Date(endDate).toISOString().split("T")[0],
    };
  } else {
    // If the selected date is not near the end of the month, calculate a standard 7-day range
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6); // 7-day range (0th day + 6 more days)

    return {
      startDate: new Date(startDate).toISOString().split("T")[0],
      endDate:  new Date(endDate).toISOString().split("T")[0],
    };
  }
};
