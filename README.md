# Rapid Queue Publisher

An implementation of RabbitMQ publisher in NestJS application.

## Pre-requisites to run this project

1. NodeJS

## Steps to run this project

1. Setup the RabbitMQ server by running this command:
    ```shell
    $ docker run -d --hostname rabbit-mq --name rapid-queue -p 5672:5672 -p 15672:15672 rabbitmq:3-management
    ```
2. Clone the repo 
3. Run `npm install` to install all the dependencies 
4. Create a `.env` from `env-example` file: `cp env-example .env.local` and update the values 
5. Run `npm run start:dev` to start the project

## Tech Stack

- NestJS 
- RabbitMQ 
- TypeScript 
- Docker

## Contact

mohdejazsiddiqui@gmail.com