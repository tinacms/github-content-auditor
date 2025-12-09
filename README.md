# Tina Content Audit Action
This repository provides a reusable GitHub Action workflow and helper scripts to audit content in a TinaCMS-powered repo. It queries your Tina content, runs AI feedback on selected files, opens issues with suggestions, and creates a PR to update the `lastChecked` timestamp.

## What’s Included
- Workflow: `audit-content.yml`
    - Helper scripts (PNPM + TSX):
    - `aggregate-links.ts`
    - `map-links-to-content.ts`
    - `update-checked.ts`
- A Tina starter project with the GitHub action preconfigured
- A Python MCP tool for generating test blog posts: `scripts/blog_server/main.py`

## How to Install

1. Copy the workflow file into your repo:
    - `audit-content.yml`
2. Copy the helper scripts into your repo under `.github/scripts/`:
    - `tina-helpers`

3. Commit and push.

4. In your repo Settings:

    - Add Secrets: `TINA_CLIENT_ID`, `TINA_TOKEN`
    - Add Variables: `TINA_AUDITOR_QUERY`, `TINA_AUDITOR_EXPIRY_DAYS`, `TINA_AUDITOR_CONTENT_WINDOW`, `TINA_AUDITOR_SYSTEM_PROMPT`


## How to Use
    - Go to Actions → “Audit Content with AI” → Run workflow.
    - Merge any PRs that update `lastChecked` after reviewing issues.
        - the lastChecked timestamp must be updated to avoid re-auditing the same content.
    - Assign any issues generated to GitHub copilot, or do them manually.



## What It Does
- Aggregates content paths via Tina GraphQL
- Maps file paths to file contents
- Sends content to an AI model for feedback
- Creates GitHub issues per file with feedback
- Updates `lastChecked` frontmatter and opens a PR

## Requirements
- A TinaCMS project with content files in your repo
- GitHub repository with Actions enabled
- GitHub models enabled for your repo/organization
- Secrets and variables set:
- Secrets:
    - `TINA_CLIENT_ID`
    - `TINA_TOKEN`
- Variables:
    - `TINA_AUDITOR_QUERY` (GraphQL query string for Tina content)
    - `TINA_AUDITOR_EXPIRY_DAYS` (integer)
    - `TINA_AUDITOR_CONTENT_WINDOW` (integer: number of items to audit per run)
    - `TINA_AUDITOR_SYSTEM_PROMPT` (system prompt for AI model)



## How It Works

- Triggers manually via workflow_dispatch.

- Job: query-tina-content
  - Checks out the repo and sets up PNPM.
  - Writes Tina credentials and config into `.github/scripts/tina-helpers/.env`.
  - Runs helper scripts:
    - aggregate-links.ts reads TINA_AUDITOR_CONTENT_WINDOW and queries Tina to select a window of content paths.
    - map-links-to-content.ts reads each selected file and returns `{ path, content }`.
  - Exposes two outputs:
    - items: array of `{ path, content }` for the matrix.
    - links: array of file paths for later updates.

- Job: generate-feedback
  - Creates a matrix over `items` to process multiple files in parallel.
  - Logs a preview of each file’s content.
  - Sends content to the AI model with your `TINA_AUDITOR_SYSTEM_PROMPT`.
  - Creates a GitHub Issue per file with the AI feedback and labels it “🤖 Content Audit”.

- Job: update-checked
  - Re-checks out the repo and installs helper script deps.
  - Runs update-checked.ts with the `links` array to update `lastChecked` in frontmatter.
  - Formats the updated paths for display.
  - Opens a PR that updates `lastChecked` for the audited files, linking back to the workflow run.

## Scripts
- A set of PNPM scripts to run in both GitHub and locally for content auditing.
- Location: `.github/scripts/tina-helpers`
- Run scripts:
- Local Scripts
    - `pnpm run migrate-content` - Adds a lastChecked property to all content files returned by the query in the `.env `file.
- Scripts for GitHub Action
    - `pnpm run aggregate-links` - Gets a set of content paths for a collection based on the query, expiry interval, and other settigns from the `.env` file.
    - `pnpm run map-links-to-content <paths>` - Takes a set of content paths and returns an array with their file contents.
    - `pnpm run update-checked <paths>` - Updates the `lastChecked` frontmatter for the given paths.

## Notes
- Issues are labeled “🤖 Content Audit”.
- The PR branch is named `content-audit/flow/<run_id>`.
- The workflow is configured to run on `workflow_dispatch` (manual trigger).

