# Current Task State

## Completed
- Day-wise navigation refactor for Kannada Comfort Sprint.

## Acceptance Criteria
- Primary navigation becomes a day-wise Sprint Map for Day 1-10.
- User can open any day independent of saved current day progress.
- Each day shows intent, goals, day-level instruction, and concrete milestones for commute, running/walking, gym, review, mission, and optional business practice.
- Existing modules are scoped by the selected day where relevant.
- Content validation and tests fail if day instructions or milestones are missing.

## Task Checklist
- [x] Add failing tests for day metadata and selected-day lookup.
- [x] Extend curriculum types, generated content, and helper selectors.
- [x] Refactor UI into Sprint Map and Day Command Center.
- [x] Run lint, tests, content check, build, commit, and redeploy.
