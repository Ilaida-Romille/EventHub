import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { map } from 'rxjs/operators';
import { PrivilegedLayoutComponent } from '../../../../core/layouts/privileged-layout/privileged-layout.component';
import {
   DataTableComponent,
   DataTableRow,
   DataTableRowAction,
   DataTableSortState,
   DataTableToolbarAction
} from '../../../../shared/components/data-table/data-table.component';
import {
   FilterField,
   SearchFilterCardComponent
} from '../../../../shared/components/search-filter-card/search-filter-card.component';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { EmployeeService } from '../../../../core/services/employee.service';
import { Employee } from '../../../../core/models/employee.model';

export interface EmployeeTableRow {
   id: string;
   name: string;
   email: string;
   company: string;
   department: string;
   jobTitle: string;
   [key: string]: string | number | undefined;
}

export interface PaginatedEmployeeResponse {
   content: Employee[];
   page: number;
   size: number;
   totalElements: number;
   totalPages: number;
   last: boolean;
}

@Component({
   selector: 'app-organizer-employees',
   imports: [
      ReactiveFormsModule,
      PrivilegedLayoutComponent,
      SearchFilterCardComponent,
      DataTableComponent,
      ModalComponent
   ],
   templateUrl: './organizer-employees.component.html',
   styleUrl: './organizer-employees.component.scss'
})
export class OrganizerEmployeesComponent {
   private readonly http = inject(HttpClient);
   protected readonly employeeService = inject(EmployeeService);
   private readonly fb = inject(FormBuilder);

   protected readonly isCreateModalOpen = signal<boolean>(false);
   protected employeeForm: FormGroup = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      company: ['', Validators.required],
      department: ['', Validators.required],
      jobTitle: ['', Validators.required]
   });

   private readonly employeeRows = toSignal(
      this.http.get<PaginatedEmployeeResponse>('/api/employees').pipe(
         map((response) =>
            (response.content ?? []).map((emp) => ({
               id: emp.id ?? '',
               name: `${emp.firstName ?? ''} ${emp.lastName ?? ''}`.trim(),
               email: emp.email ?? '',
               company: emp.company ?? '',
               department: emp.department ?? '',
               jobTitle: emp.jobTitle ?? ''
            }))
         )
      ),
      { initialValue: [] as EmployeeTableRow[] }
   );

   protected readonly tableActions: DataTableToolbarAction[] = [
      { key: 'new', label: 'New' },
      { key: 'edit', label: 'Edit' },
      { key: 'delete', label: 'Delete' }
   ];

   protected readonly rowActions: DataTableRowAction[] = [{ key: 'view', label: 'View' }];

   protected readonly employeeFilters: FilterField[] = [
      {
         id: 'employees-search-query',
         label: 'Search Employee',
         type: 'text',
         placeholder: 'Search by name, email, department, or job title...',
         wide: true
      }
   ];

   protected readonly employeeColumns = [
      { key: 'name', label: 'Name', sortable: true },
      { key: 'email', label: 'Email', sortable: true },
      { key: 'jobTitle', label: 'Job Title', sortable: true },
      { key: 'department', label: 'Department', sortable: true },
      { key: 'company', label: 'Company', sortable: true }
   ];

   protected readonly currentPage = signal<number>(1);
   protected readonly pageSize = signal<number>(6);
   protected readonly sortState = signal<DataTableSortState>({
      columnKey: 'name',
      direction: 'asc'
   });
   protected readonly activeFilters = signal<Record<string, string>>({});

   protected onToolbarActionTriggered(actionKey: string): void {
      if (actionKey === 'new') {
         this.openCreateModal();
      }
   }

   protected openCreateModal(): void {
      this.employeeForm.reset();
      this.isCreateModalOpen.set(true);
   }

   protected closeCreateModal(): void {
      this.isCreateModalOpen.set(false);
      this.employeeForm.reset();
   }

   protected onCreateEmployeeSubmit(): void {
      if (this.employeeForm.invalid) {
         this.employeeForm.markAllAsTouched();
         return;
      }

      const newEmployee: Employee = {
         ...this.employeeForm.value,
         registeredEventIds: []
      };

      this.employeeService.createEmployee(newEmployee).subscribe({
         next: () => {
            this.closeCreateModal();
         }
      });
   }

   protected readonly filteredRows = computed(() => {
      const rows = this.employeeRows();
      const filters = this.activeFilters();
      const search = (filters['employees-search-query'] ?? '').toLowerCase();

      if (!search) {
         return rows;
      }

      return rows.filter((row) => {
         const name = (row.name ?? '').toLowerCase();
         const email = (row.email ?? '').toLowerCase();
         const department = (row.department ?? '').toLowerCase();
         const jobTitle = (row.jobTitle ?? '').toLowerCase();

         return (
            name.includes(search) ||
            email.includes(search) ||
            department.includes(search) ||
            jobTitle.includes(search)
         );
      });
   });

   protected readonly sortedRows = computed(() => {
      const rows = [...this.filteredRows()];
      const sortState = this.sortState();

      rows.sort((leftRow, rightRow) => {
         const leftValue = leftRow[sortState.columnKey as keyof typeof leftRow];
         const rightValue = rightRow[sortState.columnKey as keyof typeof rightRow];

         if (typeof leftValue === 'number' && typeof rightValue === 'number') {
            return sortState.direction === 'asc' ? leftValue - rightValue : rightValue - leftValue;
         }

         const leftText = String(leftValue ?? '').toLowerCase();
         const rightText = String(rightValue ?? '').toLowerCase();
         const comparison = leftText.localeCompare(rightText);
         return sortState.direction === 'asc' ? comparison : -comparison;
      });

      return rows;
   });

   protected readonly pagedRows = computed(() => {
      const rows = this.sortedRows();
      const pageSize = this.pageSize();
      const start = (this.currentPage() - 1) * pageSize;
      return rows.slice(start, start + pageSize);
   });

   protected readonly totalItems = computed<number>(() => this.sortedRows().length);

   protected onFiltersSubmitted(filters: Record<string, string>): void {
      this.activeFilters.set(filters);
      this.currentPage.set(1);
   }

   protected onSortChanged(sortState: DataTableSortState): void {
      this.sortState.set(sortState);
   }

   protected onPageChanged(page: number): void {
      this.currentPage.set(page);
   }

   protected onRowAction(event: { actionKey: string; row: DataTableRow }): void {
      const employeeName = String(event.row['name'] ?? 'employee');
   }
}
