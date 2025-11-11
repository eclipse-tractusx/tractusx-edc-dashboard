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

export class Permission {
  name?: string;
  action: Action = Action.Use;
  constraints: Constraint[] = [];

  constructor(name?: string) {
    this.name = name;
  }

  clone(): Permission {
    const perm = new Permission();
    perm.action = this.action;
    perm.name = this.name;
    perm.constraints = this.constraints.map(c => c.clone());
    return perm;
  }

  toString(): string {
    return `(${this.action.toString()}) constraints: [ ${this.constraints.map(c => c.toString()).join(',')} ]`;
  }
}

export class LogicalConstraint implements Constraint {
  operator: LogicalOperator = LogicalOperator.And;
  constraints: Constraint[] = [];

  clone(): LogicalConstraint {
    const cloned = new LogicalConstraint();
    cloned.operator = this.operator;
    cloned.constraints = this.constraints.map(c => c.clone());
    return cloned;
  }

  get_prefixes(): string[] {
    return this.constraints.flatMap(c => c.get_prefixes());
  }

  get_contexts(): string[] {
    return this.constraints.flatMap(c => c.get_contexts());
  }

  toString() {
    return `${this.operator} Constraint`;
  }
}

export interface RightOperand {
  name: string;
  operandType: 'string' | 'integer';
  legalText?: {
    obligation?: string;
    permission?: string;
    prohibition?: string;
    additionalInformation?: string;
  };
  const?: string | number;
  pattern?: RegExp;
  value?: string | number;
}

export class AtomicConstraint implements Constraint {
  leftOperand!: string;
  operator!: [Operator, ...Operator[]];
  selectedOperator: Operator;
  rightOperand!: RightOperand | RightOperand[];
  rightOperandValue: RightOperand | RightOperand[];
  contexts: string[] = [];
  prefixes: string[] = [];
  label?: string;
  constructor(leftOperand: string, operator: [string, ...string[]], rightOperand: RightOperand | RightOperand[]) {
    this.leftOperand = leftOperand;
    this.operator = operator.map(x => this._stringToOperator(x)) as [Operator, ...Operator[]];
    this.rightOperand = rightOperand;
    this.selectedOperator = this.operator[0];
    if (Array.isArray(rightOperand)) {
      this.rightOperandValue = [structuredClone((this.rightOperand as RightOperand[])[0])];
    } else {
      this.rightOperandValue = structuredClone(this.rightOperand);
    }
  }

  private _stringToOperator(str: string): Operator {
    try {
      return str as Operator;
    } catch (e) {
      throw new Error(`Unsupported operator "${str}": ${e}`);
    }
  }

  clone(): AtomicConstraint {
    const cloned = new AtomicConstraint(this.leftOperand, this.operator, this.rightOperand);
    cloned.contexts = this.contexts;
    cloned.label = this.label;
    cloned.prefixes = this.prefixes;
    cloned.rightOperandValue = structuredClone(this.rightOperandValue);
    cloned.selectedOperator = this.selectedOperator;
    return cloned;
  }

  get_prefixes(): string[] {
    return this.prefixes;
  }

  get_contexts(): string[] {
    return this.contexts;
  }

  get_label(): string {
    return this.label != null ? this.label : this.leftOperand;
  }

  with_context(ctx: string): AtomicConstraint {
    this.contexts.push(ctx);
    return this;
  }

  with_prefix(prefix: string): AtomicConstraint {
    this.prefixes.push(prefix);
    return this;
  }

  with_label(label: string): AtomicConstraint {
    this.label = label;
    return this;
  }

  mapRightOperand(): string | number | (string | number)[] {
    const operandToValue = (operand: RightOperand): string | number => {
      if (operand.const) return operand.const;
      if (operand.value) return operand.value;
      return '';
    };
    if (Array.isArray(this.rightOperandValue)) {
      return this.rightOperandValue.map(x => operandToValue(x));
    } else {
      return operandToValue(this.rightOperandValue);
    }
  }

  prettyRightOperandValue(): string | number {
    const mapped = this.mapRightOperand();
    const addQuotes = (x: string | number) => (typeof x === 'string' ? `"${x}"` : x);
    if (Array.isArray(mapped)) {
      return mapped.map(addQuotes).join(', ');
    } else {
      return addQuotes(mapped);
    }
  }

  toString() {
    return `Constraint ${camelCaseToWords(this.leftOperand)} - ${camelCaseToWords(this.selectedOperator.toString(), true)} - ${this.prettyRightOperandValue()}`;
  }
}

export function camelCaseToWords(str: string, upperCase?: boolean): string {
  const result = str.replace(/([a-z])([A-Z])/g, '$1 $2');
  return upperCase ? result.toUpperCase() : result;
}
export enum LogicalOperator {
  And = 'And',
  Or = 'Or',
}

export interface Constraint {
  clone(): Constraint;

  get_prefixes(): string[];
  get_contexts(): string[];
}

export enum Action {
  Use = 'use',
  Access = 'access',
}

export enum Operator {
  Eq = 'eq',
  Gt = 'gt',
  Gte = 'gteq',
  Lte = 'lteq',
  HasPart = 'hasPart',
  IsA = 'isA',
  IsAllOf = 'isAllOf',
  IsAnyOf = 'isAnyOf',
  IsNoneOf = 'isNoneOf',
  IsPartOf = 'isPartOf',
  Lt = 'lt',
  TermLteq = 'term-lteq',
  Neq = 'neq',
}

export class Policy {
  type: Action = Action.Use;
  permissions: Permission[] = [];
  obligations: Permission[] = [];
  prohibitions: Permission[] = [];

  clone(): Policy {
    const policy = new Policy();
    policy.permissions = this.permissions.map(perm => perm.clone());
    return policy;
  }
}

export class PolicyConfiguration {
  name: string;
  description?: string;
  policy: Policy;

  constructor(name: string) {
    this.name = name;
    this.policy = new Policy();
  }

  clone(): PolicyConfiguration {
    const config = new PolicyConfiguration(this.name + ' (Copy)');
    config.policy = this.policy.clone();

    return config;
  }
}

export interface ConstraintTemplate {
  name: string;
  multiple: boolean;
  factory: () => Constraint;
}

export enum OutputKind {
  Prefixed = 'Prefixed',
  Plain = 'Plain',
}

export type RuleType = 'Permission' | 'Obligation' | 'Prohibition';
