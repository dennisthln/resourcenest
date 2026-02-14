import { NormalizedEvent } from '../types';
import { formatTime } from '../utils/date';

export function createEventElement(
  event: NormalizedEvent,
  timelineWidth: number,
  totalHours: number,
  dayIndex: number,
  hoursPerDay: number,
  startHour: number
): HTMLElement {
  const dayStart = new Date(event.from);
  dayStart.setHours(startHour, 0, 0, 0);

  const eventStart = event.from < dayStart ? dayStart : event.from;
  const eventEnd = event.to; // Assuming event 'to' is within the visible range for now

  // Calculate position relative to entire timeline
  const hourOffsetInDay = (eventStart.getHours() - startHour) + (eventStart.getMinutes() / 60);
  const totalHourOffset = (dayIndex * hoursPerDay) + hourOffsetInDay;
  const durationHours = (eventEnd.getTime() - eventStart.getTime()) / (1000 * 60 * 60);

  const left = (timelineWidth / totalHours) * totalHourOffset;
  const width = Math.max(40, (timelineWidth / totalHours) * durationHours);

  const eventEl = document.createElement('div');
  eventEl.className = 'rn-event';
  if (event.status === 'Cancelled' || event.status === 'cancelled') {
    eventEl.classList.add('status-cancelled');
  }
  if (event.status === 'Confirmed' || event.status === 'confirmed') {
    eventEl.classList.add('status-confirmed');
  }

  eventEl.style.left = `${left}px`;
  eventEl.style.width = `${width}px`;
  eventEl.title = event.label;
  eventEl.dataset.eventId = String(event.id);

  eventEl.innerHTML = `
    <div class="rn-event-time">${formatTime(event.from)}</div>
    <div class="rn-event-label">${event.label}</div>
    ${event.guestCount ? `<div class="rn-event-guests">${event.guestCount} people</div>` : ''}
  `;

  return eventEl;
}
