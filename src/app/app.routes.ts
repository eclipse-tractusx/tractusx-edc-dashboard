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

import { Routes } from '@angular/router';
import { PolicyEditorComponent } from './cx-policy/components/policy-editor/policy-editor.component';

export const routes: Routes = [
  {
    path: '',
    component: PolicyEditorComponent,
  } /*,
  {
    path: 'home',
    loadComponent: () => import('@eclipse-edc/dashboard-core/home').then(m => m.HomeViewComponent),
  },
  {
    path: 'assets',
    loadComponent: () => import('@eclipse-edc/dashboard-core/assets').then(m => m.AssetViewComponent),
  },
  {
    path: 'policies',
    loadComponent: () => import('@eclipse-edc/dashboard-core/policies').then(m => m.PolicyViewComponent),
  },
  {
    path: 'contract-definitions',
    loadComponent: () =>
      import('@eclipse-edc/dashboard-core/contract-definitions').then(m => m.ContractDefinitionsViewComponent),
  },
  {
    path: 'contracts',
    loadComponent: () => import('@eclipse-edc/dashboard-core/transfer').then(m => m.ContractViewComponent),
  },

  {
    path: 'catalog',
    loadComponent: () => import('@eclipse-edc/dashboard-core/catalog').then(m => m.CatalogViewComponent),
  },
  {
    path: 'transfer-history',
    loadComponent: () => import('@eclipse-edc/dashboard-core/transfer').then(m => m.TransferHistoryViewComponent),
  },
  {
    path: 'policy-builder',
    component: PolicyEditorComponent,
  },*/,
];
