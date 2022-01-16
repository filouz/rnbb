#!/bin/sh

# Create a JavaScript file
echo "window.config = {" > /usr/share/nginx/html/config.js

# For each environment variable that starts with REACT_APP_, output "KEY: 'VALUE',"
printenv | grep -o '^REACT_APP_[^=]*' | while read -r line ; do
  VALUE=$(printenv $line)
  echo "  $line: '$VALUE'," >> /usr/share/nginx/html/config.js
done

# Close the JavaScript object
echo "};" >> /usr/share/nginx/html/config.js

# Start nginx
nginx -g 'daemon off;'