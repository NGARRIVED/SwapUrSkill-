# SwapUrSkill

A Skill Swap Platform with clear separation of frontend, backend, and integrator (shared scripts, docs, etc.).

## Structure

```
SwapUrSkill-/
│
├── frontend/           # All frontend (React, Next.js, etc.) code
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── ... (other frontend configs)
│
├── backend/            # All backend (Node.js, Express, etc.) code
│   ├── src/
│   ├── package.json
│   └── ... (other backend configs)
│
├── integrator/         # Shared scripts, environment, CI/CD, docs
│   ├── scripts/
│   ├── docs/
│   └── shared/         # (optional) shared types/interfaces
│
├── .gitignore
├── README.md
└── package.json        # (optional) for monorepo tooling (e.g., with workspaces)
```
