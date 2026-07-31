import { inject, signal, computed, Service } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { Employee, EmployeePatchRequest, EmployeeQueryParams } from '../models/employee.model';
import { PagedResponse, ErrorResponse } from '../models/common.model';

@Service()
export class EmployeeService {
   private readonly http = inject(HttpClient);
   private readonly baseUrl = '/api/employees';

   readonly employees = signal<Employee[]>([]);
   readonly selectedEmployee = signal<Employee | null>(null);
   readonly totalElements = signal<number>(0);
   readonly totalPages = signal<number>(0);
   readonly currentPage = signal<number>(0);
   readonly loading = signal<boolean>(false);
   readonly error = signal<string | null>(null);

   readonly hasEmployees = computed(() => this.employees().length > 0);
   readonly isLastPage = computed(() => this.currentPage() >= this.totalPages() - 1);

   getEmployees(params?: EmployeeQueryParams): Observable<PagedResponse<Employee>> {
      this.loading.set(true);
      this.error.set(null);

      let httpParams = new HttpParams();
      if (params) {
         Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
               httpParams = httpParams.set(key, String(value));
            }
         });
      }

      return this.http.get<PagedResponse<Employee>>(this.baseUrl, { params: httpParams }).pipe(
         tap((response) => {
            this.employees.set(response.content ?? []);
            this.totalElements.set(response.totalElements ?? 0);
            this.totalPages.set(response.totalPages ?? 0);
            this.currentPage.set(response.page ?? 0);
            this.loading.set(false);
         }),
         catchError((err: ErrorResponse) => this.handleError(err))
      );
   }

   getEmployeeById(id: string): Observable<Employee> {
      this.loading.set(true);
      this.error.set(null);

      return this.http.get<Employee>(`${this.baseUrl}/${id}`).pipe(
         tap((employee) => {
            this.selectedEmployee.set(employee);
            this.loading.set(false);
         }),
         catchError((err: ErrorResponse) => this.handleError(err))
      );
   }

   createEmployee(employee: Employee): Observable<Employee> {
      this.loading.set(true);
      this.error.set(null);

      return this.http.post<Employee>(this.baseUrl, employee).pipe(
         tap((newEmployee) => {
            this.employees.update((list) => [newEmployee, ...list]);
            this.totalElements.update((count) => count + 1);
            this.loading.set(false);
         }),
         catchError((err: ErrorResponse) => this.handleError(err))
      );
   }

   updateEmployee(id: string, employee: Employee): Observable<Employee> {
      this.loading.set(true);
      this.error.set(null);

      return this.http.put<Employee>(`${this.baseUrl}/${id}`, employee).pipe(
         tap((updated) => {
            this.updateLocalEmployee(id, updated);
            this.loading.set(false);
         }),
         catchError((err: ErrorResponse) => this.handleError(err))
      );
   }

   patchEmployee(id: string, patch: EmployeePatchRequest): Observable<Employee> {
      this.loading.set(true);
      this.error.set(null);

      return this.http.patch<Employee>(`${this.baseUrl}/${id}`, patch).pipe(
         tap((updated) => {
            this.updateLocalEmployee(id, updated);
            this.loading.set(false);
         }),
         catchError((err: ErrorResponse) => this.handleError(err))
      );
   }

   deleteEmployee(id: string): Observable<void> {
      this.loading.set(true);
      this.error.set(null);

      return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
         tap(() => {
            this.employees.update((list) => list.filter((e) => e.id !== id));
            this.totalElements.update((count) => Math.max(0, count - 1));
            if (this.selectedEmployee()?.id === id) {
               this.selectedEmployee.set(null);
            }
            this.loading.set(false);
         }),
         catchError((err: ErrorResponse) => this.handleError(err))
      );
   }

   private updateLocalEmployee(id: string, updated: Employee): void {
      this.employees.update((list) => list.map((e) => (e.id === id ? updated : e)));
      if (this.selectedEmployee()?.id === id) {
         this.selectedEmployee.set(updated);
      }
   }

   private handleError(errorRes: ErrorResponse): Observable<never> {
      const message =
         errorRes.message ?? 'An unexpected error occurred while processing the employee.';
      this.error.set(message);
      this.loading.set(false);
      return throwError(() => new Error(message));
   }
}
