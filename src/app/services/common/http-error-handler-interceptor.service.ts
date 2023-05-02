import {
  ToastrMessageType,
  ToastrOptions,
  ToastrPosition,
} from 'src/app/services/ui/custom-toastr.service';
import { Observable, catchError, of, timeInterval } from 'rxjs';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpStatusCode,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CustomToastrService } from '../ui/custom-toastr.service';
import { UserAuthService } from './models/user-auth.service';

@Injectable({
  providedIn: 'root',
})
export class HttpErrorHandlerInterceptorService implements HttpInterceptor {
  constructor(
    private toastrService: CustomToastrService,
    private userAuthService: UserAuthService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error) => {
        switch (error.status) {
          case HttpStatusCode.Unauthorized:
            this.toastrService.message(
              "You don't have privilege to perform the operation.",
              'Unauthorized Error',
              {
                messageType: ToastrMessageType.Warning,
                position: ToastrPosition.BottomFullWidth,
              }
            );
            this.userAuthService
              .refreshTokenLogin(localStorage.getItem('refreshToken'))
              .then((data) => {});
            break;
          case HttpStatusCode.InternalServerError:
            this.toastrService.message(
              'Not access server, try it later !!!',
              'Server Error',
              {
                messageType: ToastrMessageType.Warning,
                position: ToastrPosition.BottomFullWidth,
              }
            );
            break;
          case HttpStatusCode.BadRequest:
            this.toastrService.message(
              'Not access server, try it later !!!',
              'Request Error',
              {
                messageType: ToastrMessageType.Warning,
                position: ToastrPosition.BottomFullWidth,
              }
            );
            break;
          case HttpStatusCode.NotFound:
            this.toastrService.message('Page not found', 'Not found', {
              messageType: ToastrMessageType.Warning,
              position: ToastrPosition.BottomFullWidth,
            });
            break;
          default:
            this.toastrService.message(
              'Unexpected error occured',
              'Unexpected Error',
              {
                messageType: ToastrMessageType.Warning,
                position: ToastrPosition.BottomFullWidth,
              }
            );
            break;
        }
        return of(error);
      })
    );
  }
}
