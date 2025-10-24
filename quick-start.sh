#!/bin/bash
set -e

# --- Colors ---
GREEN="\033[1;32m"
CYAN="\033[1;36m"
YELLOW="\033[1;33m"
RESET="\033[0m"
MAGENTA="\033[0;35m"

CREATED_FILE=".created"

SERVER_URL="http://localhost:3000/"

if [ ! -f "$CREATED_FILE" ]; then
    date +"%Y-%m-%d" > "$CREATED_FILE"  
fi

created=$(cat "$CREATED_FILE")
#date 
updated=$(date +"%Y-%m-%d %H:%M:%S") 

ASCII_ART="${GREEN}
 _    _   ____ 
/ \  / | /   _|
|  \`´  | |  / 
| |\/| | |  \_
\_/  \_| \____|

  * Softwares Lab *
${RESET}
${MAGENTA}© Manuel Crispino
Created : ${created} 
Last updated : ${updated}
"

# --- Func check/install ---
install_if_needed() {
  local folder=$1
  if [ ! -d "$folder/node_modules" ]; then
    (cd "$folder" && npm install --silent)
  fi
}

# --- kill terminals ---
cleanup() {
  echo -e "${YELLOW}\n🛑 CTRL+C closing Ports...${RESET}"
  npm run kill-ports &> /dev/null || true
  exit 0
}

trap cleanup SIGINT

# --- Root e backend ---
install_if_needed "."
install_if_needed "server"

# --- Setup backend ---
(cd server && npm start --silent) & 

# --- start dev server and show output selected ---
npm run dev 2>&1 | while read -r line; do
  if [[ $line == *"Local:"* ]]; then
    url=$(echo "$line" | awk -F 'Local:' '{print $2}')
    echo -e "${RESET}${ASCII_ART}${RESET}"
    echo -e "${GREEN}🔗 App running on:${RESET}\n${CYAN}$url${RESET}\n"
    echo -e "${MAGENTA}🔗 Server listening on:${RESET}\n${CYAN}$SERVER_URL${RESET}\n"
    echo -e "${YELLOW}⚠ Attention:${RESET}\n"
    echo -e "${YELLOW}Press CTRL+C to safely stop servers and free occupied ports.${RESET}"
  fi
done