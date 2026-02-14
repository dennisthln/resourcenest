export interface Resource {
  id: string | number;
  name: string;
  // Allows for additional custom properties
  [key: string]: any;
}

export interface Event {
  id: string | number;
  resourceId: string | number;
  from: Date;
  to: Date;
  label: string;
  // Allows for additional custom properties
  [key: string]: any;
}

export interface NormalizedEvent extends Event {
  data: Event; // Keep original event data
}

export interface ResourceNestOptions {
  startHour?: number;
  endHour?: number;
  events?: Event[];
  resources?: Resource[];
  locale?: string;
  dateFormat?: string;
  todayLabel?: string;
  loadingLabel?: string;
  showNavigation?: boolean;
  showNowIndicator?: boolean;
  showViewSwitcher?: boolean;
  autoScrollToCurrentOnInit?: boolean;
  autoScrollToCurrentAlign?: 'start' | 'center';
  stickyHourLabels?: boolean;
  eventClickable?: boolean;
  timeClickable?: boolean;
  view?: 'day' | '3days' | 'week';
  viewLabels?: {
    day?: string;
    '3days'?: string;
    week?: string;
  };
  onEventClick?: (event: Event, normalizedEvent: NormalizedEvent) => void;
  onTimeClick?: (payload: { time: string; date: Date; resource: Resource }) => void;
  onDateChange?: (dateStr: string, date: Date) => void;
  onViewChange?: (view: string) => void;
}
