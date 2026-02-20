import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  computed,
  Directive,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild
} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {MatButton} from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {ActivatedRoute} from '@angular/router';
import {tables} from '../../consts';
import {DataService} from '../../services/data.service';
import {TableConfig} from '../../models';
import {Subject, takeUntil} from 'rxjs';
import {DynamicForm} from '../../components/dynamic-form/dynamic-form';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatProgressSpinner} from '@angular/material/progress-spinner';

@Directive()
abstract class BaseDialogAction implements OnInit, OnDestroy {
  @ViewChild(DynamicForm) dynamicForm!: DynamicForm;

  protected readonly dialog = inject(MatDialog);
  protected readonly snackBar = inject(MatSnackBar);
  protected readonly dataService = inject(DataService);
  protected readonly dialogRef = inject(MatDialogRef);
  protected readonly cdr = inject(ChangeDetectorRef);
  protected readonly data = inject<{ tableIndex: number; id?: number | string }>(MAT_DIALOG_DATA);

  protected destroy$ = new Subject<void>();
  protected isSubmitting = signal(false);
  protected tableConfig = computed<TableConfig>(() => tables[this.data.tableIndex]);

  ngOnInit() {
    this.initialize();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected abstract initialize(): void;

  protected abstract getSubmitObservable(formValue: any): any;

  isFormValid(): boolean {
    return this.dynamicForm?.isValid() ?? false;
  }

  openCreateDialog(tableIndex: number) {
    this.dialog.open(HomePageCreateAction, {
      data: {tableIndex},
      width: '600px',
      maxHeight: '90vh'
    }).afterClosed().subscribe(result => {
      if (result && this.dynamicForm?.form) {
        this.dynamicForm.setupSelectableFields();
        this.cdr.detectChanges();
      }
    });
  }

  openEditDialog(event: { tableIndex: number, id: number | string }) {
    const targetTable = tables[event.tableIndex];

    this.dialog.open(HomePageEditAction, {
      data: event,
      width: '600px',
      maxHeight: '90vh'
    }).afterClosed().subscribe(result => {
      if (result && this.dynamicForm?.form) {
        const column = this.tableConfig().columns.find(
          col => col.type === 'selectable' && col.tableIndexToSelectFrom === event.tableIndex
        );

        if (column) {
          this.dataService.get(result.id, targetTable.entityUrl).subscribe({
            next: (updatedEntity) => {
              this.dynamicForm.form.patchValue({
                [column.propertyName]: updatedEntity.id,
                [column.propertyName + '_display']: updatedEntity
              });

              const displayControl = this.dynamicForm.form.get(column.propertyName + '_display');
              if (displayControl) {
                displayControl.updateValueAndValidity({emitEvent: false});
              }

              this.cdr.detectChanges();
            },
            error: (err) => {
              console.error('[EditDialog] Failed to load updated entity:', err);
            }
          });
        }

        this.dynamicForm.setupSelectableFields();
      }
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (!this.isFormValid() || this.isSubmitting()) return;

    this.isSubmitting.set(true);
    const formValue = this.dynamicForm.getFormValue();
    console.log(this.dynamicForm.initialValues);
    console.log(formValue);

    this.getSubmitObservable(formValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result: any) => {
          this.isSubmitting.set(false);
          this.dialogRef.close(result);
        },
        error: (err: any) => {
          console.log("SUBMIT ERROR", err);
          this.isSubmitting.set(false);
          const errorMessage = err.error?.message || err.message || 'Operation failed';
          this.snackBar.open(errorMessage, 'OK', {
            horizontalPosition: 'start',
            verticalPosition: 'bottom',
            duration: 5000
          });
        }
      });
  }
}

@Component({
  selector: 'app-home-page-actions',
  standalone: true,
  imports: [MatIcon, MatButton],
  template: `
    <button matButton="tonal" (click)="openDialog()">
      <mat-icon>add</mat-icon>
      Add {{ selectedTable.title.toLowerCase() }} entry
    </button>
  `
})
export class HomePageActions implements AfterViewInit {
  private readonly dialog = inject(MatDialog);
  private readonly activatedRoute = inject(ActivatedRoute);
  protected tableIndex = signal(0);

