# ResourceNest

**ResourceNest** is a lightweight, framework-agnostic resource calendar UI. It provides a professional timeline interface for displaying and managing bookings, schedules, and appointments.

[📖 Demo](https://dennisthln.github.io/resourcenest) | [📦 npm](https://www.npmjs.com/package/resourcenest) | [🐙 GitHub](https://github.com/dennisthln/resourcenest)

---

## Features

- 📅 **Timeline Views** – Day, 3-Day, and Week views.
- 👥 **Resource Management** – Display multiple resources (rooms, staff, equipment) as rows.
- 🏢 **Event Visualization** – Render bookings with custom labels and statuses.
- 📍 **Interactivity** – Built-in callbacks for clicks on events and time slots.
- 🎨 **Modern UI** – Clean, responsive design with a "Current Time" indicator.
- 🚀 **Zero Dependencies** – Fast, lightweight vanilla JavaScript.
- 🔌 **Framework Ready** – Works with React, Vue, Angular, or plain HTML.

---

## Installation

```bash
yarn add resourcenest
# or
npm install resourcenest
```

---

## Quick Start

```html
<div id="calendar"></div>

<script type="module">
  import createResourceNest from 'resourcenest';

  const calendar = createResourceNest('#calendar', {
    resources: [
      { id: 'r1', name: 'Conference Room A' },
      { id: 'r2', name: 'Conference Room B' }
    ],
    events: [
      {
        id: 'e1',
        resourceId: 'r1',
        from: '2024-01-24T10:00:00',
        to: '2024-01-24T12:00:00',
        label: 'Team Sync'
      }
    ],
    onTimeClick: ({ time, resource }) => {
      console.log(`Booking for ${resource.name} at ${time}`);
    }
  });
</script>
```

---

## API Reference

### Options

| Option | Default | Description |
| :--- | :--- | :--- |
| `view` | `'day'` | Initial view: `'day'`, `'3days'`, or `'week'`. |
| `startHour` | `8` | Start of the timeline (0-23). |
| `endHour` | `22` | End of the timeline (0-23). |
| `events` | `[]` | Array of event objects. |
| `resources` | `[]` | Array of resource objects (rows). |
| `onEventClick` | `null` | Callback: `(event) => { ... }` |
| `onTimeClick` | `null` | Callback: `({ time, resource }) => { ... }` |
| `onDateChange` | `null` | Callback: `(dateString) => { ... }` |

### Instance Methods

- `calendar.setEvents(events)` – Update all events.
- `calendar.setResources(resources)` – Update resources.
- `calendar.setDate(date)` – Navigate to a specific date.
- `calendar.setView(view)` – Switch between `'day'`, `'3days'`, or `'week'`.
- `calendar.nextDay()` / `calendar.prevDay()` – Navigation.
- `calendar.destroy()` – Cleanup.

---

## Styling

ResourceNest uses SCSS for internal styling, but the styles are bundled directly into the JavaScript file. You can easily customize the appearance using CSS variables. You can override them in your global CSS:

```css
:root {
  --rn-primary-color: #4f46e5;   /* Main color for events */
  --rn-success-color: #059669;   /* Color for 'confirmed' status */
  --rn-error-color: #dc2626;     /* Color for 'cancelled' status & now indicator */
  --rn-bg-highlight: #f5f3ff;    /* Highlight color for current day/time */
  --rn-radius: 12px;             /* Corner radius for the calendar */
  --rn-font-family: 'Inter', sans-serif;
}
```

### CSS Variables Reference

| Variable | Default | Description |
| :--- | :--- | :--- |
| `--rn-primary-color` | `#3b82f6` | Default event background. |
| `--rn-success-color` | `#10b981` | Background for `.status-confirmed`. |
| `--rn-error-color` | `#ef4444` | Background for `.status-cancelled` and now indicator. |
| `--rn-bg-main` | `#ffffff` | Main background color. |
| `--rn-bg-muted` | `#f9fafb` | Sidebar and hover backgrounds. |
| `--rn-border-color` | `#e5e7eb` | Grid and container borders. |
| `--rn-radius` | `8px` | Outer border radius. |

You can also override specific classes for more advanced styling:

```css
/* Custom event padding */
.rn-event { padding: 8px 12px; }

/* Timeline cell height */
.rn-timeline-row, .rn-resource-row { height: 80px; }
```

---

## License

MIT

