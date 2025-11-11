/*
 * Copyright (c) 2023 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)
 * Copyright (c) 2023 Contributors to the Eclipse Foundation
 * Copyright (c) 2025 Fraunhofer-Gesellschaft zur Förderung der angewandten Forschung e.V.
 *
 * See the NOTICE file(s) distributed with this work for additional
 * information regarding copyright ownership.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Apache License, Version 2.0 which is available at
 * https://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*eslint-disable @typescript-eslint/no-explicit-any*/

import {
  Action,
  AtomicConstraint,
  Constraint,
  LogicalConstraint,
  Permission,
  PolicyConfiguration,
} from '../../models/policy';
import { JsonLdFormatter } from '../format.service';
import { PolicyService } from '../policy.service';

const CONTEXTS = [
  'https://w3id.org/catenax/2025/9/policy/odrl.jsonld',
  'https://w3id.org/catenax/2025/9/policy/context.jsonld',
];
const NESTED_CONTEXT = { '@vocab': 'https://w3id.org/edc/v0.0.1/ns/' };

export const policyRequestTemplate = {
  '@context': {},
  '@type': 'PolicyDefinition',
  '@id': 'CHANGE-ME',
  policy: {},
};

const policyHeader = {
  '@type': 'Set',
  '@context': {},
};

export const emptyPolicy = Object.assign(policyRequestTemplate, {
  policy: {
    ...policyHeader,
    permission: [],
  },
});

export class PlainFormatter implements JsonLdFormatter {
  policyService: PolicyService;
  constructor(policyService: PolicyService) {
    this.policyService = policyService;
  }

  toJsonLd(policyConfig: PolicyConfiguration): object {
    const permission = policyConfig.policy.permissions.map(this.mapPermission.bind(this));
    const obligation =
      policyConfig.policy.type === Action.Use
        ? policyConfig.policy.obligations.map(this.mapPermission.bind(this))
        : undefined;
    const prohibition =
      policyConfig.policy.type === Action.Use
        ? policyConfig.policy.prohibitions.map(this.mapPermission.bind(this))
        : undefined;
    const additionalNamespaces = this.policyService.namespacesFor(policyConfig);
    const additionalContexts = this.policyService.contextsFor(policyConfig);

    const context = [...CONTEXTS, ...additionalContexts];

    return Object.assign(emptyPolicy, {
      '@context': Object.assign(NESTED_CONTEXT, additionalNamespaces),
      policy: { ...policyHeader, '@context': context, permission, obligation, prohibition },
    });
  }

  mapPermission(permission: Permission): object {
    let constraint: Constraint[];
    if (permission.constraints.length > 1) {
      const logical = new LogicalConstraint();
      permission.constraints.forEach(x => logical.constraints.push(x));
      constraint = [logical];
    } else {
      constraint = permission.constraints;
    }
    return {
      action: permission.action.toString(),
      constraint: constraint.map(x => this.mapConstraint(x)),
    };
  }

  mapConstraint(constraint: Constraint): object {
    if (constraint instanceof AtomicConstraint) {
      const leftOperand = constraint.leftOperand.toString();
      return {
        leftOperand,
        operator: constraint.selectedOperator.toString(),
        rightOperand: constraint.mapRightOperand(),
      };
    } else if (constraint instanceof LogicalConstraint) {
      const obj: any = {};
      obj[constraint.operator.toString().toLowerCase()] = constraint.constraints.map(this.mapConstraint.bind(this));
      return obj;
    }

    return {};
  }
}
