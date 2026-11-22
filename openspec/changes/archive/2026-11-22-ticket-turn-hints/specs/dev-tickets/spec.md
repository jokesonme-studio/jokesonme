## ADDED Requirements

### Requirement: Merged PR hint

When a ticket is `in_progress` and a pull request in `jokesonme-studio/jokesonme` whose title contains `(T-<n>)` has been merged, the ticket's next-step text on the ticket page and in the Claude ticket API SHALL say that PR `#<pr>` is merged and that the owner presses 交付 after Jesse deploys. When several such pull requests are merged, the most recently merged one SHALL be named. The merge state SHALL be read from GitHub's public API without credentials and cached for at most 5 minutes; when it cannot be read, the page SHALL render with the ordinary next-step text and no error. The platform SHALL NOT change a ticket's status on its own.

#### Scenario: PR merged but not delivered

- **WHEN** T-20 is `in_progress`, owned by 柏文, and PR #18 titled `fix(T-20): 平台新增工具箱頁` is merged
- **THEN** the T-20 page's next step reads that PR #18 is merged and that 柏文 presses 交付 after Jesse deploys

#### Scenario: GitHub unreachable

- **WHEN** the GitHub request fails or times out
- **THEN** the ticket page still opens and shows the ordinary next step

### Requirement: My turn list

The home page SHALL show a 「輪到你的開發票」 section listing the tickets where it is the viewer's turn: tickets the viewer owns that are `in_progress`, and tickets in `review` that the viewer is the one to review — the reporter when someone else did the work, or an admin when the reporter did the work themself. A `review` ticket that another person is to review SHALL NOT be listed for an admin. Each row SHALL show `T-<n>`, the title, and whether it awaits review, is in development, or has a merged PR awaiting 交付, and SHALL link to `/tickets?t=<n>`. When no ticket is the viewer's turn the section SHALL NOT be rendered.

##### Example: whose turn

| Ticket | Viewer | Listed |
| ------ | ------ | ------ |
| in_progress, owner 柏文 | 柏文 | yes (development) |
| in_progress, owner 柏文 | Jesse (admin) | no |
| review, reporter 巧達, owner 柏文 | 巧達 | yes (review) |
| review, reporter 巧達, owner 柏文 | Jesse (admin) | no |
| review, reporter 柏文, owner 柏文 | Jesse (admin) | yes (review) |
| review, reporter 柏文, owner 柏文 | 柏文 | no |

#### Scenario: Nothing to do

- **WHEN** a member with no owned in-progress ticket and nothing to review opens the home page
- **THEN** no 「輪到你的開發票」 section appears

### Requirement: Every migration records itself

Every file in `platform/supabase/migrations/` SHALL insert its own name into `_migrations`, and `npm run test:db` SHALL fail, naming the file, when a migration applied to the fresh test database is missing from `_migrations`. A migration that changes rows of an audited table SHALL set the actor to `migration` itself so that re-running it under `db:migrate` succeeds.

#### Scenario: Migration forgets to record itself

- **WHEN** `0014_show_series.sql` does not insert into `_migrations` and `npm run test:db` runs
- **THEN** the run fails and names `0014_show_series`
