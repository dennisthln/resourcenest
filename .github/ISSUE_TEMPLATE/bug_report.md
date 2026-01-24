name: Bug Report
description: Report a bug or issue
title: "[BUG] "
labels: ["bug"]

body:
  - type: textarea
    id: description
    attributes:
      label: Describe the Bug
      description: A clear and concise description of what the bug is.
      placeholder: "When I click on the calendar..."
    validations:
      required: true

  - type: textarea
    id: reproduction
    attributes:
      label: Steps to Reproduce
      description: Steps to reproduce the behavior.
      placeholder: |
        1. Create a calendar with...
        2. Click on...
        3. See error...
    validations:
      required: true

  - type: textarea
    id: expected
    attributes:
      label: Expected Behavior
      description: What you expected to happen.
      placeholder: "The calendar should..."
    validations:
      required: true

  - type: textarea
    id: actual
    attributes:
      label: Actual Behavior
      description: What actually happened.
      placeholder: "Instead, the calendar..."
    validations:
      required: true

  - type: textarea
    id: environment
    attributes:
      label: Environment
      description: Your environment details
      placeholder: |
        - Browser: Chrome 120.0.0
        - OS: macOS 14.1
        - Package version: 1.0.0
        - Framework: Vue 3 / React / Vanilla JS
    validations:
      required: true

  - type: textarea
    id: code
    attributes:
      label: Code Example
      description: "Minimal code example that reproduces the issue"
      render: javascript
      placeholder: "const calendar = createTimelineCalendar(...);"
    validations:
      required: false

  - type: textarea
    id: additional
    attributes:
      label: Additional Context
      description: Any additional information that might be helpful.
    validations:
      required: false

