import { TripPlan, DayPlan, ItineraryEvent } from '../types/types';

/**
 * Generate Google Calendar URL for a single event
 */
const generateCalendarUrl = (event: ItineraryEvent, date: string): string => {
    try {
        // Parse time and create start/end times
        const startDateTime = new Date(`${date}T${event.time}:00`);
        const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // 1 hour duration

        // Format to Google Calendar format: YYYYMMDDTHHMMSSZ
        const formatDate = (d: Date) => {
            return d.toISOString().replace(/-|:|\.\d+/g, '');
        };

        const startTime = formatDate(startDateTime);
        const endTime = formatDate(endDateTime);

        const location = event.address || event.locationName;
        const details = `${event.description}\n\nNotes: ${event.notes || ''}\nBooking: ${event.bookingLink || ''}\nCost: ${event.costEstimate} VND`;

        const baseUrl = "https://calendar.google.com/calendar/render";
        const params = new URLSearchParams({
            action: "TEMPLATE",
            text: `[TravelPal] ${event.activity}`,
            dates: `${startTime}/${endTime}`,
            details: details,
            location: location,
        });

        return `${baseUrl}?${params.toString()}`;
    } catch (error) {
        console.error('Error generating calendar URL:', error);
        return '';
    }
};

/**
 * Open Google Calendar URLs for all events in a day
 * Opens each event in a new tab
 */
export const addDayToCalendar = (dayPlan: DayPlan): { successCount: number } => {
    let successCount = 0;

    dayPlan.events.forEach(event => {
        // Skip rejected events
        if (event.status === 'rejected') return;

        const url = generateCalendarUrl(event, dayPlan.date);
        if (url) {
            window.open(url, '_blank');
            successCount++;
        }
    });

    return { successCount };
};

/**
 * Open Google Calendar URLs for all events in the trip
 */
export const addTripToCalendar = (tripPlan: TripPlan): { successCount: number } => {
    let successCount = 0;

    tripPlan.itinerary.forEach(day => {
        day.events.forEach(event => {
            if (event.status !== 'rejected') {
                const url = generateCalendarUrl(event, day.date);
                if (url) {
                    window.open(url, '_blank');
                    successCount++;
                }
            }
        });
    });

    return { successCount };
};
