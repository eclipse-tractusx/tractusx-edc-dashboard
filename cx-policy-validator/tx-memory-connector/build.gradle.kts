/*
 *  Copyright (c) 2025 Fraunhofer-Gesellschaft zur Förderung der angewandten Forschung e.V.
 *
 *  See the NOTICE file(s) distributed with this work for additional
 *  information regarding copyright ownership.
 *
 *  This program and the accompanying materials are made available under the
 *  terms of the Apache License, Version 2.0 which is available at
 *  https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 *  WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 *  License for the specific language governing permissions and limitations
 *  under the License.
 *
 *  SPDX-License-Identifier: Apache-2.0
 */

group = "de.fraunhofer.isst.dst.cx.validator"
version = "0.0.2"

val edcVersion = "0.14.1"
val txVersion = "0.11.1"


plugins {
  java
  application
  id("com.github.johnrengelman.shadow") version "8.1.1"
}

repositories {
  mavenLocal()
  mavenCentral()
}

dependencies {
  implementation("org.eclipse.edc:controlplane-dcp-bom:${edcVersion}")
  implementation("org.eclipse.edc:jersey-providers-lib:${edcVersion}")
  implementation("org.eclipse.edc:management-api-lib:${edcVersion}")

  implementation("org.eclipse.tractusx.edc:cx-policy:${txVersion}")
  implementation("org.eclipse.tractusx.edc:json-ld-core:${txVersion}")
  implementation("org.eclipse.tractusx.edc:bpn-validation-core:${txVersion}")
  implementation("org.eclipse.tractusx.edc:bdrs-client:${txVersion}")

}

tasks.withType<com.github.jengelman.gradle.plugins.shadow.tasks.ShadowJar> {
  exclude("**/pom.properties", "**/pom.xml")
  mergeServiceFiles()
  archiveFileName.set("runtime.jar")
  isZip64 = true
}

application {
  mainClass.set("org.eclipse.edc.boot.system.runtime.BaseRuntime")
}
