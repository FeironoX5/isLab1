import {Component, inject, OnInit, signal} from '@angular/core';
import {MatGridList, MatGridTile} from '@angular/material/grid-list';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';
import {MatRippleModule} from '@angular/material/core';
import {operations} from '../../consts';
import {OperationsPageAction} from './operations-page-actions';
import {MatDialog} from '@angular/material/dialog';
import {HttpClient} from '@angular/common/http';
import {MatButton} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';

@Component({
  selector: 'app-operations-page',
  imports: [
    MatGridList,
    MatCard,
    MatGridTile,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatRippleModule,
    MatButton,
    MatTableModule,
  ],
  templateUrl: './operations-page.html',
  styleUrl: './operations-page.css'
})
export class OperationsPage implements OnInit {
  private readonly dialog = inject(MatDialog);
  private readonly http = inject(HttpClient);
  protected readonly operations = operations;
  protected history = signal<any[]>([]);
  protected importMessage = signal<string>('');
  protected readonly displayedColumns = ['id', 'status', 'addedCount', 'createdAt'];

  ngOnInit() {
    this.loadHistory();
  }

  openDialog(operationIndex: number) {
    this.dialog.open(OperationsPageAction, {
      data: operations[operationIndex],
      width: '600px',
      maxHeight: '90vh'
    });
  }

  importFile(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file, file.name);
    this.http.post<any>(`/api/batch-import`, formData).subscribe({
        next: (res) => {
          this.importMessage.set(`Import completed. Success: ${res.successfulOperations}, failed: ${res.failedOperations}`);
          this.loadHistory();
        },
        error: (err) => {
          this.importMessage.set(`Import failed: ${err?.error?.error || err.message}`);
          this.loadHistory();
        }
      });
  }

  loadHistory() {
    this.http.get<any[]>(`/api/batch-import/history`).subscribe((res) => this.history.set(res));
  }
}
