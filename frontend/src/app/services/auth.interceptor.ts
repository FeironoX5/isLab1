import {HttpInterceptorFn} from '@angular/common/http';

// Authorization is disabled in this project.
export const authInterceptor: HttpInterceptorFn = (req, next) => next(req);
