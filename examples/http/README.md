# Http Context Example

Read [ExampleModule](./src/example.module.ts) to understand how this example is working.

Execute yarn:start at this folder to start the server

To see the context in action try to execute a curl like: 
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
Try also removing the X-Correlation-Id header, so you can test the auto-generation.
Stop the server, re-start with ```NODE_ENV=development yarn start``` and retry 
the previous curls


To see @BuildHttpDto in action try to execute a curl like:
```
curl --location --request POST 'http://127.0.0.1:9191/example-2?environment=query-env' \
--header 'X-Correlation-Id: my-uuid' \
--header 'Environment: header-env' \
--header 'Content-Type: application/json' \
--data-raw '{
"id": "1000",
"code": "ES"
}'
```
With and without "code" body, with and without the id...

To see @BuildHttpDto in action try to execute a curl like:
```
curl --location --request POST 'http://127.0.0.1:9191/example-3?environment=query-env'&code=FR \
--header 'X-Correlation-Id: my-uuid' \
--header 'Environment: header-env' \
--header 'Content-Type: application/json' \
--data-raw '{
"id": "1000",
"code": "ES"
}'
```
With and without "code" query string
