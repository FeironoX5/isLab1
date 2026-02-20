import {
  AfterViewInit,
  Component,
  computed,
  effect,
  EventEmitter,
  inject,
  OnDestroy,
  Output,
  signal,
  untracked,
  ViewChild
} from '@angular/core';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatSort, MatSortHeader} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable
} from '@angular/material/table';
import {MatChip, MatChipTrailingIcon} from '@angular/material/chips';
import {MatIcon} from '@angular/material/icon';
import {Subject, takeUntil} from 'rxjs';
import {MatTooltip} from '@angular/material/tooltip';
import {MatButtonToggle, MatButtonToggleChange, MatButtonToggleGroup} from '@angular/material/button-toggle';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {DataService, SubscribeParams} from '../../services/data.service';
import {tables} from '../../consts';
import {ColumnConfig} from '../../models';
import {formatEnumValue} from '../../utils';
import {MatCard} from '@angular/material/card';
import {DynamicForm} from '../../components/dynamic-form/dynamic-form';
import {MatDialog} from '@angular/material/dialog';
import {HomePageEditAction} from './home-page-actions';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    MatProgressSpinner,
    MatButton,
    MatTable,
    MatSort,
    MatPaginator,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatCellDef,
    MatHeaderCellDef,
    MatHeaderRow,
    MatRow,
    MatHeaderRowDef,
    MatRowDef,
    MatSortHeader,
    MatChip,
    MatIcon,
    MatChipTrailingIcon,
    MatTooltip,
    MatButtonToggleGroup,
    FormsModule,
    MatButtonToggle,
    MatCard,
    DynamicForm,
    MatIconButton,
  ],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css'
})
export class HomePage implements AfterViewInit, OnDestroy {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(DynamicForm) dynamicForm!: DynamicForm;
  @Output() filtersChange = new EventEmitter<SubscribeParams>();

  protected readonly router = inject(Router);
  protected readonly dialog = inject(MatDialog);
  protected readonly snackBar = inject(MatSnackBar);
  protected readonly activatedRoute = inject(ActivatedRoute);
  protected readonly dataService = inject(DataService);

  sortableColumns = computed(() => tables[this.tableIndex()].columns.filter(c => c.sortable));
  private watchSubscription$ = new Subject<void>();
  private destroy$ = new Subject<void>();
  private isViewReady = signal<boolean>(false);

  protected tableIndex = signal<number>(0);
  protected entityData = signal<any | null>(null);
  protected resultsLimit = signal<number>(10);
  protected resultsTotal = signal<number>(0);
  protected results = signal<any[]>([]);
  protected isFilterOpened = signal<boolean>(false);
  protected currentFilters = signal<Record<string, string> | undefined>(undefined);
  protected tooltipData = signal<Map<string, any>>(new Map());

  protected readonly displayedColumnKeys = computed(() => {
    const base = tables[this.tableIndex()].columns.map((c) => c.propertyName as string);
    return tables[this.tableIndex()].readOnly ? base : base.concat('editAction', 'deleteAction');
  });

  constructor() {
    effect(() => {
      if (!this.isViewReady()) return;
      const selectedEntityUrl = tables[this.tableIndex()].entityUrl;
      untracked(() => {
        this.dataService.unwatch();
        this.dataService.entityUrl.set(selectedEntityUrl);
        this.tooltipData.set(new Map());
        this.currentFilters.set(undefined);
        setTimeout(() => this.dynamicForm?.reset(), 0);
        setTimeout(() => this.watchResults(), 200);
      });
    });
  }

  get tables() {
    return tables;
  }

