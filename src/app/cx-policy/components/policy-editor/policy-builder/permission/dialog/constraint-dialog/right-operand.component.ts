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

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { camelCaseToWords, RightOperand } from '../../../../../../models/policy';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-right-operand',
  templateUrl: './right-operand.component.html',
  imports: [ReactiveFormsModule, FormsModule],
})
export class RightOperandComponent implements OnInit {
  @Input() rightOperand!: RightOperand;
  @Input() selectTypes?: RightOperand[];
  @Input() parentFormGroup!: FormGroup;
  @Input() deleteButton = false;

  @Output() changed = new EventEmitter<RightOperand>();
  @Output() deleted = new EventEmitter<RightOperand>();

  readonly uuid: string = crypto.randomUUID();

  ngOnInit() {
    this.updateFormGroup();
  }

  getOperandType(): string {
    return this.rightOperand.operandType === 'string' ? 'string' : 'number';
  }

  onOperandChange(op: RightOperand) {
    this.changed.emit(op);
    this.updateFormGroup();
  }

  onDelete(): void {
    if (this.parentFormGroup.get(this.uuid)) {
      this.parentFormGroup.removeControl(this.uuid);
    }
    this.deleted.emit(this.rightOperand);
  }

  compare(a: RightOperand, b: RightOperand): boolean {
    return a && b && a.name === b.name;
  }

  updateFormGroup() {
    if (this.rightOperand.pattern) {
      this.parentFormGroup.setControl(
        this.uuid,
        new FormControl(this.rightOperand.value ?? '', [
          Validators.required,
          Validators.pattern(this.rightOperand.pattern),
        ]),
      );
    } else if (this.parentFormGroup.get(this.uuid)) {
      this.parentFormGroup.removeControl(this.uuid);
    }
  }

  protected readonly camelCaseToWords = camelCaseToWords;
}
