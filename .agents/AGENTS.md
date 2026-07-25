# Commit Protocol
Before staging and committing code, always run `git status` to carefully review the list of modified and untracked files.
Ensure that no unnecessary files, temporary logs, or testing artifacts (such as `test-results/`, `.last-run.json`, etc.) are included in the commit.
If unnecessary files are present, add them to `.gitignore` and remove them from tracking (`git rm --cached`) before proceeding.
Follow this protocol strictly at all costs to maintain industry-standard repository hygiene.
