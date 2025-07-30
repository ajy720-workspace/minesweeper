## Gemini Added Memories

- The user prefers using '-' instead of '\*' for unordered markdown lists.
- When asked to save something to Notion, save it to the 'Knowledge DB' database with ID 226a0048-876b-804e-a021-c1aefee8668f.
- When saving to Notion, record the user's original questions in the '질문' (Question) field of the 'Knowledge DB'.

## Git

- commit when we complete a unit of task.
- before staging, do lint check & format(yarn lint --fix & yarn format)
- When write commit messages, Write in English.
  - If commit messages include backtick(`), use COMMIT_EDITMSG file to commit.
  - refer before 3 commits for maintain commit message style.

## Package manager

- Use Yarn for node.js package manager.

## Shadcn/ui

- use 'npx shadcn@latest ...' instead of 'npx shadcn-ui@latest ...'. It's deprecated.

## Supabase

- use 'npx supabase ...' to execute supabase cli
- before execute any query, summarize query content to me.
- Don't use prefix 'supabase**' (e.g. use 'apply_migration' instead of 'supabase**apply_migration')
- use `.overrideTypes<T>()` to define type when fetching mutiple datas from supabase. If fetch a single data, use generic like `.single<T>()`
- when we get supabase client with `createClient()` at server side, use `await createClient()`. It's a asynchronous function.
