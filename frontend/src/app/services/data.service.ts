import {HttpClient, HttpParams} from '@angular/common/http';
import {inject, Injectable, OnDestroy, signal} from '@angular/core';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import {
  BehaviorSubject,
  Observable,
  Subject,
  timer,
} from 'rxjs';
import {filter, shareReplay, takeUntil} from 'rxjs/operators';

export interface PageResult<T> {
  items: T[];
  total_count: number;
}

export interface SubscribeParams {
  page?: number;
  size?: number;
  sort?: { column?: string; dir?: 'asc' | 'desc' };
  filters?: { [key: string]: string };
}

@Injectable({providedIn: 'root'})
export class DataService<T = any> implements OnDestroy {
  protected http = inject(HttpClient);

  static readonly httpBase = '/api';
  static readonly wsBase = 'ws://localhost:8080/lab1-1.0-SNAPSHOT/ws';

  public entityUrl = signal<string>('');
  public isLoading = signal<boolean>(false);
  public error = signal<string>('');

  private socket$: WebSocketSubject<any> | null = null;
  private reconnectDelay = 1000;
  private readonly maxReconnectDelay = 30000;
  private destroyed$ = new Subject<void>();
  private currentParams$ = new BehaviorSubject<SubscribeParams | null>(null);
  private latestPage$ = new BehaviorSubject<PageResult<T> | null>(null);
  private reconnectTimer$ = new Subject<void>();
  private isReconnecting = false;

  public readonly page$ = this.latestPage$.pipe(
    filter((p): p is PageResult<T> => p !== null),
    shareReplay({bufferSize: 1, refCount: true})
  );

  constructor() {
    this.currentParams$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((params) => {
        if (params && this.socket$) {
          this.sendSubscribe(params);
        }
      });
  }

  public search(searchTerm: string = '', entityUrl?: string): Observable<PageResult<T>> {
    let params = new HttpParams();

    if (searchTerm && searchTerm.trim()) {
      params = params.set('search', searchTerm.trim());
    }

    return this.http.get<PageResult<T>>(
      `${DataService.httpBase}${entityUrl ? entityUrl : this.entityUrl()}`,
      {params}
    );
  }

  get(id: number | string, entityUrl?: string): Observable<T> {
    return this.http.get<T>(
      `${DataService.httpBase}${entityUrl ? entityUrl : this.entityUrl()}/${id}`,
    );
  }

  create(entity: Partial<T>, entityUrl?: string): Observable<T> {
    return this.http.post<T>(
      `${DataService.httpBase}${entityUrl ? entityUrl : this.entityUrl()}`,
      entity
    );
  }

  update(id: number | string, entity: Partial<T>, entityUrl?: string): Observable<T> {
    return this.http.put<T>(
      `${DataService.httpBase}${entityUrl ? entityUrl : this.entityUrl()}/${id}`,
      entity
    );
  }

  delete(id: number | string, entityUrl?: string): Observable<void> {
    return this.http.delete<void>(
      `${DataService.httpBase}${entityUrl ? entityUrl : this.entityUrl()}/${id}`,
    );
  }

  public watch(params: SubscribeParams): Observable<PageResult<T>> {
    this.currentParams$.next({
      page: params.page ?? 0,
      size: params.size ?? 20,
      sort: params.sort,
      filters: params.filters,
    });

    if (!this.socket$ && this.entityUrl()) {
      this.connectSocket();
    }

    return this.page$;
  }

  public unwatch() {
    this.currentParams$.next(null);
    this.latestPage$.next(null);
  }

  private connectSocket() {
    if (this.socket$ || !this.entityUrl() || this.isReconnecting) return;

    this.isReconnecting = true;
    const wsUrl = DataService.wsBase + this.entityUrl();
    console.log(`[WebSocket] Connecting to ${wsUrl}`);

    this.isLoading.set(true);
    this.error.set('');

    this.socket$ = webSocket({
      url: wsUrl,
      openObserver: {
        next: () => {
          console.log('[WebSocket] Connected successfully');
          this.isReconnecting = false;
          this.reconnectDelay = 1000;
          const params = this.currentParams$.value;
          if (params) {
            this.sendSubscribe(params);
          }
        },
      },
      closeObserver: {
        next: (event) => {
          console.log('[WebSocket] Connection closed', event);
          this.isReconnecting = false;
          this.handleSocketClose();
        },
      },
      deserializer: (e: MessageEvent) => {
        try {
          return JSON.parse(e.data);
        } catch {
          console.warn('[WebSocket] Failed to parse message:', e.data);
          return e.data;
        }
      },
      serializer: (value: any) => JSON.stringify(value),
    });

    this.socket$
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (msg) => this.handleWsMessage(msg),
        error: (err) => {
          console.error('[WebSocket] Error:', err);
          this.error.set(err.message || 'WebSocket error');
          this.isReconnecting = false;
          this.handleSocketClose();
        },
        complete: () => {
          console.log('[WebSocket] Stream completed');
          this.isReconnecting = false;
          this.handleSocketClose();
        },
      });
  }

  private handleWsMessage(msg: any) {
    if (!msg) return;

    console.log('[WebSocket] Message received:', msg);

    if (msg.status === 'success' && Array.isArray(msg.items)) {
      const page: PageResult<T> = {
        items: msg.items,
        total_count: msg.total_count ?? msg.items.length,
      };
      this.latestPage$.next(page);
      this.isLoading.set(false);
      this.error.set('');
      return;
    }

    if (msg.error) {
      this.error.set(msg.error);
      this.isLoading.set(false);
      return;
    }

    if (Array.isArray(msg)) {
      const page: PageResult<T> = {
        items: msg,
        total_count: msg.length,
      };
      this.latestPage$.next(page);
      this.isLoading.set(false);
      this.error.set('');
    }
  }

  private handleSocketClose() {
    if (this.destroyed$.isStopped) return;

    this.socket$ = null;

    if (this.currentParams$.value) {
      this.scheduleReconnect();
    } else {
      this.isLoading.set(false);
    }
  }

  private scheduleReconnect() {
    this.reconnectTimer$.next();

    timer(this.reconnectDelay)
      .pipe(takeUntil(this.reconnectTimer$), takeUntil(this.destroyed$))
      .subscribe(() => {
        if (this.currentParams$.value && !this.socket$) {
          this.connectSocket();
          this.reconnectDelay = Math.min(this.reconnectDelay * 2, this.maxReconnectDelay);
        }
      });
  }

  private sendSubscribe(params: SubscribeParams) {
    if (!this.socket$) return;

    const payload = {
      action: 'subscribe',
      page: params.page,
      size: params.size,
      sortColumn: params.sort?.column,
      sortDirection: params.sort?.dir,
      filters: params.filters ?? {},
    };

    console.log('[WebSocket] Sending subscribe:', payload);
    this.socket$.next(payload);
    this.isLoading.set(true);
  }

  public cleanupSocketAndReconnect() {
    this.reconnectTimer$.next();

    if (this.socket$) {
      this.socket$.complete();
      this.socket$ = null;
    }

    this.isReconnecting = false;
    this.reconnectDelay = 1000;
    this.isLoading.set(false);
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
    this.reconnectTimer$.next();
    this.reconnectTimer$.complete();
    this.cleanupSocketAndReconnect();
  }
}
