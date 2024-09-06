#!/bin/bash

# Check if we're in the hooks directory
if [ "$(basename "$(pwd)")" != "hooks" ]; then
    echo "Error: This script should be run from the hooks directory."
    exit 1
fi

# Get the absolute path of the current (hooks) directory
HOOKS_PATH="$(pwd)"

# Ensure .git/hooks directory exists (two levels up from hooks directory)
mkdir -p ../../.git/hooks

# Loop through each file in the current directory
for hook in *; do
    if [ -f "$hook" ] && [ "$hook" != "$(basename "$0")" ] && [ "$hook" != "README.md"]; then
        target_link="../../.git/hooks/$hook"
        
        # Remove existing symlink or file
        if [ -e "$target_link" ]; then
            rm "$target_link"
        fi
        
        # Create symlink
        ln -s "../../hooks/$hook" "$target_link"
        
        # Make the hook executable
        chmod +x "$hook"
        
        echo "Created symlink for $hook"
    fi
done

echo "Git hooks setup completed successfully!"
echo "Symlinks created in .git/hooks for all scripts in $HOOKS_PATH"