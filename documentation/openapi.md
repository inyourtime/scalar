# OpenAPI Specification

We’re expecting the passed specification to adhere to [the Swagger 2.0, OpenAPI 3.0 or OpenAPI 3.1 specification](https://github.com/OAI/OpenAPI-Specification).

On top of that, we’ve added a few things for your convenience:

## x-scalar-environments

you can specify predefined environment variables for the API Client/References to consume and use :)

```
x-scalar-environments:
  production:
    description: "Production environment"
    color: "#0082D0"
    # Variables are saved directly to the specification
    variables:
      userId:
        description: "User ID"
        default: "1234567890"
      apiUrl:
        description: "API URL"
        default: "https://api.production.example.com"
  staging:
    description: "Staging environment"
    variables:
      userId: "1234567890"
      apiUrl:
        description: "API URL"
        default: "https://api.staging.example.com"
```

## x-scalar-active-environment

You can also specify the default active environment a user will have :) if theres none set here we pick the first from the `x-scalar-environments` to be the default

```
x-scalar-active-environment: staging
```

## x-codeSamples

We provide examples for a lot of popular HTTP clients and frameworks. For something completly custom, for example to show the use of your own SDK, you can use `x-codeSamples`:

```diff
openapi: 3.1.0
info:
  title: Val Town API
  version: '1.0'
paths:
  '/v1/eval':
    post:
+      x-codeSamples:
+      - label: ValTown JS SDK
+        lang: JavaScript
+        source: |-
+          import ValTown from '@valtown/sdk';
+
+          const valTown = new ValTown();
+
+          async function main() {
+            const valRunAnonymousResponse = await valTown.vals.runAnonymous({ code: 'console.log(1);' });
+
+            console.log(valRunAnonymousResponse);
+          }
+
+          main();
```

## x-displayName

You can overwrite tag names with `x-displayName`.

```diff
openapi: 3.1.0
info:
  title: Example
  version: '1.0'
tags:
  - name: pl4n3t5
+    x-displayName: planets
paths:
  '/planets':
    get:
      summary: Get all planets
      tags:
        - pl4n3t5
```

## x-tagGroup

You can group your tags with `x-tagGroup`.

```diff
openapi: 3.1.0
info:
  title: Example
  version: '1.0'
tags:
  - name: planets
+x-tagGroups:
+  - name: galaxy
+    tags:
+      - planets
paths:
  '/planets':
    get:
      summary: Get all planets
      tags:
        - planets
```

## x-internal

You can hide operations from the reference with `x-internal`.

```diff
openapi: 3.1.0
info:
  title: Example
  version: '1.0'
paths:
  '/planets':
    get:
      summary: Get all planets
    post:
      summary: Create a new planet
+      x-internal: true
```

## x-additionalPropertiesName

You can add a custom attribute name to `additionalProperties` with `x-additionalPropertiesName`.

```diff
openapi: 3.1.0
info:
  title: Example
  version: '1.0'
components:
  schemas:
    Planet:
      required:
        - name
      properties:
        name:
          type: string
      additionalProperties:
+        x-additionalPropertiesName: anyCustomAttribute
        type: string
```
