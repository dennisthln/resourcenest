# ResourceNest

[![npm version](https://img.shields.io/npm/v/%40dennisthln%2Fresourcenest)](https://www.npmjs.com/package/resourcenest)
[![npm downloads](https://img.shields.io/npm/dm/%40dennisthln%2Fresourcenest)](https://www.npmjs.com/package/resourcenest)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub Repo](https://img.shields.io/badge/GitHub-dennisthln%2Fresourcenest-blue)](https://github.com/dennisthln/resourcenest)

**Resource Calendar UI** - Professional timeline interface for displaying and managing room bookings, staff schedules, equipment allocation & appointments. Beautiful, responsive, framework-agnostic calendar for your resource planning system.

Works with **any framework**: Vue, React, Angular, Svelte, or plain HTML.

**[📖 Demo & Documentation](https://dennisthln.github.io/resourcenest)** | **[📦 npm Package](https://www.npmjs.com/package/resourcenest)** | **[🐙 GitHub](https://github.com/dennisthln/resourcenest)**

---

## 📌 About ResourceNest

**ResourceNest is the visual layer** for your resource management system. It's a beautiful, professional calendar UI that displays scheduling data and provides an interface for interactions.

### ✅ What ResourceNest Does
- 📅 Displays resources and bookings in an intuitive timeline format
- 🎯 Provides visual feedback for time slots and events
- 📍 Captures user interactions (clicks on slots, events, navigation)
- 🎨 Handles responsive design and styling
- 🔌 Works seamlessly with your backend scheduling logic

### ❌ What ResourceNest Does NOT Do
- 🤖 It doesn't schedule or plan resources (your backend does that)
- 🚫 It doesn't detect conflicts automatically (your system validates that)
- 💡 It doesn't optimize allocations (that's your algorithm)
- 🔄 It doesn't manage complex scheduling rules

**Think of it as:** The beautiful dashboard/UI that displays *your* scheduling system's results.

---

## Features

- 📅 **Professional Timeline Views** - Day, 3-day, and week views for resource scheduling
- 👥 **Multi-Resource Display** - Show rooms, staff, equipment as timeline rows  
- 🏢 **Event Visualization** - Display bookings, appointments, and assignments with custom styling
- 📍 **Interactive Slots** - Click on timeline to trigger custom actions (create booking, etc.)
- ⏰ **Current Time Indicator** - Visual red line showing current time for context
- 🎨 **Built-in Professional Styling** - Beautiful calendar out of the box, fully customizable CSS
- 📱 **Responsive & Touch-Ready** - Perfect on desktop, tablet, and mobile devices
- 🚀 **Zero Dependencies** - Lightweight, fast vanilla JavaScript
- 🌐 **Framework-Agnostic** - Works with Vue, React, Angular, Svelte, or plain HTML
- ⚙️ **Easy Integration** - Simple API to connect with your backend scheduling logic
- 💼 **Perfect For** - Meeting room displays, team schedules, appointment calendars, resource management dashboards

## Installation

```bash
yarn add resourcenest
# or
npm install resourcenest
# or
bun add resourcenest
```

## Quick Start

### Plain HTML / Vanilla JS

```html
<!DOCTYPE html>
<html>
<head>
  <title>Timeline Calendar</title>
</head>
<body>
  <div id="calendar"></div>

  <script type="module">
    import createResourceNest from 'resourcenest';
    
    const calendar = createResourceNest('#calendar', {
      resources: [
        { id: 'room-1', name: 'Conference Room A' },
        { id: 'room-2', name: 'Conference Room B' },
      ],
      events: [
        {
          id: '1',
          resourceId: 'room-1',
          from: '2024-01-15T10:00:00',
          to: '2024-01-15T11:30:00',
          label: 'Team Meeting',
          guestCount: 5,
          status: 'Confirmed'
        }
      ],
      onEventClick: (event) => {
        console.log('Event clicked:', event);
      },
      onTimeClick: ({ time, resource }) => {
        console.log('Book time slot at:', time, 'for resource:', resource);
      },
      onDateChange: (dateStr) => {
        console.log('Date changed to:', dateStr);
      }
    });
  </script>
</body>
</html>
```

### Vue 3

Create a wrapper component:

```vue
<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import createTimelineCalendar from '@kleverweb/timeline-calendar/src';

const props = defineProps({
  events: { type: Array, default: () => [] },
  resources: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
});

const emit = defineEmits(['event-click', 'time-click', 'date-change']);

const containerRef = ref(null);
let calendar = null;

onMounted(() => {
  calendar = createTimelineCalendar(containerRef.value, {
    events: props.events,
    resources: props.resources,
    onEventClick: (event) => emit('event-click', event),
    onTimeClick: (data) => emit('time-click', data),
    onDateChange: (date) => emit('date-change', date),
  });
});

onUnmounted(() => calendar?.destroy());

watch(() => props.events, (v) => calendar?.setEvents(v), { deep: true });
watch(() => props.resources, (v) => calendar?.setResources(v), { deep: true });
watch(() => props.loading, (v) => calendar?.setLoading(v));
</script>

<template>
  <div ref="containerRef"></div>
</template>
```

### React

```jsx
import { useEffect, useRef } from 'react';
import createTimelineCalendar from '@kleverweb/timeline-calendar';

function TimelineCalendar({ events, resources, onEventClick, onTimeClick, onDateChange }) {
  const containerRef = useRef(null);
  const calendarRef = useRef(null);

  useEffect(() => {
    calendarRef.current = createTimelineCalendar(containerRef.current, {
      events,
      resources,
      onEventClick,
      onTimeClick,
      onDateChange,
    });

    return () => calendarRef.current?.destroy();
  }, []);

  useEffect(() => {
    calendarRef.current?.setEvents(events);
  }, [events]);

  useEffect(() => {
    calendarRef.current?.setResources(resources);
  }, [resources]);

  return <div ref={containerRef} />;
}
```

## API

### `createTimelineCalendar(selector, options)`

Creates a new calendar instance.

**Parameters:**
- `selector` - CSS selector string or DOM element
- `options` - Configuration object (see below)

**Returns:** Calendar instance with methods

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `events` | `Array` | `[]` | Array of event objects |
| `resources` | `Array` | `[]` | Array of resource objects (rows) |
| `startHour` | `Number` | `8` | First hour to display (0-23) |
| `endHour` | `Number` | `22` | Last hour to display (0-23) |
| `dateFormat` | `String` | `'DD.MM.YYYY'` | Date format for header |
| `todayLabel` | `String` | `'Heute'` | Label for today button |
| `loadingLabel` | `String` | `'Laden...'` | Loading overlay text |
| `showNavigation` | `Boolean` | `true` | Show navigation buttons |
| `showNowIndicator` | `Boolean` | `true` | Show current time line |
| `eventClickable` | `Boolean` | `true` | Enable event click |
| `timeClickable` | `Boolean` | `true` | Enable time slot click |
| `onEventClick` | `Function` | `null` | Callback when event is clicked |
| `onTimeClick` | `Function` | `null` | Callback when time slot is clicked |
| `onDateChange` | `Function` | `null` | Callback when date changes |

### Event Object

```js
{
  id: 'unique-id',
  resourceId: 'resource-id',  // or serviceResourceId
  from: '2024-01-15T10:00:00', // ISO string or Date
  to: '2024-01-15T11:30:00',
  label: 'Event Title',
  guestCount: 5,              // optional
  status: 'Confirmed'         // 'Confirmed', 'Cancelled', or custom
}
```

### Resource Object

```js
{
  id: 'resource-id',
  name: 'Resource Name'
}
```

### Instance Methods

```js
const calendar = createTimelineCalendar('#calendar', options);

// Navigation
calendar.goToToday();
calendar.nextDay();
calendar.prevDay();
calendar.setDate('2024-06-15');
calendar.getDate(); // Returns current Date

// Data
calendar.setEvents([...]);
calendar.setResources([...]);

// UI
calendar.setLoading(true);
calendar.scrollToNow();
calendar.refresh();

// Callbacks (chainable)
calendar.onEventClick(callback);
calendar.onTimeClick(callback);
calendar.onDateChange(callback);

// Cleanup
calendar.destroy();
```

### Callback Signatures

```js
onEventClick(originalEvent, normalizedEvent)
// originalEvent: Your original event data
// normalizedEvent: { id, resourceId, from, to, label, guestCount, status, data }

onTimeClick({ time, date, resource })
// time: ISO string of clicked time
// date: Date object
// resource: The resource object for the clicked row

onDateChange(dateString, date)
// dateString: 'YYYY-MM-DD' format
// date: Date object
```

## Styling

The calendar includes built-in styles. To customize, override CSS classes:

```css
/* Primary color for events */
.kw-event {
  background: #your-color;
}

/* Confirmed events */
.kw-event.status-confirmed {
  background: #10b981;
}

/* Cancelled events */
.kw-event.status-cancelled {
  background: #ef4444;
}

/* Current time indicator */
.kw-now-indicator {
  background: #ef4444;
}

/* Current hour highlight */
.kw-hour-cell.is-current,
.kw-timeline-cell.is-current {
  background: #dbeafe;
}
```

## Browser Support

Works in all modern browsers (Chrome, Firefox, Safari, Edge).

## License

MIT

