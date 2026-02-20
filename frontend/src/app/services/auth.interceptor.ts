import {HttpInterceptorFn} from '@angular/common/http';

const AUTH_PREFIX = '/api/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith('/api') || req.url.startsWith(AUTH_PREFIX)) {
    return next(req);
  }

  const token =
    localStorage.getItem('token') ||
    localStorage.getItem('jwt') ||
    localStorage.getItem('authToken');

  if (!token) {
    return next(req);
  }

  return next(
    req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    })
  );
};
