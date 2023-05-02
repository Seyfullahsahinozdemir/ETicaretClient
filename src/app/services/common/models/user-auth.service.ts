import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import {
  CustomToastrService,
  ToastrMessageType,
  ToastrPosition,
} from '../../ui/custom-toastr.service';
import { TokenResponse } from 'src/app/contracts/token/token-response';
import { Observable, firstValueFrom } from 'rxjs';
import { SocialUser } from '@abacritt/angularx-social-login';

@Injectable({
  providedIn: 'root',
})
export class UserAuthService {
  constructor(
    private httpClientService: HttpClientService,
    private toastrService: CustomToastrService
  ) {}

  async login(
    usernameOrEmail: string,
    password: string,
    callBackFunction?: () => void
  ): Promise<any> {
    const observable: Observable<any | TokenResponse> =
      this.httpClientService.post<any | TokenResponse>(
        {
          controller: 'auth',
          action: 'login',
        },
        { usernameOrEmail, password }
      );
    const tokenResponse: TokenResponse = (await firstValueFrom(
      observable
    )) as TokenResponse;
    if (tokenResponse) {
      localStorage.setItem('accessToken', tokenResponse.token.accessToken);
      localStorage.setItem('refreshToken', tokenResponse.token.refreshToken);
      this.toastrService.message('Login successful', 'Login operation', {
        messageType: ToastrMessageType.Success,
        position: ToastrPosition.TopRight,
      });
    } else {
      this.toastrService.message('Login Failed', 'Login operation', {
        messageType: ToastrMessageType.Error,
        position: ToastrPosition.TopRight,
      });
    }
    callBackFunction();
  }

  async googleLogin(
    user: SocialUser,
    callBackFunction?: () => void
  ): Promise<any> {
    const observable: Observable<SocialUser | TokenResponse> =
      this.httpClientService.post<SocialUser | TokenResponse>(
        {
          action: 'google-login',
          controller: 'auth',
        },
        user
      );
    const tokenResponse: TokenResponse = (await firstValueFrom(
      observable
    )) as TokenResponse;

    if (tokenResponse) {
      localStorage.setItem('accessToken', tokenResponse.token.accessToken);
      localStorage.setItem('refreshToken', tokenResponse.token.refreshToken);
      this.toastrService.message('Google login successful', 'Google Login', {
        messageType: ToastrMessageType.Success,
        position: ToastrPosition.TopRight,
      });
    }

    callBackFunction();
  }

  async refreshTokenLogin(refreshToken: string, callBackFuntion?: () => void) {
    const observable: Observable<any | TokenResponse> =
      this.httpClientService.post(
        {
          action: 'refreshtokenlogin',
          controller: 'auth',
        },
        { refreshToken: refreshToken }
      );

    const tokenResponse: TokenResponse = (await firstValueFrom(
      observable
    )) as TokenResponse;

    if (tokenResponse) {
      localStorage.setItem('accessToken', tokenResponse.token.accessToken);
      localStorage.setItem('refreshToken', tokenResponse.token.refreshToken);
    }
  }
}
