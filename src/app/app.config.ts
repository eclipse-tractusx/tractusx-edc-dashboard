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

import {
  ApplicationConfig,
  inject,
  Injectable,
  provideAppInitializer,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { APP_BASE_HREF } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
class BaseHrefService {
  private baseHref = '/';

  constructor(private readonly http: HttpClient) {}

  async load() {
    try {
      this.baseHref = (
        await firstValueFrom(this.http.get('config/APP_BASE_HREF.txt', { responseType: 'text' }))
      ).replace(/\n/g, '');
    } catch {
      console.debug('No base href config found. Default is "/"');
    }
  }

  get(): string {
    return this.baseHref;
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideAppInitializer(() => inject(BaseHrefService).load()),
    {
      provide: APP_BASE_HREF,
      useFactory: (svc: BaseHrefService) => svc.get(),
      deps: [BaseHrefService],
    },
  ],
};
