# Provisioning Server

This is an Ansible based setup to provision the server.

## Usage

You can provision a virtual machine (VM) using vagrant just by running:

    vagrant up --provision

> Vagrant will not be able to ping the VM after provisioning because we change
> the port. Just call `vagrant provision` directly, that will handle it
> properly.

You can also provision external systems just like the VM is provisioned by
running the provisioning file for a dedicated inventory:

    ansible-playbook -i staging provision.yml

To connect to the VM use:

    ssh vagrant@33.33.33.101 -p 2222

## Docker

### Run

You can run a docker container for the catwalk using the official image (built nightly):

```bash
$ docker run -d --name catwalk frontastic/frontastic:paas
```

And optionally connect to the container for introspection:

```bash
$ docker exec -it catwalk bash
```

### Build

For building the docker image, you will first need to generate `packer` config from template:

```bash
$ ansible all \
    -i "localhost," \
    -c local \
    -m template \
    -a "src=./template/templates/customer/automation/packer.json.j2 dest=paas/automation/packer.json" \
    -e '{"customer":{"name":"frontastic"}}'
```

And then build using `packer`:

```bash
$ packer build --only=docker paas/automation/packer.json
```

### Publish to DockerHub

You need to have access rights to DockerHub and be logged in (`docker login`).

```bash
$ docker push frontastic/frontastic
```

Note that the second "frontasic" is the customer name. So if you changed that in
the ansible command while building, you have to change it here, too.

## Info

To start understanding what happens take a look at `provision.yml`
which describes the different servers and what runs where. From there you may
dive into the concrete roles, which can be found at `roles/*`. The main
file always is `tasks/main.yml` while there might be additional dependencies in
`meta/main.yml`.

What is provisioned on which server is defined in the following files (simple
inventories, since we use only one server right now):

* `staging` for the staging setup
* `vagrant` for the VM
* `docker` for the docker container
