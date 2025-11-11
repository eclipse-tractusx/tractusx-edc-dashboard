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

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AtomicConstraint, camelCaseToWords, RightOperand } from '../../../../../../models/policy';
import { RightOperandComponent } from './right-operand.component';

@Component({
  selector: 'app-atomic-constraint',
  templateUrl: './atomic.constraint.component.html',
  styleUrls: [],
  standalone: true,
  imports: [FormsModule, RightOperandComponent, ReactiveFormsModule],
})
export class AtomicConstraintComponent implements OnInit {
  @Input() constraint!: AtomicConstraint;
  rightOperand?: RightOperand;
  rightOperands?: RightOperand[];

  form = new FormGroup({});

  @Output() save = new EventEmitter<AtomicConstraint>();

  ngOnInit() {
    if (Array.isArray(this.constraint.rightOperandValue)) {
      this.rightOperands = this.constraint.rightOperandValue;
    } else {
      this.rightOperand = this.constraint.rightOperandValue;
    }
  }

  getRightOperands(): RightOperand[] {
    return this.constraint.rightOperand as RightOperand[];
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
