# Http Context Example

Read [ExampleModule](./src/example.module.ts) to understand how this example is working.

Execute yarn:start at this folder to start the server
Try to execute a curl like: 
```
curl --location --request POST 'http://127.0.0.1:9191/example?environment=query-env' \
--header 'X-Correlation-Id: my-uuid' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": "1"
}'
```
Try to execute a curl like:
```
curl --location --request POST 'http://127.0.0.1:9191/example' \
--header 'X-Correlation-Id: my-uuid' \
--header 'Environment: header-env' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": "1"
}'
```
Stop the server and re-execute with ```NODE_ENV=development yarn start```

