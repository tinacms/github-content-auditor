# Tina Content Audit Action
This repository provides a reusable GitHub Action workflow and helper scripts to audit content in a TinaCMS-powered repo. It queries your Tina content, runs AI feedback on selected files, opens issues with suggestions, and creates a PR to update the `lastChecked` timestamp.

## What’s Included
- Workflow: `audit-content.yml`
- Helper scripts (PNPM + TSX):
- `aggregate-links.ts`
- `map-links-to-content.ts`
- `update-checked.ts`
- Script package config: `package.json`
## What It Does
- Aggregates content paths via Tina GraphQL
- Maps file paths to file contents
- Sends content to an AI model for feedback
- Creates GitHub issues per file with feedback
- Updates `lastChecked` frontmatter and opens a PR
## Requirements
A TinaCMS project with content files in your repo
GitHub repository with Actions enabled
Secrets and variables set:
- Secrets:
    - `TINA_CLIENT_ID`
    - `TINA_TOKEN`
- Variables:
    - `TINA_AUDITOR_QUERY` (GraphQL query string for Tina content)
    - `TINA_AUDITOR_EXPIRY_DAYS` (integer)
    - `TINA_AUDITOR_CONTENT_WINDOW` (integer: number of items to audit per run)
    - `TINA_AUDITOR_SYSTEM_PROMPT` (system prompt for AI model)

## How to Use
1. Copy the workflow file into your repo:
    - `audit-content.yml`
2. Copy the helper scripts directory:
    - `tina-helpers`

3. Commit and push.

4. In your repo Settings:

    - Add Secrets: `TINA_CLIENT_ID`, `TINA_TOKEN`
    - Add Variables: `TINA_AUDITOR_QUERY`, `TINA_AUDITOR_EXPIRY_DAYS`, `TINA_AUDITOR_CONTENT_WINDOW`, `TINA_AUDITOR_SYSTEM_PROMPT`

5. Trigger the workflow:

    - Go to Actions → “Audit Content with AI” → Run workflow.

## How It Works
- Step “Aggregate Content Paths from TinaCMS”:
    - Runs the script `src/aggregate-links.ts` which reads `TINA_AUDITOR_CONTENT_WINDOW` and calls `utils/aggregate-links` to select paths.
- Step “Map links to content”:

    - Runs `src/map-links-to-content.ts` to read file contents from paths.
- AI feedback:

    - Calls the model and logs issues per file.
- Update timestamps:
    - Runs src/update-checked.ts which uses `utils/add-checked` to write lastChecked and opens a PR.

## Local Development
- The helper scripts are managed with PNPM and TSX as defined in package.json.
- Install dependencies:
    - From repo root:
        - `pnpm --dir=.github/scripts/tina-helpers install`
- Run scripts:
- `pnpm --dir=.github/scripts/tina-helpers run aggregate-links`
- `pnpm --dir=.github/scripts/tina-helpers run map-links-to-content '["/content/posts/…"]'`
- `pnpm --dir=.github/scripts/tina-helpers run update-checked '["/content/posts/…"]'`
## Notes
- Issues are labeled “🤖 Content Audit”.
- The PR branch is named `content-audit/flow/<run_id>`.
- The workflow is configured to run on `workflow_dispatch` (manual trigger). You can add a schedule if needed.