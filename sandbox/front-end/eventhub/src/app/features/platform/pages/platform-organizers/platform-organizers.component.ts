import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { PrivilegedLayoutComponent } from '../../../../core/layouts/privileged-layout/privileged-layout.component';
import { OrganizerTableRow } from '../../../../core/models/platform.model';
import { PlatformDataService } from '../../../../core/services/platform-data.service';
import { DataTableComponent } from '../../../../shared/components/data-table/data-table.component';
import {
   DataTableRow,
   DataTableRowAction,
   DataTableSortState,
   DataTableToolbarAction
} from '../../../../shared/components/data-table/data-table.component';
import {
   FilterField,
   SearchFilterCardComponent
} from '../../../../shared/components/search-filter-card/search-filter-card.component';

@Component({
   selector: 'app-platform-organizers',
   standalone: true,
   imports: [PrivilegedLayoutComponent, SearchFilterCardComponent, DataTableComponent],
   templateUrl: './platform-organizers.component.html',
   styleUrl: './platform-organizers.component.scss'
})
export class PlatformOrganizersComponent {
   private readonly platformDataService = inject(PlatformDataService);

   private readonly organizerRows = toSignal(this.platformDataService.getOrganizerTableRows(), {
      initialValue: [] as OrganizerTableRow[]
   });

   protected readonly tableActions: DataTableToolbarAction[] = [
      { key: 'new', label: 'New' },
      { key: 'edit', label: 'Edit' },
      { key: 'delete', label: 'Delete' },
      { key: 'export', label: 'Export' },
      { key: 'view', label: 'View' }
   ];

   protected readonly rowActions: DataTableRowAction[] = [
      { key: 'view', label: 'View' },
      { key: 'change_status', label: 'Change Status' }
   ];

   protected readonly organizerFilters: FilterField[] = [
      {
         id: 'organizers-search-query',
         label: 'Search by company name',
         type: 'text',
         placeholder: 'Enter company name...',
         wide: true
      },
      {
         id: 'organizers-status-filter',
         label: 'Status',
         type: 'select',
         options: [
            { value: '', label: 'All Statuses' },
            { value: 'active', label: 'Active' },
            { value: 'suspended', label: 'Suspended' },
            { value: 'pending', label: 'Pending' }
         ]
      }
   ];

   protected readonly organizerColumns = [
      { key: 'name', label: 'Company Name', sortable: true },
      { key: 'events', label: '# Events', sortable: true, align: 'end' as const },
      { key: 'status', label: 'Status', sortable: true, kind: 'badge' as const },
      { key: 'accountLead', label: 'Account Lead', sortable: true }
   ];

   protected readonly currentPage = signal<number>(1);
   protected readonly pageSize = signal<number>(6);
   protected readonly sortState = signal<DataTableSortState>({
      columnKey: 'name',
      direction: 'asc'
   });
   protected readonly activeFilters = signal<Record<string, string>>({});

   protected readonly filteredRows = computed(() => {
      const rows = this.organizerRows();
      const filters = this.activeFilters();
      const search = (filters['organizers-search-query'] ?? '').toLowerCase();
      const status = (filters['organizers-status-filter'] ?? '').toLowerCase();

      return rows.filter((row) => {
         const searchMatch = search.length === 0 || row.name.toLowerCase().includes(search);
         const statusMatch = status.length === 0 || row.status === status;
         return searchMatch && statusMatch;
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
      const organizerName = String(event.row['name'] ?? 'organizer');
   }
}
