#!/usr/bin/env bash

action="$1"
server_bin="npm start -s"
server_config="dstu.config.json"
server_startup_retries=10

wdm_bin="./node_modules/webdriver-manager/bin/webdriver-manager"
wdm_bin_hr="$(basename ${wdm_bin})"
selenium_dir="./node_modules/webdriver-manager/selenium"

e2e_output="e2e.output"

server_pid_msg="nodeServer.pid: "
server_pid_re="^${server_pid_msg}\([0-9]*\)$"
wdm_pid_re="^.*Detached pid: \([0-9]*\)$"
selenium_pid_re="^.*seleniumProcess.pid: \([0-9]*\)$"

function main () {
  [[ ! -f "$wdm_bin" ]] && error_message "$wdm_bin not found. \nPlease run 'npm install' first."
  [[ ! -d "$selenium_dir" ]] && ${wdm_bin} update

  case "$action" in
    "start" )
      echo "new session" > "$e2e_output"
      start_server
      wait_for_server
      start_webdriver
    ;;
    "stop" )
      [[ ! -f "$e2e_output" ]] && error_message "$e2e_output not found!"
      kill "$(extract_pid "$server_pid_re")"
      kill "$(extract_pid "$selenium_pid_re")"
      kill "$(extract_pid "$wdm_pid_re")"
      rm "$e2e_output"
      echo "e2e infrastructure stopped."
    ;;
    * )
      error_message "not recognized: $action \nmust be either '$(basename $0) start' or '$(basename $0) stop'"
    ;;
  esac
}

function start_server () {
  ${server_bin} >> "$e2e_output" 2>&1 &
  server_pid="$!"
  echo "${server_pid_msg}${server_pid}" >> "$e2e_output"
}

function wait_for_server () {
  server_port=`sed -n -e 's/.*\"port\": \([0-9]*\).*/\1/p' "$server_config"`
  printf "waiting for server start (port ${server_port}): "
  sleep 2
  while [[ ${server_startup_retries} > 0 && ! `lsof -i :${server_port}` ]]; do
    sleep 1
    printf "$server_startup_retries "
    server_startup_retries=`expr ${server_startup_retries} - 1`
  done

  if [[ ${server_startup_retries} > 0 ]]; then
    echo "server started"
  else
    error_message "server NOT running!"
  fi
}

function start_webdriver () {
  ${wdm_bin} start --detach >> "$e2e_output" 2>&1
  echo "$wdm_bin_hr started"
}

function extract_pid () {
  pid=`sed -n -e 's/'"$1"'/\1/p' "$e2e_output"`
  ! [[ "$pid" =~ ^[0-9]+$ ]] && error_message "no match of '$1' in '$e2e_output' \nresult: '$pid'"
  echo "$pid"
}

function error_message () {
  printf "$*\n"
  exit 1
}

main; exit