/**
 * @dennisthln/resourcenest
 * Professional resource calendar UI for displaying and managing resource scheduling.
 * Works with any framework: Vue, React, Angular, plain HTML, etc.
 */

// ============ UTILITIES ============
function formatTime(date) {
  const h = date.getHours().toString().padStart(2, '0');
  const m = date.getMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
}

function formatDate(date, format = 'DD.MM.YYYY') {
  const d = date.getDate().toString().padStart(2, '0');
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const y = date.getFullYear();
  return format.replace('DD', d).replace('MM', m).replace('YYYY', y);
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
}

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function isSameDay(date1, date2) {
  return date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate();
}

function roundToMinutes(date, minutes = 5) {
  const ms = 1000 * 60 * minutes;
  return new Date(Math.round(date.getTime() / ms) * ms);
}

// ============ DEFAULT OPTIONS ============
const DEFAULTS = {
  startHour: 8,
  endHour: 22,
  events: [],
  resources: [],
  locale: 'de-DE',
  dateFormat: 'DD.MM.YYYY',
  todayLabel: 'Today',
  loadingLabel: 'Loading...',
  showNavigation: true,
  showNowIndicator: true,
  showViewSwitcher: true,
  eventClickable: true,
  timeClickable: true,
  // View modes: 'day', '3days', 'week'
  view: 'day',
  viewLabels: {
    day: 'Day',
    '3days': '3 Days',
    week: 'Week',
  },
  // Callbacks
  onEventClick: null,
  onTimeClick: null,
  onDateChange: null,
  onViewChange: null,
};

// ============ STYLES ============
const CALENDAR_STYLES = `
.rn-timeline-calendar {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  padding: 1rem;
  box-sizing: border-box;
}
.rn-timeline-calendar *, .rn-timeline-calendar *::before, .rn-timeline-calendar *::after {
  box-sizing: border-box;
}
.rn-calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.rn-date-display {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
}
.rn-nav-controls {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
.rn-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid #d1d5db;
  background: #fff;
  color: #374151;
  transition: background 0.15s, border-color 0.15s;
}
.rn-btn:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}
.rn-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.rn-btn-icon {
  padding: 8px;
  min-width: 36px;
}
.rn-calendar-body {
  display: flex;
  position: relative;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  min-height: 200px;
  overflow: hidden;
}
.rn-loading-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255,255,255,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  font-weight: 600;
  color: #6b7280;
}
.rn-resource-sidebar {
  width: 140px;
  flex-shrink: 0;
  background: #f9fafb;
  border-right: 1px solid #e5e7eb;
  margin-top: 40px;
}
.rn-resource-row {
  display: flex;
  align-items: center;
  height: 60px;
  padding: 0 1rem;
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.rn-chart {
  flex: 1;
  overflow-x: auto;
}
.rn-hour-labels {
  display: flex;
  height: 40px;
  background: #f3f4f6;
  border-bottom: 1px solid #e5e7eb;
}
.rn-hour-cell {
  flex: 1;
  min-width: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  color: #4b5563;
  border-right: 1px solid #e5e7eb;
}
.rn-hour-cell.is-current {
  background: #dbeafe;
  font-weight: 600;
  color: #1d4ed8;
}
.rn-timeline {
  position: relative;
}
.rn-timeline-row {
  display: flex;
  height: 60px;
  position: relative;
}
.rn-timeline-cell {
  flex: 1;
  min-width: 80px;
  border-right: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
}
.rn-timeline-cell.is-current {
  background: #eff6ff;
}
.rn-event {
  position: absolute;
  top: 6px;
  height: calc(100% - 12px);
  background: #3b82f6;
  color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  overflow: hidden;
  cursor: pointer;
  z-index: 10;
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.1);
  transition: transform 0.1s;
}
.rn-event:hover {
  transform: scale(1.02);
  z-index: 20;
}
.rn-event.status-cancelled {
  background: #ef4444;
}
.rn-event.status-confirmed {
  background: #10b981;
}
.rn-event-time {
  font-weight: 700;
}
.rn-event-label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.rn-event-guests {
  font-size: 0.7rem;
  opacity: 0.9;
}
.rn-now-indicator {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #ef4444;
  z-index: 30;
  pointer-events: none;
}
.rn-now-indicator::before {
  content: '';
  position: absolute;
  top: 0;
  left: -4px;
  width: 10px;
  height: 10px;
  background: #ef4444;
  border-radius: 50%;
}
.rn-view-switcher {
  display: flex;
  gap: 0;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  overflow: hidden;
}
.rn-view-btn {
  padding: 6px 12px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  border: none;
  background: #fff;
  color: #374151;
  transition: background 0.15s;
  border-right: 1px solid #d1d5db;
}
.rn-view-btn:last-child {
  border-right: none;
}
.rn-view-btn:hover {
  background: #f3f4f6;
}
.rn-view-btn.is-active {
  background: #3b82f6;
  color: #fff;
}
.rn-day-header {
  display: flex;
  background: #f3f4f6;
  border-bottom: 1px solid #e5e7eb;
}
.rn-day-column-header {
  flex: 1;
  text-align: center;
  padding: 8px 4px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #374151;
  border-right: 1px solid #e5e7eb;
}
.rn-day-column-header:last-child {
  border-right: none;
}
.rn-day-column-header.is-today {
  background: #dbeafe;
  color: #1d4ed8;
}
.rn-multi-day-timeline {
  display: flex;
}
.rn-day-column {
  flex: 1;
  border-right: 1px solid #e5e7eb;
}
.rn-day-column:last-child {
  border-right: none;
}
`;