  ngAfterViewInit() {
    this.activatedRoute.paramMap.subscribe(
      (paramMap) => this.tableIndex.set(Number(paramMap.get('tableIndex')))
    );
  }

  get selectedTable() {
    return tables[this.tableIndex()];
  }

  openDialog() {
    this.dialog.open(HomePageCreateAction, {
      data: {tableIndex: this.tableIndex()},
      width: '600px',
      maxHeight: '90vh'
    });
  }
}

@Component({
  selector: 'app-home-page-create-action',
  standalone: true,
  imports: [
    MatDialogContent,
    MatDialogTitle,
    MatDialogActions,
    MatButton,
    DynamicForm
  ],
  styleUrl: 'home-page-actions.css',
  template: `
    <h2 mat-dialog-title>Create {{ tableConfig().title }}</h2>
    <mat-dialog-content>
      <app-dynamic-form
        [columns]="tableConfig().columns"
        [showButtons]="true"
        (addButtonClick)="openCreateDialog($event)"
        (editButtonClick)="openEditDialog($event)"
      />
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button
        mat-raised-button
        color="primary"
        [disabled]="!isFormValid() || isSubmitting()"
        (click)="onSubmit()">
        {{ isSubmitting() ? 'Creating...' : 'Create' }}
      </button>
    </mat-dialog-actions>
  `
})
export class HomePageCreateAction extends BaseDialogAction {
  protected initialize(): void {
  }

  protected getSubmitObservable(formValue: any) {
    return this.dataService.create(formValue, this.tableConfig().entityUrl);
  }
}

@Component({
  selector: 'app-home-page-edit-action',
  standalone: true,
  imports: [
    MatDialogContent,
    MatDialogTitle,
    MatDialogActions,
    MatButton,
    MatProgressSpinner,
    DynamicForm,
    DynamicForm
  ],
  styleUrl: 'home-page-actions.css',
  template: `
    <h2 mat-dialog-title>Edit {{ tableConfig().title }}</h2>
    <mat-dialog-content>
      @if (isLoading()) {
        <div class="loading-container">
          <mat-progress-spinner mode="indeterminate" diameter="50"></mat-progress-spinner>
          <p>Loading data...</p>
        </div>
      } @else if (loadError()) {
        <div class="error-container">
          <p>{{ loadError() }}</p>
          <button mat-raised-button color="primary" (click)="loadEntity()">Retry</button>
        </div>
      } @else if (initialData()) {
        <app-dynamic-form
          [columns]="tableConfig().columns"
          [initialValues]="initialData()"
          [showButtons]="true"
          (addButtonClick)="openCreateDialog($event)"
          (editButtonClick)="openEditDialog($event)"
        />
      }
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button
        mat-raised-button
        color="primary"
        [disabled]="!isFormValid() || isSubmitting() || isLoading() || !!loadError()"
        (click)="onSubmit()">
        {{ isSubmitting() ? 'Saving...' : 'Save' }}
      </button>
    </mat-dialog-actions>
  `
})
export class HomePageEditAction extends BaseDialogAction {
  protected isLoading = signal(true);
  protected loadError = signal<string | null>(null);
  protected initialData = signal<any | null>(null);

  protected initialize(): void {
    this.loadEntity();
  }

  protected getSubmitObservable(formValue: any) {
    return this.dataService.update(this.data.id!, formValue, this.tableConfig().entityUrl);
  }

  protected loadEntity() {
    if (!this.data.id) {
      this.loadError.set('No ID provided');
      this.isLoading.set(false);
      return;
    }

    this.isLoading.set(true);
    this.loadError.set(null);

    this.dataService.get(this.data.id, this.tableConfig().entityUrl)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          this.initialData.set(result);
          this.isLoading.set(false);
          this.cdr.detectChanges();
        },
        error: (err) => {
          const errorMessage = err.error?.message || err.message || 'Failed to load data';
          this.loadError.set(errorMessage);
          this.isLoading.set(false);
          this.snackBar.open(errorMessage, 'OK', {
            horizontalPosition: 'start',
            verticalPosition: 'bottom',
            duration: 5000
          });
        }
      });
  }
}
