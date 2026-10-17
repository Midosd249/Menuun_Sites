# CI policy: blocking and advisory browser tests

## Blocking
The public booking matrix (three templates, Arabic/English, seven viewport widths), owner overflow matrix, and salon-selection/Realtime exactly-one-chime regressions block pull requests. They protect customer booking, tenant targeting, and small-screen usability.

## Advisory
Other owner smoke flows (locale labels, business-name/social-link editing, template switching, and sound-toggle UI) run on every Browser QA workflow and upload traces/screenshots and failure summaries, but do not block merge while reliability is established.

## Promotion
Promote an advisory test after 10 consecutive green CI runs. Record the ten run IDs, move the test into the blocking command, and remove it from the advisory command. Never make a product/security regression advisory to obtain a green build.
