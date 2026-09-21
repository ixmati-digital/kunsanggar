# Public Production Rule

Never publish internal project information in interfaces intended for final
visitors.

Internal information includes phases, budgets, advances, contractual scope,
future modules, blockers, pending implementation work, QA, technical status,
commercial approvals, development notes, credentials, infrastructure names,
commits, and team decisions.

Keep that information only in private documentation, issues, backlog, or
development comments. Before every deploy, perform a **PUBLIC COPY AUDIT** for
every visible string:

> Was this written for a Kunsang Gar visitor, or for Jared/the development team?

If the answer is Jared/development, do not publish it. If a section is not
ready for visitors, remove it from navigation and production rather than
showing a placeholder or roadmap.
