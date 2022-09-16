#!/bin/bash
echo "Setting up application..."
projectdir=/var/www/frontastic
user=$(stat -c "%u" $projectdir)
group=$(stat -c "%g" $projectdir)
if [ "$user" != "0" ]
then
sudo -u \#$user -g \#$group /bin/sh <<"EOF"
eval $( fixuid )
cd $projectdir
ANSIBLE_ROLES_PATH=/var/www/frontastic/saas/automation/roles:/var/www/frontastic/paas/automation/roles:$ANSIBLE_ROLES_PATH ANSIBLE_FORCE_COLOR=1 PYTHONUNBUFFERED=1 ansible-playbook -c local -i paas/automation/docker paas/automation/setup-app.yml
EOF
else
    # when using Windows or macOS as host, host-mounts are owned by root
    echo "Seems we are running under Windows or macOS"
    chown -R vagrant:vagrant $projectdir
sudo -u vagrant -g vagrant /bin/sh <<"EOF"
cd $projectdir
ANSIBLE_ROLES_PATH=/var/www/frontastic/saas/automation/roles:/var/www/frontastic/paas/automation/roles:$ANSIBLE_ROLES_PATH ANSIBLE_FORCE_COLOR=1 PYTHONUNBUFFERED=1 ansible-playbook -c local -i paas/automation/docker paas/automation/setup-app.yml
EOF
fi
echo "Starting system..."
exec /usr/bin/systemctl
