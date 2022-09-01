# YouTube Politics

YouTube is arguably the largest and most engaging online media platform in the world. Its scale has fueled concerns that YouTube users are being radicalized by biased recommendations and professedly apolitical “anti-woke” channels.

This application is an interactive version of the paper by _Hosseinmardi et al_ exploring this hypothesis.

[Read the original paper](http://localhost:8080/#:~:text=Read%20the%20original%20research)

## The stack

This application is built with the Svelte.js framework using Typescript.

## Deploying

The site is built and deployed with a GitHub Actions workflow to an AWS S3 bucket.

Deployment requires 3 environment variables set as secrets:

AWS credentials and the bucket are defined as enviroment variables/repo secrets.