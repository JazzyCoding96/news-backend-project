# News API
For developers

## Hosted version
This is the link to the hosted version: https://nc-news-xooy.onrender.com/api/

This will get you to the endpoints JSON which will display the live endpoints available to you and the example responses to each request. Some endpoints integrate parametric endpoints. 

## Summary of project
This project intends to create a backend RESTful API, using CRUD operations, for accessing application data. It has been modeled after backend services like Reddit. Data includes; articles, comments and topics. The API will serve as the bridge between the application's front end and the database.


## Getting Started
To clone this project, use following command: 
```bash
git clone https://github.com/JazzyCoding96/news-backend-project
```

### Install the dependencies

Run the following command: 
```bash
npm install
```


### Seed the local database

Run the following command: 
```bash 
npm run seed
```


### Run the tests

Run the following command: 
```bash
npm test
```
### Create .env files
To connect to the test and devData databases locally, you must add two .env files.
Add .env.development and set database to nc_news "```PGDATABASE=nc_news```"
Do the same for test database: Add .env.test file and "```PGDATABASE=nc_news_test```"

*Do not include the double quotation marks in the files*

## Versions of Node and Postgres
Minimum versions required to run the project:

Node v20.0.0

PostgreSQL 14.10
