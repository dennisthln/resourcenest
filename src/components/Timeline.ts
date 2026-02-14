import { Resource, NormalizedEvent, ResourceNestOptions } from '../types';
import { isSameDay } from '../utils/date';

interface Hour {
  hour: number;
  label: string;
  isCurrent: boolean;
}

export function createTimeline(
  resources: Resource[],
  visibleDates: Date[],
  options: ResourceNestOptions
): HTMLElement {
  const { startHour, endHour, stickyHourLabels } = options;
  const chartElement = document.createElement('div');
  chartElement.className = 'rn-chart';

  const hours = _getHours(startHour, endHour, visibleDates[0]); // Assuming single day for now
  const isMultiDay = visibleDates.length > 1;

  // Generate hour cells for each day
  const allHourCells = visibleDates.flatMap((date, dayIndex) =>
    hours.map(h => ({
      ...h,
      dayIndex,
      date,
      isCurrent: isSameDay(date, new Date()) && new Date().getHours() === h.hour,
    }))
  );

  chartElement.innerHTML = `
    ${isMultiDay ? _renderMultiDayHeader(visibleDates, hours.length) : ''}
    <div class="rn-hour-labels ${stickyHourLabels ? 'is-sticky' : ''}">
      <div class="rn-hour-labels-track">
        ${allHourCells.map(h => `
          <div class="rn-hour-cell ${h.isCurrent ? 'is-current' : ''}">${h.label}</div>
        `).join('')}
      </div>
    </div>
    <div class="rn-scroll-x">
      <div class="rn-timeline" data-days="${visibleDates.length}" data-hours="${hours.length}">
        ${resources.map(r => `
          <div class="rn-timeline-row" data-resource-id="${r.id}">
            ${allHourCells.map(h => `
              <div class="rn-timeline-cell ${h.isCurrent ? 'is-current' : ''}" data-day="${h.dayIndex}"></div>
            `).join('')}
          </div>
        `).join('')}
      </div>
    </div>
  `;

  // Event rendering will be handled separately
  // and appended to the rn-timeline-row elements.

  return chartElement;
}

function _getHours(startHour: number, endHour: number, currentDate: Date): Hour[] {
  const hours = [];
  const now = new Date();
  for (let h = startHour; h < endHour; h++) {
    hours.push({
      hour: h,
      label: `${h.toString().padStart(2, '0')}:00`,
      isCurrent: isSameDay(now, currentDate) && now.getHours() === h,
    });
  }
  return hours;
}

function _renderMultiDayHeader(dates: Date[], hoursPerDay: number): string {
  const now = new Date();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']; // More universal short names
  return `
    <div class="rn-day-header">
      ${dates.map(date => {
        const isToday = isSameDay(date, now);
        const dayName = dayNames[date.getDay()];
        const dayNum = date.getDate();
        return `<div class="rn-day-column-header ${isToday ? 'is-today' : ''}" style="flex: ${hoursPerDay};">${dayName} ${dayNum}</div>`;
      }).join('')}
    </div>
  `;
}
