import { TripPlan } from '../types/types';

export const addTripToCalendar = async (tripPlan: TripPlan, accessToken: string) => {
    const events = [];

    // Flatten all events from the itinerary
    tripPlan.itinerary.forEach(day => {
        day.events.forEach(event => {
            if (event.status !== 'rejected') {
                events.push({
                    ...event,
                    date: day.date
                });
            }
        });
    });

    let successCount = 0;
    let failCount = 0;

    for (const event of events) {
        try {
            // Parse time (HH:mm) and date (YYYY-MM-DD) to ISO format
            const startDateTime = new Date(`${event.date}T${event.time}:00`);
            const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // Default 1 hour duration

            const calendarEvent = {
                summary: `[TravelPal] ${event.activity}`,
                location: event.address || event.locationName,
                description: `${event.description}\n\nNotes: ${event.notes || ''}\nBooking: ${event.bookingLink || ''}`,
                start: {
                    dateTime: startDateTime.toISOString(),
                    timeZone: 'Asia/Ho_Chi_Minh', // Adjust as needed or infer from location
                },
                end: {
                    dateTime: endDateTime.toISOString(),
                    timeZone: 'Asia/Ho_Chi_Minh',
                },
            };

            const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(calendarEvent),
            });

            if (response.ok) {
                successCount++;
            } else {
                console.error('Failed to add event:', await response.text());
                failCount++;
            }
        } catch (error) {
            console.error('Error adding event to calendar:', error);
            failCount++;
        }
    }

    return { successCount, failCount };
};
