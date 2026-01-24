name: Feature Request
description: Suggest a new feature
title: "[FEATURE] "
labels: ["enhancement"]

body:
  - type: textarea
    id: description
    attributes:
      label: Feature Description
      description: A clear and concise description of the feature you want to add.
      placeholder: "I'd like the calendar to..."
    validations:
      required: true

  - type: textarea
    id: use_case
    attributes:
      label: Use Case
      description: Describe the use case for this feature.
      placeholder: "This would help with..."
    validations:
      required: true

  - type: textarea
    id: alternatives
    attributes:
      label: Alternatives Considered
      description: Are there any alternative solutions or workarounds?
      placeholder: "Instead, I could..."
    validations:
      required: false

  - type: textarea
    id: additional
    attributes:
      label: Additional Context
      description: Any additional information or mockups.
    validations:
      required: false

