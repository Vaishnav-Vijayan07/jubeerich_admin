import moment from 'moment-timezone';

export interface StatusObjType {
  status_name: string;
  color: string;
}

export const handleDateFormat = (date: string | Date) => {
  const dueDate = new Date(date);

  // Extract day, month, and year components
  const day = dueDate.getDate().toString().padStart(2, "0");
  const month = (dueDate.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-based, so we add 1
  const year = dueDate.getFullYear().toString();

  // Create the formatted date string
  const formattedDate = `${day}-${month}-${year}`;

  return formattedDate;
};

export const DateReverse = (DateString: any) => {
  return DateString?.split("-").reverse().join("-");
};

const timezone = 'Asia/Kolkata';


export const formatTimestamp = (timestamp: any) => {
  // Create a moment object in the specified timezone
  const date = moment.tz(timestamp, timezone);

  const day = date.date(); // Day of the month
  const month = date.format('MMM'); // Short month name (e.g., Jan, Feb)
  let hours = date.hours(); // Get hours in 24-hour format
  const minutes = date.minutes(); // Get minutes

  const ampm = hours >= 12 ? 'pm' : 'am'; // Determine AM/PM
  hours = hours % 12 || 12; // Convert to 12-hour format

  // Format time string
  const time = minutes === 0 ? `${hours}${ampm}` : `${hours}:${minutes < 10 ? '0' : ''}${minutes}${ampm}`;

  // Return formatted date and time
  return `${day} ${month} ${time}`;
};


export const getTimeFromTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  // Determine if it's AM or PM
  const ampm = hours >= 12 ? "PM" : "AM";
  // Convert hours to 12-hour format
  const formattedHours = hours % 12 || 1;
  const formattedTime = `${String(formattedHours).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${ampm}`;
  return formattedTime;
};

export const FindStatusName = (status_id: string, Status: any) => {
  if (Status) {
    const statusObject: StatusObjType = Status.find((status: any) => status.id === status_id);
    if (statusObject) {
      return statusObject.status_name;
    }
  }
  return "";
};

export const FindStatusColor = (status_id: string, Status: any) => {
  if (Status) {
    const statusObject: StatusObjType = Status.find((status: any) => status.id === status_id);
    if (statusObject) {
      return statusObject.color;
    }
  }
  return "";
};

export const setColorOpacity = (color: string | null) => {
  const rgbaComponents = color?.match(/\d+(\.\d+)?/g);
  // let updatedColor;
  if (rgbaComponents && rgbaComponents.length === 4) {
    // Update the alpha (opacity) value to 0.2 (20% opacity)
    rgbaComponents[3] = "0.2";

    // Reconstruct the updated RGBA color value
    return `rgba(${rgbaComponents.join(", ")})`;
  }
};

//truncate text
export const truncateText = (text: string, maxLength: number) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
};
