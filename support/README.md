# Git hooks script

## Automatically zip the publish directory for upload

- Make sure you've got `zip` installed:
  `zip --help`
- Move the pre-commit script to the `.git/hooks` directory. From `./support`:
  `mv pre-commit ../.git/hooks/pre-commit`
- Commit normally, the script will automatically create `chrome-extension.zip`
