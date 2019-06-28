<!--
title: 'Dynamic Image Resizing API'
description: 'This example shows you how to setup a dynamic image resizer API'
layout: Doc
framework: v1
platform: AWS
language: nodeJS
authorLink: 'https://github.com/sebito91'
authorName: 'Sebastian Borza'
authorAvatar: 'https://avatars0.githubusercontent.com/u/3159454?v=4&s=140'
-->

# Dynamic image resizing with Node.js and Serverless framework

In this example, we set up a dynamic image resizing solution with AWS S3 and a Serverless framework function written in Node.js. We use [the `sharp` package](https://www.npmjs.com/package/sharp) for image resizing.

`sharp` includes native dependencies, so in this example we are building and deploying the Serverless function from a Docker container that’s based on Amazon Linux.

## Pre-requisites

In order to deploy the function, you will need the following:

- API credentials for AWS, with Administrator permissions (for simplicity, not recommended in production).
- An S3 bucket in your AWS account.
- Serverless framework installed locally via `yarn global add serverless`.
- Node.js 8 and `yarn` installed locally.
- Docker and docker-compose installed locally.

## Deploying the Serverless project

1. Clone the repository and install the dependencies:\

```
yarn
```

2. Add your AWS credentials into a `secrets/secrets.env` file.
3. Deploy the Serverless project:\

```
docker-compose up --build
```
