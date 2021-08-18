# Okta tools

This project helps developers working with Okta and its services.
Project is built on top of React and Flask.

## Available tools

    * SAML metadata generator. 🔥
    * SAML metadata parser.💧
    * SAML SP to test Okta as IDP.🧊

## Running the project

Starting the project need running a front-end and a backend.

## running thr project with Docker

Running the project with docker is the simple with docker

pre prerequisites

- Docker 20.10.x or later
- docker-compose 1.29.X or later

it would work on other docker versions, the above are the tested ones

> `sudo docker-compose up`

- visit the url http://localhost:8000

### starting the react project

> `yarn start`

### starting FLASK APP:

Open a new terminal and run the following.

> `cd api`

> `env\Scripts\activate`

> `pip install -r requirements.txt`

> `flask run`
