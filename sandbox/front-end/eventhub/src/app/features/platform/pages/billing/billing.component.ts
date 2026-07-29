import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { PlatformLayoutComponent } from '../../../../core/layouts/platform-layout/platform-layout.component';
import { BillingTableRow, OrganizationRecord } from '../../../../core/models/platform.models';
import { PlatformDataService } from '../../../../core/services/platform-data.service';
import {
   DataTableComponent,
   DataTableRow,
   DataTableRowAction,
   DataTableSortState,
   DataTableToolbarAction
} from '../../../../shared/components/data-table/data-table.component';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import {
   InvoiceGeneratorCardsComponent,
   InvoiceGeneratorOrganizerOption
} from '../../../../shared/components/invoice-generator-cards/invoice-generator-cards.component';
import {
   FilterField,
   SearchFilterCardComponent
} from '../../../../shared/components/search-filter-card/search-filter-card.component';

interface InvoiceOrganizerOption extends InvoiceGeneratorOrganizerOption {
   organizerId: string;
   organizerName: string;
   latestInvoiceNumber: string;
   targetCycle: string;
   status: BillingTableRow['status'] | null;
   amountPhp: number;
}

@Component({
   selector: 'app-billing',
   standalone: true,
   imports: [
      PlatformLayoutComponent,
      SearchFilterCardComponent,
      DataTableComponent,
      InvoiceGeneratorCardsComponent,
      ModalComponent
   ],
   templateUrl: './billing.component.html',
   styleUrl: './billing.component.scss'
})
export class BillingComponent {
   private readonly currencyFormatter = new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
   });

   private readonly platformDataService = inject(PlatformDataService);

   private readonly billingRows = toSignal(this.platformDataService.getBillingTableRows(), {
      initialValue: [] as BillingTableRow[]
   });
   private readonly organizations = toSignal(this.platformDataService.getOrganizations(), {
      initialValue: [] as OrganizationRecord[]
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
   protected readonly isInvoiceModalOpen = signal<boolean>(false);
   protected readonly isOrganizerDropdownOpen = signal<boolean>(false);
   protected readonly selectedOrganizerId = signal<string | null>(null);

   protected readonly organizerOptions = computed<InvoiceOrganizerOption[]>(() => {
      const rows = this.billingRows();
      const organizations = this.organizations();

      return organizations
         .map((organization) => {
            const matchingRows = rows
               .filter((row) => row.organizerId === organization.id)
               .sort((leftRow, rightRow) => rightRow.issuedAt.localeCompare(leftRow.issuedAt));
            const latestRow = matchingRows[0] ?? null;

            return {
               organizerId: organization.id,
               organizerName: organization.name,
               latestInvoiceNumber: latestRow?.invoiceNumber ?? 'No invoice number',
               targetCycle: this.resolveTargetCycle(latestRow?.issuedAt ?? null),
               status: latestRow?.status ?? null,
               amountPhp: latestRow?.amountPhp ?? 0
            };
         })
         .filter((option) => option.latestInvoiceNumber !== 'No invoice number');
   });

   protected readonly selectedOrganizer = computed<InvoiceOrganizerOption | null>(() => {
      const selectedOrganizerId = this.selectedOrganizerId();
      const options = this.organizerOptions();

      if (!options.length || !selectedOrganizerId) {
         return null;
      }

      return options.find((option) => option.organizerId === selectedOrganizerId) ?? null;
   });

   protected readonly selectedCycle = computed(
      () => this.selectedOrganizer()?.targetCycle ?? 'MM/YY'
   );

   protected readonly selectedAmount = computed(() => this.selectedOrganizer()?.amountPhp ?? 0);
   protected readonly selectedInvoiceNumber = computed(
      () => this.selectedOrganizer()?.latestInvoiceNumber ?? 'INV-0000'
   );
   protected readonly selectedStatus = computed(
      () => this.selectedOrganizer()?.status ?? 'pending'
   );

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
   }

   protected onSortChanged(sortState: DataTableSortState): void {
      this.sortState.set(sortState);
   }

   protected onPageChanged(page: number): void {
      this.currentPage.set(page);
   }

   protected onRowAction(event: { actionKey: string; row: DataTableRow }): void {
      const invoiceNumber = String(event.row['invoiceNumber'] ?? 'record');
   }

   protected openInvoiceModal(): void {
      if (!this.selectedOrganizer()) {
         return;
      }

      this.isInvoiceModalOpen.set(true);
   }

   protected closeInvoiceModal(): void {
      this.isInvoiceModalOpen.set(false);
   }

   protected toggleOrganizerDropdown(): void {
      this.isOrganizerDropdownOpen.update((open) => !open);
   }

   protected selectOrganizer(organizerId: string): void {
      this.selectedOrganizerId.set(organizerId);
      this.isOrganizerDropdownOpen.set(false);
   }

   protected getSelectedOrganizerLabel(): string {
      const selectedOrganizer = this.selectedOrganizer();

      if (!selectedOrganizer) {
         return 'Select organizer';
      }

      return selectedOrganizer.organizerName;
   }

   protected getSelectedOrganizerInvoiceLabel(): string {
      const selectedOrganizer = this.selectedOrganizer();

      if (!selectedOrganizer) {
         return 'No invoice number';
      }

      return selectedOrganizer.latestInvoiceNumber;
   }

   private resolveTargetCycle(issuedAt: string | null): string {
      if (!issuedAt) {
         return 'MM/YY';
      }

      const date = new Date(issuedAt);
      if (Number.isNaN(date.getTime())) {
         return 'MM/YY';
      }

      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      const year = String(date.getUTCFullYear()).slice(-2);
      return `${month}/${year}`;
   }

   protected formatCurrencyPhp(amount: number): string {
      return this.currencyFormatter.format(Number(amount ?? 0));
   }

   protected confirmInvoice(): void {
      this.closeInvoiceModal();
   }
}
