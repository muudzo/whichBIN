# Which Bin? · Application architecture

<!--
  What this diagram must show (learning goal, Create): the application.

  Questions to answer before you draw:
  - What runs on the phone, and what runs on a server?
  - What crosses the internet?
  - Where do the items and their Omrin rules come from?

  Where the parts are in the code:
  - Screens: app/src/features/
  - Game rules: app/src/domain/game.ts
  - The 15 items: app/src/data/items.json
  - Everything the game saves or reads about players goes through ScoreStore
    (app/src/services/scoreStore.ts, 5 methods). Today it saves on the phone only;
    planned: Supabase, with the same 5 methods.
  - Hosting: Cloudflare Pages (planned, SCRUM-27)

  Draw planned parts with dashed arrows (-.->). Syntax: README.md in this folder.
-->

```mermaid

flowchart TD
    PLAYER["Player<br/>Mobile or desktop browser"]

    subgraph FRONTEND["Frontend - React + TypeScript + Vite"]
        UI["User Interface<br/>Tailwind + shadcn/ui"]
        GAME["Game Engine<br/>Rounds, scoring, lives"]
        CONTENT["Waste Items<br/>15 sourced sorting rules"]
        RESULTS["Results Interface<br/>Explanations and leaderboard"]
        CLIENT["Supabase Client"]
    end

    subgraph BACKEND["Backend - Supabase"]
        API["Supabase API"]
        RLS["Row Level Security<br/>Access control policies"]

        subgraph DATABASE["PostgreSQL Database"]
            PLAYERS[("Players")]
            ANSWERS[("Submitted Answers")]
            STATS[("Player Statistics")]
        end

        LOGIC["Trusted Database Logic<br/>Validation and score aggregation"]
    end

    PLAYER --> UI
    UI --> GAME
    CONTENT --> GAME
    GAME --> RESULTS
    RESULTS --> CLIENT
    CLIENT <-->|"HTTPS requests and responses"| API
    API --> RLS
    RLS --> PLAYERS
    RLS --> ANSWERS
    RLS --> STATS
    ANSWERS --> LOGIC
    LOGIC --> STATS
    STATS --> RLS

    classDef frontend fill:#dbeafe,stroke:#2563eb,color:#172554
    classDef backend fill:#dcfce7,stroke:#16a34a,color:#14532d
    classDef database fill:#fef3c7,stroke:#d97706,color:#78350f

    class UI,GAME,CONTENT,RESULTS,CLIENT frontend
    class API,RLS,LOGIC backend
    class PLAYERS,ANSWERS,STATS database

```