  ngAfterViewInit() {
    this.activatedRoute.paramMap.pipe(takeUntil(this.destroy$)).subscribe((paramMap) => {
      this.tableIndex.set(Number(paramMap.get('tableIndex')) || 0);
    });

    this.sort.sortChange.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.paginator.pageIndex = 0;
      this.watchResults();
    });

    this.paginator.page.pipe(takeUntil(this.destroy$)).subscribe(() => this.watchResults());

    this.isViewReady.set(true);
    this.watchResults();
  }

  watchResults() {
    if (!this.paginator || !this.isViewReady()) return;
    const params: SubscribeParams = {
      page: this.paginator.pageIndex,
      size: this.resultsLimit(),
      sort: this.sort.direction === '' ? undefined : {column: this.sort.active, dir: this.sort.direction},
      filters: this.currentFilters()
    };

    this.watchSubscription$.next();
    this.dataService.watch(params).pipe(takeUntil(this.destroy$), takeUntil(this.watchSubscription$)).subscribe({
      next: (res) => {
        this.results.set(res.items);
        this.resultsTotal.set(res.total_count);
      }
    });
  }

  updateTableIndex(e: MatButtonToggleChange) {
    const index = e.value;
    this.paginator.pageIndex = 0;
    this.sort.active = '';
    this.sort.direction = '';
    this.tableIndex.set(index);
    this.router.navigate(['/home', index], {replaceUrl: true});
  }

  ngOnDestroy() {
    this.watchSubscription$.next();
    this.watchSubscription$.complete();
    this.destroy$.next();
    this.destroy$.complete();
    this.dataService.unwatch();
  }

  formatCellValue(col: ColumnConfig, value: any): string {
    if (value === null || value === undefined) return '-';
    if (col.dataType === 'date') return new Date(value).toLocaleString();
    if (col.dataType === 'boolean') return value ? 'Yes' : 'No';
    if (col.type === 'enum') return formatEnumValue(value);
    return value.toString();
  }

  onCellMouseEnter(rowIndex: number, col: ColumnConfig, value: any): void {
    if (col.type !== 'selectable' || !value || col.tableIndexToSelectFrom === undefined) return;
    const cacheKey = `${rowIndex}_${col.propertyName}`;
    if (this.tooltipData().has(cacheKey)) return;
    const targetTable = tables[col.tableIndexToSelectFrom];

    const newMap = new Map(this.tooltipData());
    newMap.set(cacheKey, 'loading');
    this.tooltipData.set(newMap);

    this.dataService.get(value, targetTable.entityUrl).pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        const updatedMap = new Map(this.tooltipData());
        updatedMap.set(cacheKey, data);
        this.tooltipData.set(updatedMap);
      },
      error: () => {
        const updatedMap = new Map(this.tooltipData());
        updatedMap.set(cacheKey, {error: 'Failed to load data'});
        this.tooltipData.set(updatedMap);
      }
    });
  }

  getTooltipText(rowIndex: number, col: ColumnConfig, value: any): string {
    if (col.type !== 'selectable' || !value || col.tableIndexToSelectFrom === undefined) return '';
    const data = this.tooltipData().get(`${rowIndex}_${col.propertyName}`);
    if (!data) return 'Hover to load...';
    if (data === 'loading') return 'Loading...';
    if (data.error) return data.error;
    return tables[col.tableIndexToSelectFrom].displayFormatter(data);
  }

  toggleFilters() {
    this.isFilterOpened.update(x => !x);
  }

  onApplyFilters() {
    const filters = this.dynamicForm.getFilledValues();
    this.currentFilters.set(Object.keys(filters).length > 0 ? filters : undefined);
    this.paginator.pageIndex = 0;
    this.watchResults();
  }

  onClearFilters() {
    this.dynamicForm?.reset();
    this.currentFilters.set(undefined);
    this.paginator.pageIndex = 0;
    this.watchResults();
  }

  openDialog(id: number) {
    this.dialog.open(HomePageEditAction, {
      data: {tableIndex: this.tableIndex(), id},
      width: '600px',
      maxHeight: '90vh'
    }).afterClosed().pipe(takeUntil(this.destroy$)).subscribe((result) => {
      if (result) this.watchResults();
    });
  }

  delete(id: number) {
    this.dataService.delete(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.snackBar.open(`Object #${id} deleted`, 'OK', {duration: 5000});
        this.watchResults();
      },
      error: (err) => this.snackBar.open(err?.error?.message ?? 'Delete failed', 'OK', {duration: 5000})
    });
  }
}
