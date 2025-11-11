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
import {
  AtomicConstraint,
  camelCaseToWords,
  Constraint,
  LogicalConstraint,
  Permission,
} from '../../../../models/policy';
import { FormsModule } from '@angular/forms';
import { PolicyService } from '../../../../services/policy.service';
import { ModalAndAlertService } from '@eclipse-edc/dashboard-core';
import { AtomicConstraintComponent } from './dialog/constraint-dialog/atomic.constraint.component';

@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  standalone: true,
  imports: [FormsModule],
})
export class PermissionComponent {
  @Input() permission!: Permission;
  actions: string[];

  @Output()
  permissionChange = new EventEmitter<void>();

  @Input() constraints: AtomicConstraint[] = [];

  constructor(
    policyService: PolicyService,
    readonly modalService: ModalAndAlertService,
  ) {
    this.actions = policyService.actions();
  }

  getConstraintType(constraint: Constraint): 'atomic' | 'logical' {
    return constraint instanceof AtomicConstraint ? 'atomic' : 'logical';
  }

  getSubConstraints(constraint: Constraint): Constraint[] {
    return (constraint as LogicalConstraint).constraints;
  }

  addConstraint(constraint: Constraint, parent: undefined | Constraint = undefined) {
    this.editConstraint(constraint, true, parent);
  }

  deleteConstraint(constraint: Constraint, parent: undefined | Constraint = undefined) {
    if (parent) {
      (parent as LogicalConstraint).constraints = (parent as LogicalConstraint).constraints.filter(
        x => x !== constraint,
      );
    } else {
      this.permission.constraints = this.permission.constraints.filter(x => x !== constraint);
    }
    this.permissionChange.emit();
  }

  editConstraint(constraint: Constraint, addNew = false, parent: undefined | Constraint = undefined) {
    const onResult = (result: Constraint) => {
      const list = parent ? (parent as LogicalConstraint).constraints : this.permission.constraints;
      if (result != null) {
        const idx = list.indexOf(constraint);
        if (idx != -1) {
          list[idx] = result;
        } else if (addNew) {
          list.push(result);
        }
        this.permissionChange.emit();
      }
      this.modalService.closeModal();
    };
    if (constraint instanceof AtomicConstraint) {
      this.modalService.openModal(
        AtomicConstraintComponent,
        {
          constraint: constraint.clone(),
        },
        {
          save: onResult,
        },
        undefined,
        () => this.modalService.closeModal(),
      );
    } else if (constraint instanceof LogicalConstraint) {
      onResult(constraint);
      /*this.modalService.openModal(
        LogicalConstraintDialogComponent,
        {
          constraint: constraint,
          constraints: this.constraints.filter(c => !c.multiple),
        },
        {
          canceled: () => this.modalService.closeModal(),
          save: onResult,
        },
      )*/
    }
  }

  protected readonly camelCaseToWords = camelCaseToWords;
}
