#!/bin/bash
BOLD="\e[1m"
BLUE="\e[34m"
PURPLE="\e[1;37;48;5;162m"
RED="\e[31m"
RESET="\e[0m"
echo -e "\n${BOLD}Status of supervisord processes, should all be RUNNING:$RESET\n"
sleep 2 # required to give supervisord a chance to start
sudo supervisorctl status | GREP_COLORS='mt=00;31' egrep --color '.*FATAL.*|.*STOPPED.*|.*BACKOFF.*|.*UNKNOWN.*|$'
echo -e "\n${BLUE}If you see problems above, use sudo supervisorctl inside the guest (vagrant ssh) to investigate.$RESET"

echo -e "\n\n${BOLD}Status of other service processes, should all be running:$RESET\n"
typeset -A services
services=(
    [CouchDB]=couchdb
    [MySQL]=mysql
    [nginx]=nginx
    [PHP]=php7.4-fpm
    [Supervisor]=supervisor
    [SSH]=ssh
)
for service in "${!services[@]}"; do
    if sudo service ${services[$service]} status 2>&1 | grep -q -e "not running" -e "stopped"; then
        printf "$RED%-50s not running$RESET\n" $service
    else
        printf "%-50s running\n" $service
    fi
done

echo -e "\n${BLUE}If you see problems above, use vagrant ssh to get a shell inside the guest.$RESET"
echo -e "\n"
echo -e "  $PURPLE  ╔══ $RESET"
echo -e "  $PURPLE  ╠═  $RESET$BOLD    You may now open http://frontastic.io.local in your browser.$RESET"
echo -e "  $PURPLE  ║   $RESET"
echo " "
