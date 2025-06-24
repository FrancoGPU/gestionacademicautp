#!/bin/bash

# Wrapper script for backward compatibility
# This script redirects to the actual run script in scripts/deployment/

echo "🔄 Redirecting to scripts/deployment/run.sh..."
exec "$(dirname "$0")/scripts/deployment/run.sh" "$@"
