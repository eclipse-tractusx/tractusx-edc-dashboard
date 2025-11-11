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

import jakarta.json.JsonObject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import org.eclipse.edc.connector.controlplane.api.management.policy.model.PolicyValidationResult;
import org.eclipse.edc.connector.controlplane.policy.spi.PolicyDefinition;
import org.eclipse.edc.connector.controlplane.services.spi.policydefinition.PolicyDefinitionService;
import org.eclipse.edc.spi.EdcException;
import org.eclipse.edc.transform.spi.TypeTransformerRegistry;
import org.eclipse.edc.validator.spi.JsonObjectValidatorRegistry;
import org.eclipse.edc.web.spi.exception.InvalidRequestException;
import org.eclipse.edc.web.spi.exception.ValidationFailureException;

import java.util.ArrayList;

import static jakarta.ws.rs.core.MediaType.APPLICATION_JSON;
import static org.eclipse.edc.connector.controlplane.policy.spi.PolicyDefinition.EDC_POLICY_DEFINITION_TYPE;

@Consumes(APPLICATION_JSON)
@Produces(APPLICATION_JSON)
@Path("/v3/validation/policydefinition")
public class PolicyValidationApiController {
  private final JsonObjectValidatorRegistry validatorRegistry;
  private final TypeTransformerRegistry transformerRegistry;
  private final PolicyDefinitionService service;

  public PolicyValidationApiController(
    JsonObjectValidatorRegistry validatorRegistry,
    TypeTransformerRegistry transformerRegistry,
    PolicyDefinitionService service
  ) {
    this.validatorRegistry = validatorRegistry;
    this.transformerRegistry = transformerRegistry.forContext("management-api");
    this.service = service;
  }

  @POST
   public JsonObject validatePolicyDefinitionV3(JsonObject request) {
    validatorRegistry.validate(EDC_POLICY_DEFINITION_TYPE, request)
      .orElseThrow(ValidationFailureException::new);

    var policyDefinition = transformerRegistry.transform(request, PolicyDefinition.class)
      .orElseThrow(InvalidRequestException::new);

    var messages = new ArrayList<String>();

    var result = service.validate(policyDefinition.getPolicy())
      .onFailure(f -> messages.addAll(f.getMessages()));

    var validationResult = new PolicyValidationResult(result.succeeded(), messages);

    return transformerRegistry.transform(validationResult, JsonObject.class)
      .orElseThrow(f -> new EdcException("Error creating response body: " + f.getFailureDetail()));
  }
}
