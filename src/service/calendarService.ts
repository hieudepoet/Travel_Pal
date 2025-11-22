import { TripPlan, DayPlan, ItineraryEvent } from '../types/types';

/**
 * Add a single day's events to Google Calendar using Calendar API
 */
export const addDayToCalendar = async (
    dayPlan: DayPlan,
    accessToken: string
): Promise<{ successCount: number; failCount: number }> => {
    console.log('🔍 addDayToCalendar called');
    console.log('📅 Day:', dayPlan.day, 'Date:', dayPlan.date);
    console.log('🔑 Token (first 20 chars):', accessToken.substring(0, 20) + '...');
    console.log('📊 Total events:', dayPlan.events.length);

    let successCount = 0;
    let failCount = 0;

    for (const event of dayPlan.events) {
        // Skip rejected events
        if (event.status === 'rejected') {
            console.log('⏭️ Skipping rejected event:', event.activity);
            continue;
        }

        try {
            // Parse time (HH:mm) and date (YYYY-MM-DD) to ISO format
            const startDateTime = new Date(`${dayPlan.date}T${event.time}:00`);
            const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // Default 1 hour duration

            const calendarEvent = {
                summary: `[TravelPal] ${event.activity}`,
                location: event.address || event.locationName,
                description: `${event.description}\n\nNotes: ${event.notes || ''}\nBooking: ${event.bookingLink || ''}\nCost: ${event.costEstimate} VND`,
                start: {
                    dateTime: startDateTime.toISOString(),
                    timeZone: 'Asia/Ho_Chi_Minh',
                },
                end: {
                    dateTime: endDateTime.toISOString(),
                    timeZone: 'Asia/Ho_Chi_Minh',
                },
            };

            console.log('📤 Creating event:', event.activity);

            const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(calendarEvent),
            });

            if (response.ok) {
                console.log('✅ Success:', event.activity);
                successCount++;
            } else {
                const errorText = await response.text();
                console.error('❌ Failed:', event.activity);
                console.error('Status:', response.status, response.statusText);
                console.error('Error:', errorText);
                failCount++;
            }
        } catch (error) {
            console.error('💥 Exception for event:', event.activity, error);
            failCount++;
        }
    }

    console.log('📊 Results - Success:', successCount, 'Failed:', failCount);
    return { successCount, failCount };
};

/**
 * Add all trip events to Google Calendar using Calendar API
 */
export const addTripToCalendar = async (
    tripPlan: TripPlan,
    accessToken: string
): Promise<{ successCount: number; failCount: number }> => {
    const events: Array<ItineraryEvent & { date: string }> = [];

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
                    timeZone: 'Asia/Ho_Chi_Minh',
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
                const errorText = await response.text();
                console.error('Failed to add event:', errorText);
                failCount++;
            }
        } catch (error) {
            console.error('Error adding event to calendar:', error);
            failCount++;
        }
    }

    return { successCount, failCount };
};
