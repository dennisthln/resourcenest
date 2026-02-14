import { ResourceNestOptions } from '../types';
import { formatDate } from '../utils/date';

export function createHeader(
  currentDate: Date,
  view: 'day' | '3days' | 'week',
  options: ResourceNestOptions,
  visibleDates: Date[]
): HTMLElement {
  const { showNavigation, showViewSwitcher, todayLabel, dateFormat, viewLabels } = options;
  const isMultiDay = visibleDates.length > 1;

  let dateDisplay;
  if (isMultiDay) {
    const firstDate = visibleDates[0];
    const lastDate = visibleDates[visibleDates.length - 1];
    dateDisplay = `${formatDate(firstDate, dateFormat)} - ${formatDate(lastDate, dateFormat)}`;
  } else {
    dateDisplay = formatDate(currentDate, dateFormat);
  }

  const headerElement = document.createElement('div');
  headerElement.className = 'rn-calendar-header';

  headerElement.innerHTML = `
    <div class="rn-date-display">${dateDisplay}</div>
    <div class="rn-nav-controls">
      ${showViewSwitcher ? `
        <div class="rn-view-switcher">
          <button class="rn-view-btn ${view === 'day' ? 'is-active' : ''}" data-view="day">${viewLabels.day}</button>
          <button class="rn-view-btn ${view === '3days' ? 'is-active' : ''}" data-view="3days">${viewLabels['3days']}</button>
          <button class="rn-view-btn ${view === 'week' ? 'is-active' : ''}" data-view="week">${viewLabels.week}</button>
        </div>
      ` : ''}
      ${showNavigation ? `
        <button class="rn-btn" data-action="today">${todayLabel}</button>
        <button class="rn-btn rn-btn-icon" data-action="prev">&#8249;</button>
        <button class="rn-btn rn-btn-icon" data-action="next">&#8250;</button>
      ` : ''}
    </div>
  `;

  return headerElement;
}
