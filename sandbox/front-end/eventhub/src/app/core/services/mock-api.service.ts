import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, delay, shareReplay } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MockApiService {
   private readonly http = inject(HttpClient);
   private readonly basePath = '/mock-data';

   fetchResource<T>(relativePath: string): Observable<T> {
      return this.http
         .get<T>(`${this.basePath}/${relativePath}`)
         .pipe(delay(180), shareReplay({ bufferSize: 1, refCount: true }));
   }
}
