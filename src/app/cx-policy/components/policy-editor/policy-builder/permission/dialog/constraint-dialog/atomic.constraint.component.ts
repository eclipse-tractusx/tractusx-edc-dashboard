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

import { Component, EventEmitter, inject, Input, OnChanges, Output } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AtomicConstraint, camelCaseToWords, Operator, RightOperand } from '../../../../../../models/policy';
import { RightOperandComponent } from './right-operand.component';
import { DeleteConfirmComponent, ModalAndAlertService } from '@eclipse-edc/dashboard-core';

@Component({
  selector: 'app-atomic-constraint',
  templateUrl: './atomic.constraint.component.html',
  styleUrls: [],
  standalone: true,
  imports: [FormsModule, RightOperandComponent, ReactiveFormsModule],
})
export class AtomicConstraintComponent implements OnChanges {
  private readonly arrayOperators: Operator[] = [Operator.IsAllOf, Operator.IsAnyOf, Operator.IsNoneOf];
  private readonly modalService = inject(ModalAndAlertService);

  @Input() constraint!: AtomicConstraint;
  rightOperand?: RightOperand;
  rightOperands?: RightOperand[];
  selectedOperator: Operator = Operator.Eq;

  form = new FormGroup({});

  @Output() save = new EventEmitter<AtomicConstraint>();

  ngOnChanges() {
    this.selectedOperator = this.constraint.selectedOperator;
    if (Array.isArray(this.constraint.rightOperandValue)) {
      if (this.isArrayOperator()) {
        this.rightOperands = this.constraint.rightOperandValue;
      } else {
        this.rightOperand = this.constraint.rightOperandValue[0];
      }
    } else {
      this.rightOperand = this.constraint.rightOperandValue;
    }
  }

  isArrayOperator(op?: Operator): boolean {
    return this.arrayOperators.includes(op ?? this.selectedOperator);
  }

  onOperatorChange() {
    console.log('test');
    if (this.isArrayOperator() && !this.isArrayOperator(this.constraint.selectedOperator) && this.rightOperands) {
      const resetToSingleItem = () => {
        this.rightOperand = this.rightOperands![0];
        this.rightOperands = undefined;
        this.selectedOperator = this.constraint.selectedOperator;
      }
      if (this.rightOperands.length > 1) {
        this.modalService.openModal(DeleteConfirmComponent, {
          customText: 'All right operands except the first will be deleted.'
        }, {
          canceled: () => {
            this.constraint.selectedOperator = this.selectedOperator;
            this.modalService.closeModal();
          },
          confirm: resetToSingleItem
        })
      } else {
        resetToSingleItem();
      }
    } else if (!this.isArrayOperator() && this.isArrayOperator(this.constraint.selectedOperator) && this.rightOperand) {
      this.rightOperands = [structuredClone(this.rightOperand)];
      this.rightOperand = undefined;
      this.selectedOperator = this.constraint.selectedOperator;
    }
  }

  getRightOperands(): RightOperand[] | undefined {
    return Array.isArray(this.constraint.rightOperand) ? this.constraint.rightOperand : undefined;
  }

  onRightOperandChange(op: RightOperand, index: number) {
    if (this.rightOperands) {
      this.rightOperands[index] = op;
    } else {
      this.rightOperand = op;
    }
  }

  onRightOperandDelete(op: RightOperand) {
    this.rightOperands = this.rightOperands?.filter(x => x !== op);
  }

  addOperand(): void {
    if (Array.isArray(this.constraint.rightOperand)) {
      this.rightOperands?.push(structuredClone(this.constraint.rightOperand[0]));
    }
  }

  onSave(): void {
    this.constraint.rightOperandValue = this.rightOperands ?? this.rightOperand!;
    this.save.emit(this.constraint);
  }

  protected readonly camelCaseToWords = camelCaseToWords;
}
