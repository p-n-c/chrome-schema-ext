# Git hooks

To use the git hooks, create a symbolic link to the repo's hooks directory to the `.git/hook`.
From the repo's directory:

```bash
# !!!Make sure to save your own hooks first!!!
rm -rf ./git/hooks
ln -s "../hooks" .git/hooks
```
