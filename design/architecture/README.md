# Architecture diagrams (SCRUM-75)

The two diagrams from the Create goal. They are written in Mermaid, so they live in the repo, appear in the git history and render on GitHub.

| File | Shows | Mermaid type |
|---|---|---|
| [1-application.md](1-application.md) | The application: what runs where, and how the parts connect | `flowchart` |
| [2-answer-submission.md](2-answer-submission.md) | Answer submission → storage → database behaviour, including what the database refuses | `sequenceDiagram` |

Each file has notes for drawing it (questions to answer, and where the parts are in the code) inside `<!-- -->`. The notes show only when you edit the file, not in the preview or on GitHub.

## Preview

- **VS Code:** open a diagram file and press Cmd+Shift+V. This needs the "Markdown Preview Mermaid Support" extension (`bierner.markdown-mermaid`).
- **Browser:** paste the code from inside the ` ```mermaid ` block into https://mermaid.live.

## Export for the portfolio

On mermaid.live, download the diagram as PNG or SVG and save it next to its file, e.g. `1-application.svg`.

## Syntax you'll need

**Flowchart**
- `flowchart TD` draws top to bottom; `flowchart LR` draws left to right.
- `A[Box]` is a box, `B[(Database)]` a database cylinder, `C{Decision}` a decision and `D([Rounded])` a rounded box.
- `A --> B` is an arrow, `A -->|label| B` an arrow with a label and `A -.->|planned| B` a dashed arrow (use dashed for parts that aren't built yet).
- `subgraph Phone["Runs on the phone"]` … `end` draws a frame around a group.

**Sequence diagram**
- `actor Player` adds a person; `participant App as Which Bin app` adds a part with a short id.
- `A->>B: text` is a call; `B-->>A: text` is the reply (dashed).
- `alt allowed` … `else refused` … `end` shows two possible outcomes.
- `Note over B: text` adds an explanation next to a part.

In both, `%%` starts a comment.

## When a diagram is done

- [ ] Every box matches something in the code, or something planned (drawn dashed).
- [ ] You can explain each arrow without notes.
- [ ] The 2–3 sentences under "What it shows" are written.
- [ ] Claude has checked it against the code ("check my diagrams against the code").
- [ ] Exported, committed (`docs: add the architecture diagrams`) and attached to SCRUM-75.
