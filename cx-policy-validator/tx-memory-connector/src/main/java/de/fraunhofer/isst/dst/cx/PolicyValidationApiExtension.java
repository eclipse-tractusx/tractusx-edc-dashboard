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
import org.eclipse.edc.spi.system.ServiceExtension;
import org.eclipse.edc.spi.system.ServiceExtensionContext;
import org.eclipse.edc.spi.types.TypeManager;
import org.eclipse.edc.transform.spi.TypeTransformerRegistry;
import org.eclipse.edc.validator.spi.JsonObjectValidatorRegistry;
import org.eclipse.edc.web.jersey.providers.jsonld.JerseyJsonLdInterceptor;
import org.eclipse.edc.web.spi.WebService;
import org.eclipse.edc.web.spi.configuration.ApiContext;

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

  @Override
  public void initialize(ServiceExtensionContext context) {
    webService.registerResource(ApiContext.MANAGEMENT, new PolicyValidationApiController(validatorRegistry, transformerRegistry, service));
    webService.registerDynamicResource(ApiContext.MANAGEMENT, PolicyValidationApiController.class, new JerseyJsonLdInterceptor(jsonLdService, typeManager, JSON_LD, MANAGEMENT_SCOPE));
  }
}
