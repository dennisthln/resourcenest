import './styles/resourcenest.scss';
import { DEFAULTS } from './config';
import { Event, NormalizedEvent, Resource, ResourceNestOptions } from './types';
import { addDays, startOfDay, isSameDay, roundToMinutes } from './utils/date';
import { createHeader } from './components/Header';
import { createResourceSidebar } from './components/ResourceSidebar';
import { createTimeline } from './components/Timeline';
import { createEventElement } from './components/Event';

class ResourceNest {
  private readonly root: HTMLElement;
  private options: ResourceNestOptions;
  private currentDate: Date;
  private events: NormalizedEvent[];
  private resources: Resource[];
  private loading: boolean;
  private view: 'day' | '3days' | 'week';
  private _didInitialAutoScroll: boolean;

  constructor(selector: string | HTMLElement, options: ResourceNestOptions = {}) {
    this.root = typeof selector === 'string' ? document.querySelector(selector) as HTMLElement : selector;
    if (!this.root) {
      throw new Error(`ResourceNest: Element "${selector}" not found`);
    }

    this.options = { ...DEFAULTS, ...options };
    this.currentDate = startOfDay(new Date());
    this.events = this._normalizeEvents(this.options.events);
    this.resources = this.options.resources || [];
    this.loading = false;
    this.view = this.options.view || 'day';
    this._didInitialAutoScroll = false;

    this._render();
  }

  // ============ PUBLIC API ============

  public setEvents(events: Event[]): this {
    this.events = this._normalizeEvents(events);
    this._renderEvents();
    return this;
  }

  public setResources(resources: Resource[]): this {
    this.resources = resources || [];
    this._render();
    return this;
  }

  public setDate(date: Date | string): this {
    this.currentDate = startOfDay(new Date(date));
    this._render();
    this._emitDateChange();
    return this;
  }

  public goToToday(): this {
    this.currentDate = startOfDay(new Date());
    this._render();
    this._emitDateChange();
    return this;
  }

  public nextDay(): this {
    const days = this._getViewDays();
    this.currentDate = addDays(this.currentDate, days);
    this._render();
    this._emitDateChange();
    return this;
  }

  public prevDay(): this {
    const days = this._getViewDays();
    this.currentDate = addDays(this.currentDate, -days);
    this._render();
    this._emitDateChange();
    return this;
  }

  public setView(view: 'day' | '3days' | 'week'): this {
    if (['day', '3days', 'week'].includes(view)) {
      this.view = view;
      this._render();
      this._emitViewChange();
    }
    return this;
  }

  public getView(): string {
    return this.view;
  }

  public setLoading(loading: boolean): this {
    this.loading = loading;
    const overlay = this.root.querySelector('.rn-loading-overlay');
    if (overlay) {
      (overlay as HTMLElement).style.display = loading ? 'flex' : 'none';
    }
    return this;
  }

  public refresh(): this {
    this._render();
    return this;
  }
  
  public getDate(): Date {
    return new Date(this.currentDate);
  }

  public destroy(): void {
    this.root.innerHTML = '';
    this.root.classList.remove('rn-timeline-calendar');
  }

  public onEventClick(callback: (event: Event, normalizedEvent: NormalizedEvent) => void): this {
    this.options.onEventClick = callback;
    return this;
  }

  public onTimeClick(callback: (payload: { time: string; date: Date; resource: Resource }) => void): this {
    this.options.onTimeClick = callback;
    return this;
  }

  public onDateChange(callback: (dateStr: string, date: Date) => void): this {
    this.options.onDateChange = callback;
    return this;
  }

  public onViewChange(callback: (view: string) => void): this {
    this.options.onViewChange = callback;
    return this;
  }

  // ============ INTERNAL RENDERING ============
  
  private _render(): void {
    const visibleDates = this._getVisibleDates();
    const isMultiDay = visibleDates.length > 1;

    this.root.innerHTML = '';
    this.root.classList.add('rn-timeline-calendar');
    this.root.classList.toggle('rn-has-sticky-hour-labels', !!this.options.stickyHourLabels);
    
    const headerElement = createHeader(this.currentDate, this.view, this.options, visibleDates);
    this.root.appendChild(headerElement);

    const bodyElement = document.createElement('div');
    bodyElement.className = 'rn-calendar-body';

    const sidebarElement = createResourceSidebar(this.resources, isMultiDay);
    bodyElement.appendChild(sidebarElement);

    const timelineElement = createTimeline(this.resources, visibleDates, this.options);
    bodyElement.appendChild(timelineElement);

    this.root.appendChild(bodyElement);
    
    this._renderEvents();
    this._renderNowIndicator();
    this._bindEvents();
  }

