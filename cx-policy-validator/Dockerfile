#
#  Copyright (c) 2025 Fraunhofer-Gesellschaft zur Förderung der angewandten Forschung e.V.
#
# See the NOTICE file(s) distributed with this work for additional
# information regarding copyright ownership.
#
# This program and the accompanying materials are made available under the
# terms of the Apache License, Version 2.0 which is available at
# https://www.apache.org/licenses/LICENSE-2.0.
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
# WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
# License for the specific language governing permissions and limitations
# under the License.
#
# SPDX-License-Identifier: Apache-2.0
#

# Download (and cache) dependencies
FROM gradle:8.14.3-jdk17-alpine AS build
WORKDIR /app
ENV GRADLE_OPTS -Dkotlin.compiler.execution.strategy="in-process"
ENV JAVA_OPTS -XX:-UsePerfData
COPY gradle/libs.versions.toml gradle/
COPY tx-memory-connector tx-memory-connector/
COPY settings.gradle.kts .
RUN gradle shadowJar --no-daemon --parallel

# Run jar
FROM eclipse-temurin:17.0.16_8-jre-alpine
WORKDIR /app
RUN addgroup -S nonroot && adduser -S nonroot -G nonroot
COPY --from=build /app/tx-memory-connector/build/libs/runtime.jar /app
COPY --from=build /app/tx-memory-connector/config.properties /app

USER nonroot
# Define entrypoint by starting the .jar file with Java
ENTRYPOINT ["java", "-Dedc.fs.config=config.properties", "-jar", "runtime.jar"]
