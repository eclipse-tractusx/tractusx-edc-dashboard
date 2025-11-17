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

import { Component, OnDestroy, OnInit } from '@angular/core';
import { PolicyBuilderComponent } from './policy-builder/policy-builder.component';
import {
  Action,
  AtomicConstraint,
  camelCaseToWords,
  Constraint,
  OutputKind,
  Permission,
  Policy,
  PolicyConfiguration,
  RightOperand,
} from '../../models/policy';
import { FormsModule } from '@angular/forms';
import { AsyncPipe, NgFor } from '@angular/common';
import { FormatService } from '../../services/format.service';
import { PolicyService } from '../../services/policy.service';
import { PolicyTemplates } from '../../services/atomic-constraints';
import { DashboardStateService, EdcClientService } from '@eclipse-edc/dashboard-core';
import { filter, finalize, firstValueFrom, Subject, take, takeUntil } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { JsonObject } from '@angular-devkit/core';

@Component({
  selector: 'app-policy-editor',
  templateUrl: './policy-editor.component.html',
  standalone: true,
  imports: [PolicyBuilderComponent, FormsModule, NgFor, AsyncPipe],
})
export class PolicyEditorComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  text!: string;

  outputFormats: string[];
  policyType: Action = Action.Use;
  selectedPolicyType: Action = Action.Use;
  template: PolicyConfiguration;
  templateWarning = false;

  currentFormat: OutputKind;

  showLegalText = true;
  legalTextKinds: string[] = [];

  isValid = true;
  validationLoading = false;
  validationEndpointUrl = '';
  validationErrorText?: string;

  constructor(
    public formatService: FormatService,
    public policyService: PolicyService,
    public readonly edcClientService: EdcClientService,
    private readonly stateService: DashboardStateService,
    private http: HttpClient,
  ) {
    this.currentFormat = OutputKind.Plain;
    this.template = PolicyTemplates.UsageTemplate();
    this.updateLegalTextKinds(Action.Use);
    this.outputFormats = policyService.supportedOutput();

    stateService.currentEdcConfig$
      .pipe(
        takeUntil(this.destroy$),
        filter(x => x !== undefined),
      )
      .subscribe(config => {
        this.validationEndpointUrl = config.managementUrl.concat('/v3/validation/policydefinition');
      });

    edcClientService.isHealthy$
      .pipe(
        filter(x => x),
        take(1),
      )
      .subscribe(async () => await this._validatePolicy());
  }

  async ngOnInit() {
    await this.updateJsonText(this.template, this.currentFormat);
  }

  updateLegalTextKinds(type: Action) {
    if (type === 'use') {
      this.legalTextKinds = ['permissions', 'obligations', 'prohibitions'];
    } else {
      this.legalTextKinds = ['permissions'];
    }
  }

  private isSamePolicy(a: PolicyConfiguration, b: PolicyConfiguration): boolean {
    return (
      this.formatService.formatPolicy(this.formatService.toJsonLd(a, this.currentFormat)) ===
      this.formatService.formatPolicy(this.formatService.toJsonLd(b, this.currentFormat))
    );
  }

  private async switchPolicyType(type: Action): Promise<void> {
    this.policyType = type;
    if (type === Action.Use) {
      this.template = PolicyTemplates.UsageTemplate();
    } else {
      this.template = PolicyTemplates.AccessTemplate();
    }
    this.updateLegalTextKinds(type);
    await this.updateJsonText(this.template, this.currentFormat);
  }

  cancelTypeChange(): void {
    this.selectedPolicyType = this.policyType;
    this.templateWarning = false;
  }

  async acceptTypeChange(): Promise<void> {
    await this.switchPolicyType(this.selectedPolicyType);
    this.templateWarning = false;
  }

  async onTypeChange() {
    if (this.selectedPolicyType !== this.policyType) {
      if (
        this.isSamePolicy(
          this.template,
          this.policyType === Action.Use ? PolicyTemplates.UsageTemplate() : PolicyTemplates.AccessTemplate(),
        )
      ) {
        await this.switchPolicyType(this.selectedPolicyType);
      } else {
        this.templateWarning = true;
      }
    }
  }

  async onConfigSelectionChange(cfg: PolicyConfiguration) {
    await this.updateJsonText(cfg, this.currentFormat);
  }

  async onConfigChange(cfg: PolicyConfiguration): Promise<void> {
    await this.updateJsonText(cfg, this.currentFormat);
  }

  private async _validatePolicy(): Promise<void> {
    if ((await firstValueFrom(this.edcClientService.isHealthy$)) && this.validationEndpointUrl) {
      this.validationLoading = true;
      this.http
        .post<JsonObject>(this.validationEndpointUrl, JSON.parse(this.text))
        .pipe(finalize(() => (this.validationLoading = false)))
        .subscribe({
          next: result => {
            this.isValid = result['isValid'] as boolean;
            if (result['errors']) {
              this.validationErrorText = JSON.stringify(result['errors']);
            } else {
              this.validationErrorText = undefined;
            }
          },
          error: err => {
            this.isValid = false;
            this.validationErrorText = err.error[0].message;
          },
        });
    }
  }

  async updateJsonText(cfg: PolicyConfiguration, format: OutputKind) {
    const ld = this.formatService.toJsonLd(cfg, format);
    this.text = this.formatService.formatPolicy(ld);
    await this._validatePolicy();
  }

  async copyPolicyToClipboard(): Promise<void> {
    await navigator.clipboard.writeText(this.text);
  }

  getPolicyPermission(kind: string): Permission[] {
    return this.template.policy[kind as keyof Policy] as Permission[];
  }

  getAtomicConstraints(list: Constraint[]) {
    return list as AtomicConstraint[];
  }

  getRightOperandArray(operand: RightOperand | RightOperand[]): RightOperand[] {
    const arr = Array.isArray(operand) ? operand : [operand];
    const seen = new Set<string>();
    return arr.filter(op => {
      if (seen.has(op.name)) {
        return false;
      }
      seen.add(op.name);
      return true;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected readonly Action = Action;
  protected readonly camelCaseToWords = camelCaseToWords;
}
