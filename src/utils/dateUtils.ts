
import { ItineraryEvent } from "../types/types";

/**
 * Converts specific date and time string (e.g. "2023-10-25", "09:00 AM") into ISO format for Google Calendar
 * Google Calendar format: YYYYMMDDTHHMMSSZ
 */
const formatToGoogleCalendarDate = (dateStr: string, timeStr: string): string => {
  try {
    // Parse the date
    const date = new Date(dateStr);
    
    // Parse the time (Assume format is HH:MM AM/PM or HH:MM)
    const [time, modifier] = timeStr.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    let adjustedHours = hours;
    
    if (modifier) {
        if (modifier.toLowerCase() === 'pm' && adjustedHours < 12) adjustedHours += 12;
        if (modifier.toLowerCase() === 'am' && adjustedHours === 12) adjustedHours = 0;
    }

    date.setHours(adjustedHours, minutes, 0);

    return date.toISOString().replace(/-|:|\.\d+/g, '');
  } catch {
    // Fallback to just the date if parsing fails
    return new Date().toISOString().replace(/-|:|\.\d+/g, '');
  }
};

export const generateGoogleCalendarLink = (event: ItineraryEvent, dateStr: string): string => {
  const startTime = formatToGoogleCalendarDate(dateStr, event.time);
  
  // Default to 1.5 hours duration
  // Re-do parsing to be safe for calculation
  const [time, modifier] = event.time.split(' ');
  const [hours, minutes] = time.split(':').map(Number);
  let adjustedHours = hours;
  if (modifier) {
      if (modifier.toLowerCase() === 'pm' && adjustedHours < 12) adjustedHours += 12;
      if (modifier.toLowerCase() === 'am' && adjustedHours === 12) adjustedHours = 0;
  }
  
  // Add 90 minutes
  const endTimestamp = new Date(new Date(dateStr).setHours(adjustedHours, minutes + 90));
  const endTime = endTimestamp.toISOString().replace(/-|:|\.\d+/g, '');

  const location = event.address || event.locationName;
  
  const details = `${event.description}\n\nCost: ${event.costEstimate} ${event.currency}\nContact: ${event.phoneNumber || 'N/A'}\nTransport: ${event.transportMethod}`;
  
  const baseUrl = "https://calendar.google.com/calendar/render";
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `Trip: ${event.activity}`,
    dates: `${startTime}/${endTime}`,
    details: details,
    location: location,
  });

  return `${baseUrl}?${params.toString()}`;
};
