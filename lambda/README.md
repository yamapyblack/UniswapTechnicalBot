# UniswapTechnicalBot/lambda

## How to execute

node index.js

## Deploy lambda

Copy index.js and paste lambda.

comment out `main function` and comment in `handler`

```
before

// exports.handler = async (event) => {
main = async () => {

after

exports.handler = async (event) => {
// main = async () => {
```