  private _renderEvents(): void {
    const timeline = this.root.querySelector('.rn-timeline');
    if (!timeline) return;

    // Clear existing events
    timeline.querySelectorAll('.rn-event').forEach(el => el.remove());

    const visibleDates = this._getVisibleDates();
    const { startHour, endHour } = this.options;
    const hoursPerDay = endHour - startHour;
    const totalHours = hoursPerDay * visibleDates.length;
    const timelineWidth = (timeline as HTMLElement).scrollWidth;

    this.resources.forEach((resource) => {
      const resourceId = resource.id;
      const row = timeline.querySelector(`.rn-timeline-row[data-resource-id="${resourceId}"]`);
      if (!row) return;

      const events = this._getEventsForResource(resourceId);
      events.forEach(event => {
        visibleDates.forEach((date, dayIndex) => {
          const dayStart = new Date(date);
          dayStart.setHours(startHour, 0, 0, 0);
          const dayEnd = new Date(date);
          dayEnd.setHours(endHour, 0, 0, 0);

          if (event.to <= dayStart || event.from >= dayEnd) return;

          const eventEl = createEventElement(event, timelineWidth, totalHours, dayIndex, hoursPerDay, startHour);
          
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
  }

  private _renderNowIndicator(): void {
      const timeline = this.root.querySelector('.rn-timeline');
      if (!this.options.showNowIndicator || !timeline) return;

      // Clear existing indicator
      timeline.querySelectorAll('.rn-now-indicator').forEach(el => el.remove());

      const now = new Date();
      const visibleDates = this._getVisibleDates();
      const todayIndex = visibleDates.findIndex(d => isSameDay(d, now));

      if (todayIndex !== -1 && now.getHours() >= this.options.startHour && now.getHours() < this.options.endHour) {
        const hoursPerDay = this.options.endHour - this.options.startHour;
        const totalHours = hoursPerDay * visibleDates.length;
        const timelineWidth = (timeline as HTMLElement).scrollWidth;

        const hourInDay = now.getHours() - this.options.startHour + (now.getMinutes() / 60);
        const totalHourOffset = (todayIndex * hoursPerDay) + hourInDay;
        const left = (timelineWidth / totalHours) * totalHourOffset;

        const indicator = document.createElement('div');
        indicator.className = 'rn-now-indicator';
        indicator.style.left = `${left}px`;
        timeline.appendChild(indicator);
      }
  }

  // ============ INTERNAL HELPERS ============

  private _normalizeEvents(events: Event[] = []): NormalizedEvent[] {
    return events.map(e => ({
      ...e,
      from: new Date(e.from),
      to: new Date(e.to),
      label: e.label || '',
      data: e,
    }));
  }

  private _bindEvents(): void {
    // Navigation buttons
    this.root.querySelector('[data-action="today"]')?.addEventListener('click', () => this.goToToday());
    this.root.querySelector('[data-action="prev"]')?.addEventListener('click', () => this.prevDay());
    this.root.querySelector('[data-action="next"]')?.addEventListener('click', () => this.nextDay());

    // View switcher buttons
    this.root.querySelectorAll('[data-view]').forEach(btn => {
      btn.addEventListener('click', () => {
        const view = (btn as HTMLElement).dataset.view as 'day' | '3days' | 'week';
        this.setView(view);
      });
    });
    
    // Timeline click
    if (this.options.timeClickable) {
      this.root.querySelector('.rn-timeline')?.addEventListener('click', (e) => this._handleTimelineClick(e as MouseEvent));
    }
  }

  private _handleTimelineClick(e: MouseEvent): void {
    if ((e.target as HTMLElement).closest('.rn-event')) return;

    const timeline = e.currentTarget as HTMLElement;
    const rect = timeline.getBoundingClientRect();
    const scrollX = timeline.closest('.rn-scroll-x');
    const clickX = e.clientX - rect.left + (scrollX ? scrollX.scrollLeft : 0);
    const clickY = e.clientY - rect.top;

    const visibleDates = this._getVisibleDates();
    const { startHour, endHour } = this.options;
    const hoursPerDay = endHour - startHour;
    const totalHours = hoursPerDay * visibleDates.length;
    const timelineWidth = timeline.scrollWidth;

    const totalHourOffset = (clickX / timelineWidth) * totalHours;
    const dayIndex = Math.floor(totalHourOffset / hoursPerDay);
    const hourInDay = totalHourOffset % hoursPerDay;

    const clickedDate = visibleDates[dayIndex] || visibleDates[0];
    let clickedTime = new Date(clickedDate);
    clickedTime.setHours(startHour + Math.floor(hourInDay), (hourInDay % 1) * 60, 0, 0);
    clickedTime = roundToMinutes(clickedTime, 5);

    const rowHeight = 60; // This should not be hardcoded
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

  private _getViewDays(): number {
    switch (this.view) {
      case '3days': return 3;
      case 'week': return 7;
      default: return 1;
    }
  }

  private _getVisibleDates(): Date[] {
    const days = this._getViewDays();
    const dates = [];
    for (let i = 0; i < days; i++) {
      dates.push(addDays(this.currentDate, i));
    }
    return dates;
  }
  
  private _getDayRange(): { from: Date, to: Date, rangeMs: number } {
    const { startHour, endHour } = this.options;
    const days = this._getViewDays();

    const from = new Date(this.currentDate);
    from.setHours(startHour, 0, 0, 0);

    const to = new Date(this.currentDate);
    to.setDate(to.getDate() + days - 1);
    to.setHours(endHour, 0, 0, 0);

    return { from, to, rangeMs: to.getTime() - from.getTime() };
  }
  
  private _getEventsForResource(resourceId: string | number): NormalizedEvent[] {
    const { from, to } = this._getDayRange();
    return this.events.filter(e => {
      if (e.resourceId !== resourceId) return false;
      return !(e.to <= from || e.from >= to);
    });
  }

  private _emitDateChange(): void {
    if (typeof this.options.onDateChange === 'function') {
      const year = this.currentDate.getFullYear();
      const month = String(this.currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(this.currentDate.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      this.options.onDateChange(dateStr, this.currentDate);
    }
  }

  private _emitViewChange(): void {
    if (typeof this.options.onViewChange === 'function') {
      this.options.onViewChange(this.view);
    }
  }
}

export function createResourceNest(selector: string | HTMLElement, options: ResourceNestOptions = {}): ResourceNest {
  return new ResourceNest(selector, options);
}

export { ResourceNest };
export default createResourceNest;
