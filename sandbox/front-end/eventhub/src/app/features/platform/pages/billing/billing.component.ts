import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { PlatformLayoutComponent } from '../../../../core/layouts/platform-layout/platform-layout.component';
import { BillingTableRow } from '../../../../core/models/platform.models';
import { PlatformDataService } from '../../../../core/services/platform-data.service';
import {
   DataTableComponent,
   DataTableRow,
   DataTableRowAction,
   DataTableSortState,
   DataTableToolbarAction
} from '../../../../shared/components/data-table/data-table.component';
import { InvoiceGeneratorCardsComponent } from '../../../../shared/components/invoice-generator-cards/invoice-generator-cards.component';
import {
   FilterField,
   SearchFilterCardComponent
} from '../../../../shared/components/search-filter-card/search-filter-card.component';

@Component({
   selector: 'app-billing',
   standalone: true,
   imports: [
      PlatformLayoutComponent,
      SearchFilterCardComponent,
      DataTableComponent,
      InvoiceGeneratorCardsComponent
   ],
   templateUrl: './billing.component.html',
   styleUrl: './billing.component.scss'
})
export class BillingComponent {
   private readonly platformDataService = inject(PlatformDataService);

   private readonly billingRows = toSignal(this.platformDataService.getBillingTableRows(), {
      initialValue: [] as BillingTableRow[]
   });

   protected readonly tableActions: DataTableToolbarAction[] = [
      { key: 'new', label: 'New' },
      { key: 'edit', label: 'Edit' },
      { key: 'delete', label: 'Delete' },
      { key: 'export', label: 'Export' },
      { key: 'view', label: 'View' }
   ];

   protected readonly rowActions: DataTableRowAction[] = [
      { key: 'open', label: 'Open' },
      { key: 'remind', label: 'Send Reminder' }
   ];

   protected readonly billingFilters: FilterField[] = [
      {
         id: 'billing-search-query',
         label: 'Search by organizer/invoice number',
         type: 'text',
         placeholder: 'Enter organizers or invoice numbers...',
         wide: true
      },
      { id: 'billing-from-date', label: 'From', type: 'month' },
      { id: 'billing-to-date', label: 'To', type: 'month' }
   ];

   protected readonly billingColumns = [
      { key: 'invoiceNumber', label: 'Invoice #', sortable: true },
      { key: 'organizerName', label: 'Organizer', sortable: true },
      { key: 'period', label: 'Period', sortable: true },
      {
         key: 'amountPhp',
         label: 'Amount (PHP)',
         sortable: true,
         align: 'end' as const,
         kind: 'amount' as const
      },
      { key: 'status', label: 'Status', sortable: true, kind: 'badge' as const }
   ];

   protected readonly currentPage = signal<number>(1);
   protected readonly pageSize = signal<number>(5);
   protected readonly sortState = signal<DataTableSortState>({
      columnKey: 'invoiceNumber',
      direction: 'asc'
   });
   protected readonly activeFilters = signal<Record<string, string>>({});
   protected readonly lastInteraction = signal<string>('Ready');

   protected readonly filteredRows = computed(() => {
      const rows = this.billingRows();
      const filters = this.activeFilters();
      const search = (filters['billing-search-query'] ?? '').toLowerCase();
      const fromMonth = filters['billing-from-date'] ?? '';
      const toMonth = filters['billing-to-date'] ?? '';

      return rows.filter((row) => {
         const searchMatch =
            search.length === 0 ||
            row.invoiceNumber.toLowerCase().includes(search) ||
            row.organizerName.toLowerCase().includes(search);
         const fromMatch = fromMonth.length === 0 || row.period >= fromMonth;
         const toMatch = toMonth.length === 0 || row.period <= toMonth;
         return searchMatch && fromMatch && toMatch;
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
      this.lastInteraction.set('Filters applied');
   }

   protected onSortChanged(sortState: DataTableSortState): void {
      this.sortState.set(sortState);
      this.lastInteraction.set(`Sorted by ${sortState.columnKey}`);
   }

   protected onPageChanged(page: number): void {
      this.currentPage.set(page);
   }

   protected onToolbarAction(action: DataTableToolbarAction['key']): void {
      this.lastInteraction.set(`Toolbar action: ${action}`);
   }

   protected onRowAction(event: { actionKey: string; row: DataTableRow }): void {
      const invoiceNumber = String(event.row['invoiceNumber'] ?? 'record');
      this.lastInteraction.set(`${event.actionKey} executed for ${invoiceNumber}`);
   }
}
