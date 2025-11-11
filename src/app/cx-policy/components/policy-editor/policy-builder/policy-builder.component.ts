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

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Action, AtomicConstraint, Permission, PolicyConfiguration, RuleType } from '../../../models/policy';
import { NgIf } from '@angular/common';
import { PermissionComponent } from './permission/permission.component';
import { FormsModule } from '@angular/forms';
import { RuleSets } from '../../../services/atomic-constraints';

@Component({
  selector: 'app-policy-builder',
  templateUrl: 'policy-builder.component.html',
  standalone: true,
  imports: [NgIf, PermissionComponent, FormsModule],
})
export class PolicyBuilderComponent {
  private _policyConfig!: PolicyConfiguration;

  currentPermission?: Permission;
  constraintTemplates?: AtomicConstraint[];

  @Input()
  get policyConfig() {
    return this._policyConfig;
  }
  set policyConfig(cfg: PolicyConfiguration) {
    this._policyConfig = cfg;
    this.currentPermission = this._selectFirstRule();
  }

  @Output() policyChange = new EventEmitter<PolicyConfiguration>();

  private _selectFirstRule(): Permission | undefined {
    if (this.policyConfig.policy.permissions.length > 0) {
      this.changeConstraintTemplates('Permission');
      return this.policyConfig.policy.permissions[0];
    } else if (this.policyConfig.policy.obligations.length > 0) {
      this.changeConstraintTemplates('Obligation');
      return this.policyConfig.policy.obligations[0];
    } else if (this.policyConfig.policy.prohibitions.length > 0) {
      this.changeConstraintTemplates('Prohibition');
      return this.policyConfig.policy.prohibitions[0];
    }
    return undefined;
  }

  changeConstraintTemplates(ruleType: RuleType) {
    switch (this.policyConfig.policy.type) {
      case Action.Access: {
        this.constraintTemplates = RuleSets.AccessPermissions();
        break;
      }
      case Action.Use: {
        switch (ruleType) {
          case 'Permission': {
            this.constraintTemplates = RuleSets.UsagePermissions();
            break;
          }
          case 'Obligation': {
            this.constraintTemplates = RuleSets.UsageObligations();
            break;
          }
          case 'Prohibition': {
            this.constraintTemplates = RuleSets.UsageProhibitions();
            break;
          }
        }
      }
    }
  }

  addRule(ruleType: RuleType) {
    const rule = new Permission(`New ${ruleType}`);
    rule.action = this.policyConfig.policy.type;
    switch (ruleType) {
      case 'Permission':
        this.policyConfig.policy.permissions.push(rule);
        break;
      case 'Obligation':
        this.policyConfig.policy.obligations.push(rule);
        break;
      case 'Prohibition':
        this.policyConfig.policy.prohibitions.push(rule);
        break;
    }
    this.onRuleSelectionChange(rule, ruleType);
    this.onRuleChange();
  }

  onRuleChange() {
    this.policyChange.emit(this.policyConfig);
  }

  onRuleSelectionChange(selection: Permission, ruleType: RuleType) {
    this.currentPermission = selection;
    this.changeConstraintTemplates(ruleType);
  }

  removeRule(target: Permission, ruleType: RuleType) {
    switch (ruleType) {
      case 'Permission':
        this.policyConfig.policy.permissions = this.policyConfig.policy.permissions.filter(item => item != target);
        break;
      case 'Obligation':
        this.policyConfig.policy.obligations = this.policyConfig.policy.obligations.filter(item => item != target);
        break;
      case 'Prohibition':
        this.policyConfig.policy.prohibitions = this.policyConfig.policy.prohibitions.filter(item => item != target);
        break;
    }
    if (target == this.currentPermission) {
      switch (ruleType) {
        case 'Permission':
          this.currentPermission = this.policyConfig.policy.permissions[0] ?? this._selectFirstRule();
          break;
        case 'Obligation':
          this.currentPermission = this.policyConfig.policy.obligations[0] ?? this._selectFirstRule();
          break;
        case 'Prohibition':
          this.currentPermission = this.policyConfig.policy.prohibitions[0] ?? this._selectFirstRule();
          break;
      }
    }
    this.policyChange.emit(this.policyConfig);
  }

  protected readonly Action = Action;
}
