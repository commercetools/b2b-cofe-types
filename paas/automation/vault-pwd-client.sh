#!/bin/bash
#
# DEPRECATED
#

PWD_FILE=${FRONTASTIC_VAULT_PASSWORDS_FILE:-vault-passwd.decrypt}
SCRIPTPATH=$(realpath $0)

while [[ $# -gt 0 ]]
do
key="$1"

case $key in
    -v|--vault-id)
    VAULT_ID="$2"
    shift
    shift
    ;;
    -g|--get-ids)
    GET_IDS="true"
    shift
    shift
    ;;
esac
done

if [[ "${GET_IDS}" == "true" ]]
then
    VAULT_IDS="--vault-id=default@${SCRIPTPATH}"
    if [[ -f $PWD_FILE ]]
    then
        while IFS='=' read -r id passwd
        do
            VAULT_IDS="${VAULT_IDS} --vault-id=${id}@${SCRIPTPATH}"
        done <$PWD_FILE
    fi
    echo ${VAULT_IDS}
    exit 0
else
    if [[ -f $PWD_FILE ]]
    then
        while IFS='=' read -r id passwd
        do
            if [[ "${VAULT_ID}" = "${id}" ]]
            then
                echo $passwd
                exit 0
            fi
        done <$PWD_FILE
    fi
fi
echo ${ANSIBLE_VAULT_PASSWORD}
