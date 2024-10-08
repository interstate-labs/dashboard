#!/bin/bash

echo "🌀 Creating client script with ENV values from .env file..."

# Define the output file name
output_file="${1:-./public/assets/envs.js}"

touch $output_file
truncate -s 0 $output_file

echo "window.__envs = {" >> $output_file

# Check if the .env file exists
if [ -f .env ]; then
    # Read the .env file line by line
    while IFS='=' read -r name value || [ -n "$name" ]; do
        # Skip empty lines and comments
        if [[ -z "$name" || "$name" == \#* ]]; then
            continue
        fi

        # Remove leading/trailing whitespace from name and value
        name=$(echo "$name" | xargs)
        value=$(echo "$value" | xargs)

        # Replace double quotes with single quotes in the value
        value="${value//\"/\'}"

        # Write the variable name and value to the output file
        echo "  \"$name\": \"$value\"," >> "$output_file"
    done < .env
else
    echo "⚠️ .env file not found. No variables will be added."
fi

echo "}" >> $output_file

echo "✅ Done."