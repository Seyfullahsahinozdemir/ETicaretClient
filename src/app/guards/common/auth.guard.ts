import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from 'src/app/base/base.component';
import { AuthService, _isAuthenticated } from 'src/app/services/common/auth.service';
import { CustomToastrService, ToastrMessageType, ToastrOptions, ToastrPosition } from 'src/app/services/ui/custom-toastr.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {

  constructor(private router: Router, private toastrService: CustomToastrService, private spinner: NgxSpinnerService) {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
      this.spinner.show(SpinnerType.BallAtom);

      if (!_isAuthenticated) {
        this.router.navigate(["login"], {queryParams: {returnUrl: state.url}});
        this.toastrService.message("You need to login to do that !!!", "Authorization Error", {
          messageType: ToastrMessageType.Warning,
          position: ToastrPosition.TopRight
        });
      }
      this.spinner.hide(SpinnerType.BallAtom);
      return true;
    }
  
}
