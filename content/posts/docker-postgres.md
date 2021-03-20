---
title: "Port Forward Postgres Docker Container to Localhost"
description: "A guide for binding the port of a docker container running postgres to localhost"
date: 2021-02-05T18:30:21-05:00
draft: false
img: 'binding-knot.jpg'
imgAlt: "A header image of two iron cables binded in a knot"
filesOnly: true
categories:
  - dev-tools
tags:
 - ruby-on-rails
 - docker
---

## Tools - *Install the following*
- [Docker](https://www.docker.com/) - A platform to run isolated software packages called containers.
- [Docker Postgres Image](https://hub.docker.com/_/postgres) - The instructions for building a postgres container. A container is an instance of a docker image.

Intro
----------------------

I recently
[pruned](https://www.digitalocean.com/community/tutorials/how-to-remove-docker-images-containers-and-volumes)
my docker containers and images to free up some space on my local drive. In
doing so, I was required to spin up some of the containers that I rely on for
local development.

One of these containers is a instance of [postgres](https://hub.docker.com/_/postgres) docker
image. I prefer using a docker container of this image in replace of local postgres installations, as
it is much less of a headache.

I also like to treat the postgres database in the container as if it were installed
locally by forwarding the container port to localhost.

I find this helps limit configuration issues when working on new projects.
Now all I will have worry about is my database `username` and `password`.

Command
----------------------

#### terminal {.snippet-heading}
```bash
docker run --name localhost-postgres -p 5432:5432 -e POSTGRES_USER=some_user -e POSTGRES_PASSWORD=some_password -d postgres
```
This entire command is not specific to `postgres`.  You run commands like this using most one off docker images.
Lets break this command down.

- `docker run` Run a command in a new container
- `--name` the custom name of the container ( I prefer to prefix it with `localhost` in case I have other postgres docker containers, NOT binded to localhost)
- `-d` Run container in background and print container ID
- `-e` Set environment variables
- `POSTGRES_USER=` fill this value with `username` for your projects database configuration/secret files. (do not include the ENV variable in the command if you prefer to use default `postgres` as your username)
- `POSTGRES_PASSWORD=` fill this value with the `password` for your projects database configuration/secret files. (this ENV variable is required for the container)
- `-p` Publish a container's port(s) to the host
- `5432:5432` The default container postgres port mapped (fowarded) to the default localhost postgres port [5432](https://www.adminsub.net/tcp-udp-port-finder/5432)
- `postgres` The installed postgres docker image you are using for the container


Using
-------------

Now all you have to do is is use the value for `POSTGRES_USER=` as your database `username` and `POSTGRES_PASSWORD=` as your database `password`.

#### rails_project/.env {.snippet-heading}
```yml
DB_USER=some_user
DB_PASSWORD=some_password
```

And that is typically all I need to get up an running on a new project and run a command such as `rake db:setup`
This is how a typical database configuration file looks in rails:

#### rails_project/config/database.yml {.snippet-heading}
```yml
production:
  url:  <%= ENV["DATABASE_URL"] %>
  pool: <%= ENV["DB_POOL"] || ENV['RAILS_MAX_THREADS'] || 5 %>

development:
  pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 5 } %>
  adapter: postgresql
  encoding: unicode
  database: rails_project
  host: localhost
  username: <%= ENV['DB_USER'] %>
  password: <%= ENV['DB_PASSWORD'] %>

test:
  pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 5 } %>
  adapter: postgresql
  encoding: unicode
  database: rails_project_test
  host: localhost
  username: <%= ENV['DB_USER'] %>
  password: <%= ENV['DB_PASSWORD'] %>
```
