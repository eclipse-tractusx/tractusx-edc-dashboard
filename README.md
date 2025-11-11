# Catena-X Policy Builder

Please also refer to:

- [Tractus-X EDC](https://github.com/eclipse-tractusx/tractusx-edc)
- [EDC Data Dashboard](https://github.com/eclipse-edc/DataDashboard)
- [Report Bug / Request Feature](https://github.com/eclipse-tractusx/tractusx-edc-dashboard/issues)

## About The Project

This repository contains the Catena-X Policy Builder, which consists of the following components:
- The [eclipse-edc/DataDashboard](https://github.com/eclipse-edc/DataDashboard) included as Git submodule in the [eclipse-edc](./eclipse-edc) folder to use the dashboard library.
- A minimal Tractus-X connector for policy validation in the [cx-policy-validator](./cx-policy-validator) folder. The connector implements a custom HTTP endpoint for validation purposes and adds it to the Management API context.
- Everything else in this repo belongs to the Angular frontend (GUI) of the Catena-X Policy Builder.

## Getting Started - Local Setup

### Step 1: Build and run the backend (validator)

#### Docker

 1. `cd cx-policy-validator`
 2. `docker build -t cx-policy-builder-validator .`
 3. `docker run --rm -p 8000:8000 -p 8010:8010 cx-policy-builder-validator`

#### Gradle

 1. `cd cx-policy-validator`
 2. `./gradlew shadowJar`
 3. `java -Dedc.fs.config="tx-memory-connector/config.properties" -jar tx-memory-connector/build/libs/runtime.jar`

### Step 2: Build and run the frontend

#### Docker

 1. `docker build -t cx-policy-builder-ui .`
 2. `docker run --rm -p 8080:8080 cx-policy-builder-ui`
 3. Open [http://localhost:8080](http://localhost:8080)

#### Angular DEV server

 1. `npm run lib-build -- --configuration production`
 2. `npm run start`
 3. Open [http://localhost:4200](http://localhost:4200)

## How to contribute

Please note to our [CONTRIBUTION](https://github.com/eclipse-tractusx/tractusx-edc-dashboard/blob/main/CONTRIBUTING.md) guidelines.

## License

Distributed under the Apache 2.0 License.
See [LICENSE](https://github.com/eclipse-tractusx/tractusx-edc-dashboard/blob/main/LICENSE) for more information.
