import {HttpClient, HttpParams} from '@angular/common/http';
import {inject, Injectable, OnDestroy, signal} from '@angular/core';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import {BehaviorSubject, Observable, Subject, timer} from 'rxjs';
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
  static readonly wsBase = `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}/ws`;


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

  public search(_: string = '', entityUrl?: string): Observable<PageResult<T>> {
    return this.fetchPage({page: 0, size: 50}, entityUrl ?? this.entityUrl());
  }

  get(id: number | string, entityUrl?: string): Observable<T> {
    return this.http.get<T>(`${DataService.httpBase}${entityUrl ? entityUrl : this.entityUrl()}/${id}`);
  }

  create(entity: Partial<T>, entityUrl?: string): Observable<T> {
    return this.http.post<T>(`${DataService.httpBase}${entityUrl ? entityUrl : this.entityUrl()}`, entity);
  }

  update(id: number | string, entity: Partial<T>, entityUrl?: string): Observable<T> {
    return this.http.patch<T>(`${DataService.httpBase}${entityUrl ? entityUrl : this.entityUrl()}/${id}`, entity);
  }

  delete(id: number | string, entityUrl?: string): Observable<void> {
    return this.http.delete<void>(`${DataService.httpBase}${entityUrl ? entityUrl : this.entityUrl()}/${id}`);
  }

  public watch(params: SubscribeParams): Observable<PageResult<T>> {
    const normalized = {
      page: params.page ?? 0,
      size: params.size ?? 20,
      sort: params.sort,
      filters: params.filters,
    };

    this.currentParams$.next(normalized);

    if (!this.socket$) {
      this.connectSocket();
    }

    this.loadCurrentPage();
    return this.page$;
  }

  public unwatch() {
    this.currentParams$.next(null);
    this.latestPage$.next(null);
    this.cleanupSocketAndReconnect();
  }

  private loadCurrentPage() {
    const params = this.currentParams$.value;
    if (!params || !this.entityUrl()) return;

    this.isLoading.set(true);
    this.error.set('');

    this.fetchPage(params, this.entityUrl())
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (page) => {
          this.latestPage$.next(page);
          this.isLoading.set(false);
        },
        error: (err) => {
          this.error.set(err?.error?.message ?? err?.message ?? 'Failed to load data');
          this.isLoading.set(false);
        }
      });
  }

  private fetchPage(params: SubscribeParams, entityUrl: string): Observable<PageResult<T>> {
    let httpParams = new HttpParams()
      .set('page', String(params.page ?? 0))
      .set('size', String(params.size ?? 20));

    if (params.sort?.column && params.sort?.dir) {
      httpParams = httpParams.set('sort', `${params.sort.column},${params.sort.dir}`);
    }

    Object.entries(params.filters ?? {}).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        httpParams = httpParams.append('filter', `${key}:${value}`);
      }
    });

    return new Observable<PageResult<T>>((observer) => {
      this.http.get<any>(`${DataService.httpBase}${entityUrl}`, {params: httpParams})
        .subscribe({
          next: (response) => {
            observer.next({
              items: response.content ?? [],
              total_count: response.totalElements ?? 0
            });
            observer.complete();
          },
          error: (err) => observer.error(err)
        });
    });
  }

  private connectSocket() {
    if (this.socket$ || this.isReconnecting) return;

    this.isReconnecting = true;

    this.socket$ = webSocket({
      url: DataService.wsBase,
      openObserver: {next: () => {
        this.isReconnecting = false;
        this.reconnectDelay = 1000;
      }},
      closeObserver: {next: () => {
        this.isReconnecting = false;
        this.handleSocketClose();
      }},
      deserializer: (e: MessageEvent) => {
        try {
          return JSON.parse(e.data);
        } catch {
          return null;
        }
      },
      serializer: (value: any) => JSON.stringify(value),
    });

    this.socket$.pipe(takeUntil(this.destroyed$)).subscribe({
      next: (msg) => this.handleWsMessage(msg),
      error: () => {
        this.isReconnecting = false;
        this.handleSocketClose();
      },
      complete: () => {
        this.isReconnecting = false;
        this.handleSocketClose();
      },
    });
  }

  private handleWsMessage(msg: any) {
    const resourceType = msg?.resourceType;
    if (!resourceType || !this.entityUrl()) return;

    const currentResource = this.entityUrl().replace(/^\//, '');
    if (resourceType === currentResource) {
      this.loadCurrentPage();
    }
  }

  private handleSocketClose() {
    if (this.destroyed$.isStopped) return;

    this.socket$ = null;

    if (this.currentParams$.value) {
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect() {
    this.reconnectTimer$.next();

    timer(this.reconnectDelay)
      .pipe(takeUntil(this.reconnectTimer$), takeUntil(this.destroyed$))
      .subscribe(() => {
        if (!this.socket$) {
          this.connectSocket();
          this.reconnectDelay = Math.min(this.reconnectDelay * 2, this.maxReconnectDelay);
        }
      });
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
