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

package de.fraunhofer.isst.dst.cx;

import org.eclipse.edc.connector.controlplane.services.spi.policydefinition.PolicyDefinitionService;
import org.eclipse.edc.jsonld.spi.JsonLd;
import org.eclipse.edc.runtime.metamodel.annotation.Extension;
import org.eclipse.edc.runtime.metamodel.annotation.Inject;
import org.eclipse.edc.spi.monitor.Monitor;
import org.eclipse.edc.spi.result.Result;
import org.eclipse.edc.spi.system.ServiceExtension;
import org.eclipse.edc.spi.system.ServiceExtensionContext;
import org.eclipse.edc.spi.types.TypeManager;
import org.eclipse.edc.transform.spi.TypeTransformerRegistry;
import org.eclipse.edc.validator.spi.JsonObjectValidatorRegistry;
import org.eclipse.edc.web.jersey.providers.jsonld.JerseyJsonLdInterceptor;
import org.eclipse.edc.web.spi.WebService;
import org.eclipse.edc.web.spi.configuration.ApiContext;
import org.jetbrains.annotations.NotNull;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;

import static java.lang.String.format;
import static java.nio.file.StandardCopyOption.REPLACE_EXISTING;
import static org.eclipse.edc.api.management.ManagementApi.MANAGEMENT_SCOPE;
import static org.eclipse.edc.spi.constants.CoreConstants.JSON_LD;


@Extension(value = PolicyValidationApiExtension.NAME)
public class PolicyValidationApiExtension implements ServiceExtension {
  public static final String NAME = "Catena-X Management API: Policy Validation";

  @Inject
  private Monitor monitor;

  @Inject
  private TypeTransformerRegistry transformerRegistry;

  @Inject
  private WebService webService;

  @Inject
  private PolicyDefinitionService service;

  @Inject
  private JsonObjectValidatorRegistry validatorRegistry;

  @Inject
  private TypeManager typeManager;

  @Inject
  private JsonLd jsonLdService;

  public static final String CX_POLICY_2025_09_ODRL = "https://w3id.org/catenax/2025/9/policy/odrl.jsonld";
  private static final String PREFIX = "document" + File.separator;
  private static final Map<String, String> FILES = Map.of(
    CX_POLICY_2025_09_ODRL, PREFIX + "odrl.jsonld"
  );

  @Override
  public void initialize(ServiceExtensionContext context) {
    webService.registerResource(ApiContext.MANAGEMENT, new PolicyValidationApiController(validatorRegistry, transformerRegistry, service));
    webService.registerDynamicResource(ApiContext.MANAGEMENT, PolicyValidationApiController.class, new JerseyJsonLdInterceptor(jsonLdService, typeManager, JSON_LD, MANAGEMENT_SCOPE));

    FILES.entrySet().stream().map(this::mapToFile)
      .forEach(result -> result.onSuccess(entry -> jsonLdService.registerCachedDocument(entry.getKey(), entry.getValue().toURI()))
        .onFailure(failure -> monitor.warning("Failed to register cached json-ld document: " + failure.getFailureDetail())));
  }

  private Result<Map.Entry<String, File>> mapToFile(Map.Entry<String, String> fileEntry) {
    return getResourceFile(fileEntry.getValue())
      .map(file1 -> Map.entry(fileEntry.getKey(), file1));
  }

  @NotNull
  private Result<File> getResourceFile(String name) {
    try (var stream = getClass().getClassLoader().getResourceAsStream(name)) {
      if (stream == null) {
        return Result.failure(format("Cannot find resource %s", name));
      }

      var filename = Path.of(name).getFileName().toString();
      var parts = filename.split("\\.");
      var tempFile = Files.createTempFile(parts[0], "." + parts[1]);
      Files.copy(stream, tempFile, REPLACE_EXISTING);
      return Result.success(tempFile.toFile());
    } catch (Exception e) {
      return Result.failure(format("Cannot read resource %s: ", name));
    }
  }
}
