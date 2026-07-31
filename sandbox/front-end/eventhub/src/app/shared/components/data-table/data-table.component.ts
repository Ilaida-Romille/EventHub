import { Component, computed, input, output, signal } from '@angular/core';
import { LucideIconComponent } from '../lucide-icon/lucide-icon.component';

export interface DataTableColumn {
   key: string;
   label: string;
   sortable?: boolean;
   align?: 'start' | 'center' | 'end';
   kind?: 'text' | 'badge' | 'amount' | 'person';
}

export type DataTableRow = Record<string, string | number | undefined>;

export type DataTableSortDirection = 'asc' | 'desc';

export interface DataTableSortState {
   columnKey: string;
   direction: DataTableSortDirection;
}

export interface DataTableToolbarAction {
   key: 'new' | 'edit' | 'delete' | 'export' | 'view';
   label: string;
}

export interface DataTableRowAction {
   key: string;
   label: string;
   tone?: 'default' | 'danger';
}

const DEFAULT_TOOLBAR_ACTIONS: DataTableToolbarAction[] = [
   { key: 'new', label: 'New' },
   { key: 'edit', label: 'Edit' },
   { key: 'delete', label: 'Delete' },
   { key: 'export', label: 'Export' },
   { key: 'view', label: 'View' }
];

@Component({
   selector: 'app-data-table',
   imports: [LucideIconComponent],
   templateUrl: './data-table.component.html',
   styleUrl: './data-table.component.scss'
})
export class DataTableComponent {
   private readonly currencyFormatter = new Intl.NumberFormat('en-PH');

   readonly tableId = input.required<string>();
   readonly columns = input.required<DataTableColumn[]>();
   readonly rows = input.required<DataTableRow[]>();
   readonly rowIdKey = input<string>('id');
   readonly totalItems = input<number>(0);
   readonly currentPage = input<number>(1);
   readonly pageSize = input<number>(10);
   readonly sortState = input<DataTableSortState | null>(null);
   readonly toolbarActions = input<DataTableToolbarAction[]>(DEFAULT_TOOLBAR_ACTIONS);
   readonly rowActions = input<DataTableRowAction[]>([]);

   readonly toolbarActionTriggered = output<DataTableToolbarAction['key']>();
   readonly rowActionTriggered = output<{ actionKey: string; row: DataTableRow }>();
   readonly sortChanged = output<DataTableSortState>();
   readonly pageChanged = output<number>();
   readonly selectionChanged = output<string[]>();

   protected readonly selectedRowIds = signal<Set<string>>(new Set<string>());

   protected readonly totalPages = computed<number>(() => {
      const pageSize = this.pageSize();
      const totalItems = this.totalItems();

      if (pageSize <= 0) {
         return 1;
      }

      return Math.max(1, Math.ceil(totalItems / pageSize));
   });

   protected readonly visiblePageNumbers = computed<number[]>(() => {
      const pageCount = this.totalPages();
      const activePage = this.currentPage();

      if (pageCount <= 5) {
         return Array.from({ length: pageCount }, (_, index) => index + 1);
      }

      const startPage = Math.max(1, activePage - 2);
      const endPage = Math.min(pageCount, startPage + 4);
      const normalizedStart = Math.max(1, endPage - 4);

      return Array.from(
         { length: endPage - normalizedStart + 1 },
         (_, index) => normalizedStart + index
      );
   });

   protected readonly showingCountText = computed<string>(() => {
      const total = this.totalItems();
      if (total === 0) {
         return '0 records';
      }

      const from = (this.currentPage() - 1) * this.pageSize() + 1;
      const to = Math.min(total, this.currentPage() * this.pageSize());
      return `${from} to ${to} of ${total} records`;
   });

   protected isBadgeTone(value: string | number | undefined, tone: string): boolean {
      return String(value).toLowerCase() === tone;
   }

   protected getDisplayValue(row: DataTableRow, column: DataTableColumn): string | number {
      const value = row[column.key];

      if (value === undefined) {
         return '--';
      }

      if (column.kind === 'amount' && typeof value === 'number') {
         return this.currencyFormatter.format(value);
      }

      return value;
   }

   protected getBadgeLabel(value: string | number | undefined): string {
      if (value === undefined) {
         return '--';
      }

      const normalized = String(value).toLowerCase();
      if (normalized.length === 0) {
         return '--';
      }

      return normalized.replace(/_/g, ' ').replace(/\b\w/g, (match) => match.toUpperCase());
   }

   protected isCurrentSort(columnKey: string, direction: DataTableSortDirection): boolean {
      const sortState = this.sortState();

      if (!sortState) {
         return false;
      }

      return sortState.columnKey === columnKey && sortState.direction === direction;
   }

   protected onSortRequested(column: DataTableColumn): void {
      if (!column.sortable) {
         return;
      }

      const sortState = this.sortState();
      const nextDirection: DataTableSortDirection =
         sortState?.columnKey === column.key && sortState.direction === 'asc' ? 'desc' : 'asc';

      this.sortChanged.emit({ columnKey: column.key, direction: nextDirection });
   }

   protected onPageSelected(page: number): void {
      if (page < 1 || page > this.totalPages() || page === this.currentPage()) {
         return;
      }

      this.pageChanged.emit(page);
   }

   protected onRowAction(actionKey: string, row: DataTableRow): void {
      this.rowActionTriggered.emit({ actionKey, row });
   }

   protected onToolbarAction(actionKey: DataTableToolbarAction['key']): void {
      this.toolbarActionTriggered.emit(actionKey);
   }

   protected isAllRowsSelected(): boolean {
      const rows = this.rows();
      if (rows.length === 0) {
         return false;
      }

      return rows.every((row, index) => this.selectedRowIds().has(this.resolveRowId(row, index)));
   }

   protected isRowSelected(row: DataTableRow, index: number): boolean {
      return this.selectedRowIds().has(this.resolveRowId(row, index));
   }

   protected toggleSelectAll(checked: boolean): void {
      if (!checked) {
         this.selectedRowIds.set(new Set<string>());
         this.selectionChanged.emit([]);
         return;
      }

      const ids = this.rows().map((row, index) => this.resolveRowId(row, index));
      this.selectedRowIds.set(new Set(ids));
      this.selectionChanged.emit(ids);
   }

   protected toggleRowSelection(row: DataTableRow, index: number, checked: boolean): void {
      const nextSelection = new Set(this.selectedRowIds());
      const rowId = this.resolveRowId(row, index);

      if (checked) {
         nextSelection.add(rowId);
      } else {
         nextSelection.delete(rowId);
      }

      this.selectedRowIds.set(nextSelection);
      this.selectionChanged.emit(Array.from(nextSelection));
   }

   private resolveRowId(row: DataTableRow, index: number): string {
      const rawRowId = row[this.rowIdKey()];
      return typeof rawRowId === 'string' && rawRowId.length > 0 ? rawRowId : `${index}`;
   }
}
