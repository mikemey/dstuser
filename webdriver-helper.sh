#!/usr/bin/env bash

wdm_bin="./node_modules/webdriver-manager/bin/webdriver-manager"
selenium_dir="./node_modules/webdriver-manager/selenium"

wdm_output="webdriver-manager.output"

action="$1"

function error_message () {
  printf "$*\n"
  exit 1
}

function extract_pid () {
  pid=`sed -n -e 's/'"$1"'/\1/p' "$wdm_output"`
  ! [[ "$pid" =~ ^[0-9]+$ ]] && error_message "no match of '$1' in '$wdm_output' \nresult: '$pid'"
  echo "$pid"
}

[[ ! -f "$wdm_bin" ]] && error_message "$wdm_bin not found! \nPlease run 'npm install' first."
[[ ! -d "$selenium_dir" ]] && "$wdm_bin" update

wdm_bin_hr="$(basename ${wdm_bin})"
case "$action" in
  "start" )
    "$wdm_bin" start --detach > "$wdm_output" 2>&1
    echo "$wdm_bin_hr started"
  ;;
  "stop" )
    [[ ! -f "$wdm_output" ]] && error_message "$wdm_output not found!"
    kill "$(extract_pid "^.*seleniumProcess.pid: \([0-9]*\)$")"
    kill "$(extract_pid "^.*Detached pid: \([0-9]*\)$")"
    rm "$wdm_output"
    echo "$wdm_bin_hr stopped"
  ;;
  * )
    error_message "not recognized: $action \nmust be either '$(basename $0) start' or '$(basename $0) stop')!"
  ;;
esac
