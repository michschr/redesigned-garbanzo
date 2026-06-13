# CLAUDE.md

## Repo: redesigned-garbanzo
Status: New project, structure TBD

## Token & Context Discipline

- Default to concise output. No preamble, no summaries unless asked.
- Do not read files speculatively. Only read what the current task requires.
- Do not load entire files when a targeted function, section, or line range is sufficient.
- Before running broad operations (grep across repo, recursive reads), confirm scope.
- Prefer targeted bash commands over multi-file reads to answer structural questions.

## Session Hygiene

- If a task is complete and a new topic starts, recommend `/clear` rather than continuing.
- Do not carry forward context from prior tasks unless explicitly referenced.
- Flag when conversation history is likely degrading quality or causing confusion.

## Output Defaults

- Code: no explanatory prose unless asked. Comments in code only where non-obvious.
- Edits: show diffs or changed blocks only, not full file reprints.
- Plans: bullet list, not paragraphs. Confirm before executing multi-step sequences.

## Task Execution

- Clarify ambiguous scope with one question before starting, not after.
- For destructive or wide-impact operations, state what you're about to do and wait.
- Do not retry failed approaches more than twice without flagging and asking for direction.

## This File

- Keep CLAUDE.md under 150 lines. Trim before adding.
- No duplicate rules. No aspirational content — only behavioral constraints.

## Commits

Use conventional format:
- `feat:` / `fix:` / `docs:` / `refactor:` / `test:` / `chore:`

## Branches

- Features: `feature/<name>`
- Fixes: `fix/<name>`
- Claude: `claude/<name>`
