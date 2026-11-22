## MODIFIED Requirements

### Requirement: Ticket record

The system SHALL store each dev ticket with a sequential number displayed as `J-<number>`, a title of 1 to 120 characters, a category, a description, a status, the reporter, and an optional owner. Category SHALL be one of `feature` (新功能), `bug` (修 Bug), `process` (改善流程), `data` (修正資料). Status SHALL be one of `open` (待處理), `in_progress` (處理中), `review` (待驗收), `done` (已完成), `wontfix` (不做). Ticket numbers SHALL NOT be reused and tickets SHALL NOT be hard-deleted. The label prefix SHALL be `J-` everywhere the platform shows or writes a ticket number (pages, messages, the kickoff prompt, branch and PR naming in `COLLABORATION.md`), and SHALL NOT be `T-`, which is the prefix of the company Jebby Dashboard's bounty tickets.

#### Scenario: New ticket gets the next number

- **WHEN** a member files a ticket while the highest existing number is 7
- **THEN** the new ticket is stored with number 8, status `open`, no owner, and the member as reporter, and the page shows it as `J-8`

#### Scenario: Title too long is rejected

- **WHEN** a member submits a ticket whose title has 121 characters
- **THEN** the ticket is not created and the form shows that the title must be at most 120 characters

#### Scenario: Existing tickets keep their number

- **WHEN** the ticket formerly shown as `T-20` is opened after the prefix change
- **THEN** it is shown as `J-20` with the same number, history, and URL `/tickets?t=20`

### Requirement: Ticket status transitions

The system SHALL allow only the following actions, each moving a ticket between the listed statuses and only for the listed people. Any other combination SHALL be refused with a Chinese reason and SHALL NOT change the ticket.

##### Example: action table

| Action | From | To | Allowed actor | Extra rule |
| ------ | ---- | -- | ------------- | ---------- |
| claim | open | in_progress | admin or member | ticket has no owner; owner becomes the actor |
| unclaim | in_progress | open | owner, reporter, or admin | owner is cleared |
| deliver | in_progress | review | owner or admin | |
| accept | review | done | admin, or reporter who is not the owner | |
| reject | review | in_progress | admin, or reporter who is not the owner | reason required |
| wontfix | open, in_progress, review | wontfix | reporter or admin | reason required; owner kept |
| reopen | wontfix | open | admin | owner is cleared |
| edit | open with no owner | open | reporter or admin | only title, category, description change |

#### Scenario: Owner cannot accept own work

- **WHEN** member 柏文 owns J-3 in `review` but is not its reporter, and 柏文 tries to accept J-3
- **THEN** the system refuses with a reason saying the owner cannot accept their own ticket and J-3 stays in `review`

#### Scenario: Reporter accepts delivered work

- **WHEN** member 巧達 reported J-3, member 柏文 owns it, J-3 is in `review`, and 巧達 accepts it
- **THEN** J-3 becomes `done` and the history records 巧達 accepting it

#### Scenario: Admin accepts a ticket the admin filed and built

- **WHEN** admin Jesse is both reporter and owner of J-5 in `review` and accepts it
- **THEN** J-5 becomes `done`

#### Scenario: Reject without a reason

- **WHEN** a reporter rejects a ticket in `review` with an empty reason
- **THEN** the ticket stays in `review` and the page asks for a reason

#### Scenario: Deliver from the wrong status

- **WHEN** the owner tries to deliver a ticket that is in `open`
- **THEN** the system refuses and the ticket stays `open`

### Requirement: Conflict-safe claiming

Every status change SHALL succeed only if the ticket still has the status and owner the actor saw when acting. When two people claim the same ticket at the same time, exactly one claim SHALL succeed and the other person SHALL see that the ticket was just claimed, with the claimer's name.

#### Scenario: Two members claim at once

- **WHEN** 柏文 and 芭樂 both press claim on unowned J-4 in `open` at the same moment
- **THEN** J-4 is owned by exactly one of them and the other sees a message that J-4 was just claimed by that person

### Requirement: Ticket history

Every successful action SHALL record who did it, which action, the reason if any, and when, in the same database transaction as the status change. The ticket page SHALL list this history from oldest to newest.

