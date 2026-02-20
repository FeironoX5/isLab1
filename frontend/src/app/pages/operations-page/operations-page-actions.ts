import {Component, computed, inject, OnDestroy, signal, ViewChild} from '@angular/core';
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
import {operations} from '../../consts';
import {OperationConfig, ParamConfig} from '../../models';
import {DynamicForm} from '../../components/dynamic-form/dynamic-form';
import {Observable, Subject, takeUntil, throwError} from 'rxjs';
import {HttpParams} from '@angular/common/http';
import {DataService} from '../../services/data.service';

@Component({
  selector: 'app-operations-page-actions',
  standalone: true,
  imports: [MatIcon, MatButton],
  template: `
    <button matButton="tonal" (click)="openDialog(0)">
      <mat-icon>info</mat-icon>
      Statistics
    </button>
  `
})
export class OperationsPageActions {
  private readonly dialog = inject(MatDialog);

  openDialog(operationIndex: number) {
    this.dialog.open(OperationsPageAction, {
      data: operations[operationIndex],
      width: '600px',
      maxHeight: '90vh'
    });
  }
}

@Component({
  selector: 'app-operations-page-action',
  standalone: true,
  imports: [
    DynamicForm,
    MatDialogContent,
    MatDialogTitle,
    MatDialogActions,
    MatButton
  ],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>

    <mat-dialog-content>
      <span style="margin-bottom: 15px; display: block;">{{ data.description }}</span>

      <app-dynamic-form
        #dynamicForm
        [columns]="params()"
        [showButtons]="false"
      ></app-dynamic-form>
      @if (result()) {
        <div style="background: #2a2a2a; padding: 20px;">
          {{ result() }}
        </div>
      }
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button
        mat-raised-button
        color="primary"
        [disabled]="!isFormValid() || isSubmitting()"
        (click)="onSubmit()"
      >
        {{ isSubmitting() ? 'Executing...' : 'Execute' }}
      </button>
    </mat-dialog-actions>
  `
})
export class OperationsPageAction implements OnDestroy {
  @ViewChild(DynamicForm) dynamicForm!: DynamicForm;

  protected readonly data = inject<OperationConfig>(MAT_DIALOG_DATA);
  protected readonly dialogRef = inject(MatDialogRef);
  protected readonly dataService = inject(DataService);

  protected isSubmitting = signal(false);
  protected params = computed(() => {
    return this.data.params.map((param: ParamConfig) => param.column);
  });
  protected result = signal<string>("");

  private destroy$ = new Subject<void>();

  isFormValid(): boolean {
    return this.dynamicForm?.isValid() ?? false;
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (!this.isFormValid() || this.isSubmitting()) return;

    this.isSubmitting.set(true);
    const formValue = this.dynamicForm.getFormValue();

    this.executeOperation(formValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result: any) => {
          this.isSubmitting.set(false);
          this.result.set(JSON.stringify(result, null, 2));
        },
        error: (err: any) => {
          console.error(err);
          this.isSubmitting.set(false);
          const errorMessage = err.error?.message || err.message || 'Operation failed';
          this.result.set(errorMessage);
        }
      });
  }

  private executeOperation(formValue: any): Observable<any> {
    const {method, path, params} = this.data;

    let finalPath = path;
    const pathParams = params.filter(p => p.in === 'path');
    pathParams.forEach(param => {
      const value = formValue[param.column.propertyName];
      finalPath = finalPath.replace(`{${param.column.propertyName}}`, value);
    });

    const queryParams = params.filter(p => p.in === 'query');
    let httpParams = new HttpParams();
    queryParams.forEach(param => {
      const value = formValue[param.column.propertyName];
      if (value !== undefined && value !== null && value !== '') {
        httpParams = httpParams.set(param.column.propertyName, value.toString());
      }
    });

    switch (method) {
      case 'GET':
        return this.dataService['http'].get(
          `${DataService.httpBase}${finalPath}`,
          {params: httpParams}
        );

      case 'DELETE':
        return this.dataService['http'].delete(
          `${DataService.httpBase}${finalPath}`,
          {params: httpParams}
        );

      case 'POST':
        return this.dataService['http'].post(
          `${DataService.httpBase}${finalPath}`,
          formValue,
          {params: httpParams}
        );

      case 'PUT':
        return this.dataService['http'].put(
          `${DataService.httpBase}${finalPath}`,
          formValue,
          {params: httpParams}
        );

      default:
        return throwError(() => new Error(`Unsupported HTTP method: ${method}`));
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