function injectStyles() {
  if (document.getElementById('rn-timeline-calendar-styles')) return;
  const style = document.createElement('style');
  style.id = 'rn-timeline-calendar-styles';
  style.textContent = CALENDAR_STYLES;
  document.head.appendChild(style);
}

// ============ MAIN CLASS ============
class ResourceNest {
  constructor(selector, options = {}) {
    this.root = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!this.root) {
      throw new Error(`ResourceNest: Element "${selector}" not found`);
    }

    this.options = { ...DEFAULTS, ...options };
    this.currentDate = startOfDay(new Date());
    this.events = this._normalizeEvents(this.options.events);
    this.resources = this.options.resources || [];
    this.loading = false;
    this.view = this.options.view || 'day';

    injectStyles();
    this._render();
  }

  // ============ PUBLIC API ============

  /** Set events and re-render */
  setEvents(events) {
    this.events = this._normalizeEvents(events);
    this._renderTimeline();
    return this;
  }

  /** Set resources and re-render */
  setResources(resources) {
    this.resources = resources || [];
    this._render();
    return this;
  }

  /** Navigate to a specific date */
  setDate(date) {
    this.currentDate = startOfDay(new Date(date));
    this._render();
    this._emitDateChange();
    return this;
  }

  /** Navigate to today */
  goToToday() {
    this.currentDate = startOfDay(new Date());
    this._render();
    this._emitDateChange();
    return this;
  }

  /** Navigate to next day */
  nextDay() {
    const days = this._getViewDays();
    this.currentDate = addDays(this.currentDate, days);
    this._render();
    this._emitDateChange();
    return this;
  }

  /** Navigate to previous day */
  prevDay() {
    const days = this._getViewDays();
    this.currentDate = addDays(this.currentDate, -days);
    this._render();
    this._emitDateChange();
    return this;
  }

  /** Set view mode: 'day', '3days', 'week' */
  setView(view) {
    if (['day', '3days', 'week'].includes(view)) {
      this.view = view;
      this._render();
      this._emitViewChange();
    }
    return this;
  }

  /** Get current view mode */
  getView() {
    return this.view;
  }

  /** Show loading overlay */
  setLoading(loading) {
    this.loading = loading;
    const overlay = this.root.querySelector('.rn-loading-overlay');
    if (overlay) {
      overlay.style.display = loading ? 'flex' : 'none';
    }
    return this;
  }

  /** Refresh the calendar */
  refresh() {
    this._render();
    return this;
  }

  /** Scroll to current hour (if today is visible) */
  scrollToNow() {
    const chart = this.root.querySelector('.rn-chart');
    const now = new Date();
    if (!chart) return this;

    const visibleDates = this._getVisibleDates();
    const todayIndex = visibleDates.findIndex(d => isSameDay(d, now));

    if (todayIndex === -1) return this; // Today not visible

    const { startHour, endHour } = this.options;
    const hoursPerDay = endHour - startHour;
    const totalHours = hoursPerDay * visibleDates.length;

    // Calculate position: day offset + hour offset within day
    const hourInDay = now.getHours() - startHour;
    const totalHourOffset = (todayIndex * hoursPerDay) + hourInDay;
    const progress = totalHourOffset / totalHours;

    chart.scrollLeft = chart.scrollWidth * Math.max(0, Math.min(1, progress)) - chart.clientWidth / 2;
    return this;
  }

  /** Get current date */
  getDate() {
    return new Date(this.currentDate);
  }

  /** Destroy the calendar */
  destroy() {
    this.root.innerHTML = '';
    this.root.classList.remove('rn-timeline-calendar');
  }

  /** Set callback for event click */
  onEventClick(callback) {
    this.options.onEventClick = callback;
    return this;
  }

  /** Set callback for time slot click */
  onTimeClick(callback) {
    this.options.onTimeClick = callback;
    return this;
  }

  /** Set callback for date change */
  onDateChange(callback) {
    this.options.onDateChange = callback;
    return this;
  }

  /** Set callback for view change */
  onViewChange(callback) {
    this.options.onViewChange = callback;
    return this;
  }

  // ============ INTERNAL ============

  _getViewDays() {
    switch (this.view) {
      case '3days': return 3;
      case 'week': return 7;
      default: return 1;
    }
  }

  _getVisibleDates() {
    const days = this._getViewDays();
    const dates = [];
    for (let i = 0; i < days; i++) {
      dates.push(addDays(this.currentDate, i));
    }
    return dates;
  }

  _normalizeEvents(events) {
    return (events || []).map(e => ({
      id: e.id,
      resourceId: e.resourceId || e.serviceResourceId,
      from: new Date(e.from),
      to: new Date(e.to),
      label: e.label || e.title || e.code || '',
      guestCount: e.guestCount || e.guests || 0,
      status: e.status || null,
      data: e, // Original data
    }));
  }

  _getHours() {
    const { startHour, endHour } = this.options;
    const hours = [];
    const now = new Date();
    for (let h = startHour; h < endHour; h++) {
      hours.push({
        hour: h,
        label: `${h.toString().padStart(2, '0')}:00`,
        isCurrent: isSameDay(now, this.currentDate) && now.getHours() === h,
      });
    }
    return hours;
  }

  _getDayRange() {
    const { startHour, endHour } = this.options;
    const days = this._getViewDays();

    const from = new Date(this.currentDate);
    from.setHours(startHour, 0, 0, 0);

    const to = new Date(this.currentDate);
    to.setDate(to.getDate() + days - 1); // Add days for multi-day view
    to.setHours(endHour, 0, 0, 0);

    return { from, to, rangeMs: to - from };
  }

  _getEventsForResource(resourceId) {
    const { from, to } = this._getDayRange();
    return this.events.filter(e => {
      if (e.resourceId !== resourceId) return false;
      return !(e.to <= from || e.from >= to);
    });
  }

  _render() {
    const { showNavigation, showViewSwitcher, todayLabel, loadingLabel, dateFormat, viewLabels } = this.options;
    const hours = this._getHours();
    const visibleDates = this._getVisibleDates();
    const isMultiDay = visibleDates.length > 1;

    // Format date display
    let dateDisplay;
    if (isMultiDay) {
      const firstDate = visibleDates[0];
      const lastDate = visibleDates[visibleDates.length - 1];
      dateDisplay = `${formatDate(firstDate, dateFormat)} - ${formatDate(lastDate, dateFormat)}`;
    } else {
      dateDisplay = formatDate(this.currentDate, dateFormat);
    }

    // Generate hour cells for each day
    const allHourCells = visibleDates.flatMap((date, dayIndex) =>
      hours.map(h => ({
        ...h,
        dayIndex,
        date,
        isCurrent: isSameDay(date, new Date()) && new Date().getHours() === h.hour,
      }))
    );

    this.root.classList.add('rn-timeline-calendar');
    this.root.innerHTML = `
      <div class="rn-calendar-header">
        <div class="rn-date-display">${dateDisplay}</div>
        <div class="rn-nav-controls">
          ${showViewSwitcher ? `
            <div class="rn-view-switcher">
              <button class="rn-view-btn ${this.view === 'day' ? 'is-active' : ''}" data-view="day">${viewLabels.day}</button>
              <button class="rn-view-btn ${this.view === '3days' ? 'is-active' : ''}" data-view="3days">${viewLabels['3days']}</button>
              <button class="rn-view-btn ${this.view === 'week' ? 'is-active' : ''}" data-view="week">${viewLabels.week}</button>
            </div>
          ` : ''}
          ${showNavigation ? `
            <button class="rn-btn" data-action="today">${todayLabel}</button>
            <button class="rn-btn rn-btn-icon" data-action="prev">&#8249;</button>
            <button class="rn-btn rn-btn-icon" data-action="next">&#8250;</button>
          ` : ''}
        </div>
      </div>
      <div class="rn-calendar-body">
        <div class="rn-loading-overlay" style="display:${this.loading ? 'flex' : 'none'}">${loadingLabel}</div>
        <div class="rn-resource-sidebar">
          ${isMultiDay ? '<div class="rn-resource-row" style="height:40px;"></div>' : ''}
          ${this.resources.map(r => `
            <div class="rn-resource-row" data-resource-id="${r.id || r.Id}">${r.name || r.Name || r.title || '—'}</div>
          `).join('')}
        </div>
        <div class="rn-chart">
          ${isMultiDay ? this._renderMultiDayHeader(visibleDates, hours.length) : ''}
          <div class="rn-hour-labels">
            ${allHourCells.map(h => `
              <div class="rn-hour-cell ${h.isCurrent ? 'is-current' : ''}">${h.label}</div>
            `).join('')}
          </div>
          <div class="rn-timeline" data-days="${visibleDates.length}" data-hours="${hours.length}">
            ${this.resources.map(r => `
              <div class="rn-timeline-row" data-resource-id="${r.id || r.Id}">
                ${allHourCells.map(h => `
                  <div class="rn-timeline-cell ${h.isCurrent ? 'is-current' : ''}" data-day="${h.dayIndex}"></div>
                `).join('')}
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    this._bindEvents();
    this._renderTimeline();
    this.scrollToNow();
  }

  _renderMultiDayHeader(dates, hoursPerDay) {
    const now = new Date();
    const dayNames = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
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

  _renderTimeline() {
    const timeline = this.root.querySelector('.rn-timeline');
    if (!timeline) return;

    // Remove existing events and indicator
    timeline.querySelectorAll('.rn-event, .rn-now-indicator').forEach(el => el.remove());

    const visibleDates = this._getVisibleDates();
    const { startHour, endHour } = this.options;
    const hoursPerDay = endHour - startHour;
    const totalHours = hoursPerDay * visibleDates.length;
    const timelineWidth = timeline.scrollWidth;

    // Render events for each resource
    this.resources.forEach((resource) => {
      const resourceId = resource.id || resource.Id;
      const row = timeline.querySelector(`.rn-timeline-row[data-resource-id="${resourceId}"]`);
      if (!row) return;

      const events = this._getEventsForResource(resourceId);
      events.forEach(event => {
        // Find which day(s) this event falls on
        visibleDates.forEach((date, dayIndex) => {
          const dayStart = new Date(date);
          dayStart.setHours(startHour, 0, 0, 0);
          const dayEnd = new Date(date);
          dayEnd.setHours(endHour, 0, 0, 0);

          // Check if event overlaps with this day's visible hours
          if (event.to <= dayStart || event.from >= dayEnd) return;

          // Clamp event to visible hours of this day
          const eventStart = event.from < dayStart ? dayStart : event.from;
          const eventEnd = event.to > dayEnd ? dayEnd : event.to;

          // Calculate position relative to entire timeline
          const hourOffsetInDay = (eventStart.getHours() - startHour) + (eventStart.getMinutes() / 60);
          const totalHourOffset = (dayIndex * hoursPerDay) + hourOffsetInDay;

          const durationHours = (eventEnd - eventStart) / (1000 * 60 * 60);

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
          eventEl.dataset.eventId = event.id;

          eventEl.innerHTML = `
            <div class="rn-event-time">${formatTime(event.from)}</div>
            <div class="rn-event-label">${event.label}</div>
            ${event.guestCount ? `<div class="rn-event-guests">${event.guestCount} people</div>` : ''}
          `;

          if (this.options.eventClickable) {
            eventEl.addEventListener('click', (e) => {
              e.stopPropagation();
              if (typeof this.options.onEventClick === 'function') {
                this.options.onEventClick(event.data, event);
              }
            });
          }

          row.appendChild(eventEl);
        });
      });
    });

    // Now indicator
    if (this.options.showNowIndicator) {
      const now = new Date();
      const visibleDates = this._getVisibleDates();
      const todayIndex = visibleDates.findIndex(d => isSameDay(d, now));

      if (todayIndex !== -1 && now.getHours() >= this.options.startHour && now.getHours() < this.options.endHour) {
        const hoursPerDay = this.options.endHour - this.options.startHour;
        const totalHours = hoursPerDay * visibleDates.length;

        const hourInDay = now.getHours() - this.options.startHour + (now.getMinutes() / 60);
        const totalHourOffset = (todayIndex * hoursPerDay) + hourInDay;
        const left = (timelineWidth / totalHours) * totalHourOffset;

        const indicator = document.createElement('div');
        indicator.className = 'rn-now-indicator';
        indicator.style.left = `${left}px`;
        timeline.appendChild(indicator);
      }
    }
  }

  _bindEvents() {
    // Navigation buttons
    const todayBtn = this.root.querySelector('[data-action="today"]');
    const prevBtn = this.root.querySelector('[data-action="prev"]');
    const nextBtn = this.root.querySelector('[data-action="next"]');

    if (todayBtn) todayBtn.addEventListener('click', () => this.goToToday());
    if (prevBtn) prevBtn.addEventListener('click', () => this.prevDay());
    if (nextBtn) nextBtn.addEventListener('click', () => this.nextDay());

    // View switcher buttons
    this.root.querySelectorAll('[data-view]').forEach(btn => {
      btn.addEventListener('click', () => {
        const view = btn.dataset.view;
        this.setView(view);
      });
    });

    // Timeline click
    if (this.options.timeClickable) {
      const timeline = this.root.querySelector('.rn-timeline');
      if (timeline) {
        timeline.addEventListener('click', (e) => this._handleTimelineClick(e));
      }
    }
  }

  _handleTimelineClick(e) {
    if (e.target.closest('.rn-event')) return;

    const timeline = e.currentTarget;
    const rect = timeline.getBoundingClientRect();
    const clickX = e.clientX - rect.left + timeline.scrollLeft;
    const clickY = e.clientY - rect.top;

    const visibleDates = this._getVisibleDates();
    const { startHour, endHour } = this.options;
    const hoursPerDay = endHour - startHour;
    const totalHours = hoursPerDay * visibleDates.length;
    const timelineWidth = timeline.scrollWidth;

    // Calculate which day and hour was clicked
    const totalHourOffset = (clickX / timelineWidth) * totalHours;
    const dayIndex = Math.floor(totalHourOffset / hoursPerDay);
    const hourInDay = totalHourOffset % hoursPerDay;

    const clickedDate = visibleDates[dayIndex] || visibleDates[0];
    let clickedTime = new Date(clickedDate);
    clickedTime.setHours(startHour + Math.floor(hourInDay), (hourInDay % 1) * 60, 0, 0);
    clickedTime = roundToMinutes(clickedTime, 5);

    // Calculate clicked resource
    const rowHeight = 60;
    const rowIndex = Math.floor(clickY / rowHeight);
    const resource = this.resources[rowIndex];

    if (resource && typeof this.options.onTimeClick === 'function') {
      this.options.onTimeClick({
        time: clickedTime.toISOString(),
        date: clickedTime,
        resource: resource,
      });
    }
  }

  _emitDateChange() {
    if (typeof this.options.onDateChange === 'function') {
      // Format date locally without UTC conversion
      const year = this.currentDate.getFullYear();
      const month = String(this.currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(this.currentDate.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      this.options.onDateChange(dateStr, this.currentDate);
    }
  }

  _emitViewChange() {
    if (typeof this.options.onViewChange === 'function') {
      this.options.onViewChange(this.view);
    }
  }
}

// ============ FACTORY FUNCTION ============
function createResourceNest(selector, options = {}) {
  return new ResourceNest(selector, options);
}

// ============ EXPORTS ============
export { ResourceNest, createResourceNest };
export default createResourceNest;

