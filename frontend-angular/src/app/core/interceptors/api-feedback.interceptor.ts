import { HttpErrorResponse, HttpEventType, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, finalize, tap, throwError } from 'rxjs';
import { LoaderService } from '../services/loader.service';
import { ToastService } from '../services/toast.service';

const SKIP_TOAST_HEADER = 'x-skip-toast';
const SKIP_LOADER_HEADER = 'x-skip-loader';

export const apiFeedbackInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderService = inject(LoaderService);
  const toastService = inject(ToastService);

  const isApiRequest = req.url.includes('/api/');
  const skipToast = req.headers.has(SKIP_TOAST_HEADER);
  const skipLoader = req.headers.has(SKIP_LOADER_HEADER);
  const request = req.clone({
    headers: req.headers.delete(SKIP_TOAST_HEADER).delete(SKIP_LOADER_HEADER)
  });

  const shouldTrackLoader = isApiRequest && !skipLoader;

  if (shouldTrackLoader) {
    loaderService.requestStarted();
  }

  let response$;
  try {
    response$ = next(request);
  } catch (error) {
    if (shouldTrackLoader) {
      loaderService.requestEnded();
    }
    throw error;
  }

  return response$.pipe(
    tap((event) => {
      if (!(event instanceof HttpResponse) || event.type !== HttpEventType.Response || skipToast || !isApiRequest) {
        return;
      }

      const method = request.method.toUpperCase();
      if (method === 'GET') {
        return;
      }

      if (isFailurePayload(event.body)) {
        const failureMessage = extractMessage(event.body) ?? 'Request failed. Please try again.';
        toastService.error(failureMessage);
        return;
      }

      const responseMessage = extractMessage(event.body);
      if (responseMessage) {
        toastService.success(responseMessage);
        return;
      }

      toastService.success(defaultSuccessMessage(method));
    }),
    catchError((error: unknown) => {
      if (!skipToast && isApiRequest && request.method.toUpperCase() !== 'GET') {
        const message = extractErrorMessage(error) ?? 'Request failed. Please try again.';
        toastService.error(message);
      }

      return throwError(() => error);
    }),
    finalize(() => {
      if (shouldTrackLoader) {
        loaderService.requestEnded();
      }
    })
  );
};

function isFailurePayload(body: unknown): boolean {
  if (!body || typeof body !== 'object') {
    return false;
  }

  const record = body as Record<string, unknown>;
  return record['success'] === false;
}

function defaultSuccessMessage(method: string): string {
  switch (method) {
    case 'POST':
      return 'Created successfully.';
    case 'PUT':
    case 'PATCH':
      return 'Updated successfully.';
    case 'DELETE':
      return 'Deleted successfully.';
    default:
      return 'Request completed successfully.';
  }
}

function extractMessage(body: unknown): string | null {
  if (!body || typeof body !== 'object') {
    return null;
  }

  const record = body as Record<string, unknown>;
  const directMessage = record['message'];
  if (typeof directMessage === 'string' && directMessage.trim()) {
    return directMessage;
  }

  const nestedError = record['error'];
  if (typeof nestedError === 'string' && nestedError.trim()) {
    return nestedError;
  }

  return null;
}

function extractErrorMessage(error: unknown): string | null {
  if (!(error instanceof HttpErrorResponse)) {
    return null;
  }

  const errorBody = error.error;
  if (typeof errorBody === 'string' && errorBody.trim()) {
    return errorBody;
  }

  if (errorBody && typeof errorBody === 'object') {
    const record = errorBody as Record<string, unknown>;
    const message = record['message'];
    if (typeof message === 'string' && message.trim()) {
      return message;
    }

    const title = record['title'];
    if (typeof title === 'string' && title.trim()) {
      return title;
    }
  }

  if (error.message?.trim()) {
    return error.message;
  }

  return null;
}