#### Scenario: History after a rejection

- **WHEN** J-2 was filed by 巧達, claimed by 柏文, delivered, and rejected by 巧達 with the reason "手機版按鈕跑版"
- **THEN** the J-2 page shows four history entries in that order and the rejection entry shows "手機版按鈕跑版"

### Requirement: Ticket board page

The `/tickets` page SHALL show an 進行中 tab (open, in_progress, review) and an 已結案 tab (done, wontfix), and a 只看我的 filter that keeps tickets the viewer reported or owns. Each card SHALL show status, `J-n`, title, category, reporter, and owner. Opening `/tickets?t=<n>` SHALL show that ticket's detail with whose turn it is, the next step, only the action buttons the viewer is allowed to use, the description, and the history.

#### Scenario: Viewer sees only allowed buttons

- **WHEN** a member who is neither reporter nor owner opens a ticket in `review`
- **THEN** no accept or reject button is shown

#### Scenario: Filter to my tickets

- **WHEN** a member turns on 只看我的
- **THEN** only tickets the member reported or owns are listed

### Requirement: Kickoff prompt

The ticket page SHALL offer a 複製開工指令 button to the owner and to admins. The copied text SHALL name the ticket as 「看我笑話平台的 `J-<n>`」 with its title, category, and reporter; SHALL tell the reader to first read `COLLABORATION.md` at the repository root and follow it; SHALL name the branch `feat/J-<n>-<short-name>`; SHALL say to stop and let the operator confirm before pushing and opening a PR titled `fix(J-<n>): ...`; SHALL say not to merge the PR; SHALL say to come back to `/tickets?t=<n>` and press 交付 after Jesse merges and deploys; and SHALL include the full ticket description. The kickoff text SHALL NOT restate rules that belong to `COLLABORATION.md`, such as environment keys, migration commands, or staging commands.

#### Scenario: Owner copies the kickoff prompt

- **WHEN** the owner of J-9 titled 「財務頁加匯出按鈕」 presses 複製開工指令
- **THEN** the clipboard holds text containing `J-9`, 「財務頁加匯出按鈕」, `COLLABORATION.md`, `feat/J-9-`, `fix(J-9)`, and the ticket description

#### Scenario: Rules are not copied into the prompt

- **WHEN** the kickoff text is generated for any ticket
- **THEN** it does not contain `db:migrate`, `.env.local`, `SUPABASE_`, or `git add`

### Requirement: Merged PR hint

When a ticket is `in_progress` and a pull request in `jokesonme-studio/jokesonme` whose title contains `(J-<n>)`, or `(T-<n>)` for pull requests titled before the prefix changed on 2026-11-22, has been merged, the ticket's next-step text on the ticket page and in the Claude ticket API SHALL say that PR `#<pr>` is merged and that the owner presses 交付 after Jesse deploys. When several such pull requests are merged, the most recently merged one SHALL be named. The merge state SHALL be read from GitHub's public API without credentials and cached for at most 5 minutes; when it cannot be read, the page SHALL render with the ordinary next-step text and no error. The platform SHALL NOT change a ticket's status on its own.

#### Scenario: PR merged but not delivered

- **WHEN** J-20 is `in_progress`, owned by 柏文, and PR #18 titled `fix(T-20): 平台新增工具箱頁` is merged
- **THEN** the J-20 page's next step reads that PR #18 is merged and that 柏文 presses 交付 after Jesse deploys

#### Scenario: GitHub unreachable

- **WHEN** the GitHub request fails or times out
- **THEN** the ticket page still opens and shows the ordinary next step

### Requirement: My turn list

The home page SHALL show a 「輪到你的開發票」 section listing the tickets where it is the viewer's turn: tickets the viewer owns that are `in_progress`, and tickets in `review` that the viewer is the one to review — the reporter when someone else did the work, or an admin when the reporter did the work themself. A `review` ticket that another person is to review SHALL NOT be listed for an admin. Each row SHALL show `J-<n>`, the title, and whether it awaits review, is in development, or has a merged PR awaiting 交付, and SHALL link to `/tickets?t=<n>`. When no ticket is the viewer's turn the section SHALL NOT be rendered.

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
