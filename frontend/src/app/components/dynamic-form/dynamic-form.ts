import {
  Component,
  inject,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  OnDestroy,
  signal,
  SimpleChanges
} from '@angular/core';
import {ColumnConfig} from '../../models';
import {formatEnumValue} from '../../utils';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {debounceTime, distinctUntilChanged, Observable, of, startWith, Subject, takeUntil, catchError} from 'rxjs';
import {DataService} from '../../services/data.service';
import {map, switchMap} from 'rxjs/operators';
import {tables} from '../../consts';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {MatError, MatFormField, MatLabel, MatSuffix} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatAutocomplete, MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {MatProgressBar} from '@angular/material/progress-bar';
import {AsyncPipe} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {MatSelect, MatOption} from '@angular/material/select';

@Component({
  selector: 'app-dynamic-form',
  imports: [
    ReactiveFormsModule,
    MatSlideToggle,
    MatFormField,
    MatInput,
    MatError,
    MatLabel,
    MatSelect,
    MatOption,
    MatAutocomplete,
    MatProgressBar,
    AsyncPipe,
    MatAutocompleteTrigger,
    MatSuffix,
    MatIconButton,
    MatIcon,
  ],
  templateUrl: './dynamic-form.html',
  styleUrl: './dynamic-form.css'
})
export class DynamicForm implements OnChanges, OnDestroy {
  @Input({required: true}) columns!: ColumnConfig[];
  @Input() initialValues?: any;
  @Input() showButtons = false;
  @Input() enableValidation = true;

  @Output() addButtonClick = new EventEmitter<number>();
  @Output() editButtonClick = new EventEmitter<{ tableIndex: number, id: number }>();

  protected readonly fb = inject(FormBuilder);
  protected readonly formatEnumValue = formatEnumValue;
  protected readonly dataService = inject(DataService);

  private destroy$ = new Subject<void>();

  form!: FormGroup;
  protected selectableOptions = signal<Record<string, Observable<any[]>>>({});
  protected loadingMap = signal<Record<string, boolean>>({});

  ngOnChanges(changes: SimpleChanges) {
    if (changes['columns']) this.initForm();
    if (changes['initialValues']) this.patchFormValues();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initForm() {
    this.createForm();
    this.setupSelectableFields();
    if (this.initialValues) {
      this.patchFormValues();
    }
  }

  private createForm() {
    const group: Record<string, any> = {};

    this.columns.forEach(column => {
      if (column.type !== 'auto') {
        const defaultValue = column.type === 'selectable' ? '' : (column.dataType === 'boolean' ? false : '');
        const validators = this.enableValidation ? (column.validators || []) : [];
        group[column.propertyName] = [defaultValue, validators];
      }
    });

    this.form = this.fb.group(group);
  }

  public patchFormValues() {
    if (!this.initialValues) return;
    const patchData: Record<string, any> = {};
    this.columns.forEach(column => {
      const value = this.initialValues[column.propertyName];
      if (value !== undefined && value !== null) {
        patchData[column.propertyName] = value;
      }
    });
    this.form.patchValue(patchData);
  }

  public setupSelectableFields() {
    const options: Record<string, Observable<any[]>> = {};

    this.columns.forEach(column => {
      if (column.type === 'selectable' && column.tableIndexToSelectFrom !== undefined) {
        const targetTable = tables[column.tableIndexToSelectFrom];
        const targetEntityUrl = targetTable.entityUrl;
        options[column.propertyName] = this.form.get(column.propertyName)!
          .valueChanges.pipe(
            startWith(''),
            debounceTime(300),
            distinctUntilChanged(),
            switchMap(value => {
              const searchTerm = typeof value === 'string' ? value : '';
              this.setLoading(column.propertyName, true);
              return this.dataService.search(searchTerm, targetEntityUrl).pipe(
                map(result => {
                  this.setLoading(column.propertyName, false);
                  return result.items;
                }),
                catchError(error => {
                  console.error(`[DynamicForm] Error searching ${column.propertyName}:`, error);
                  this.setLoading(column.propertyName, false);
                  return of([]);
                })
              );
            }),
            takeUntil(this.destroy$)
          );
      }
    });

    this.selectableOptions.set(options);
  }

  private setLoading(field: string, value: boolean) {
    this.loadingMap.update(state => ({...state, [field]: value}));
  }

  getOptionDisplayValue(option: any, tableIndex: number): string {
    if (!option) return '';
    const targetTable = tables[tableIndex];
    return targetTable?.displayFormatter ? targetTable.displayFormatter(option) : option.id?.toString() || '';
  }

  onAddClick(tableIndex: number) {
    if (tableIndex !== undefined && tableIndex !== null) {
      this.addButtonClick.emit(tableIndex);
    }
  }

  onEditClick(propertyName: string, tableIndex: number) {
    if (tableIndex === undefined || tableIndex === null) return;
    const id = this.form.get(propertyName)?.value;
    if (id) {
      this.editButtonClick.emit({tableIndex, id});
    }
  }

  getFormValue(): any {
    return {...this.form.value};
  }

  getFilledValues(): Record<string, string> {
    const formValue = this.getFormValue();
    const filled: Record<string, string> = {};
    Object.entries(formValue).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        filled[key] =  String(value);
      }
    });
    return filled;
  }

  isValid(): boolean {
    return this.form.valid;
  }

  reset() {
    this.form.reset();
  }
}
