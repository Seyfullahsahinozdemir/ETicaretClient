import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { Create_User } from 'src/app/contracts/users/create_user';
import { User } from 'src/app/entities/user';
import { ConfirmPasswordValidator } from 'src/app/services/common/confirm-password-validator';
import { UserService } from 'src/app/services/common/models/user.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from 'src/app/services/ui/custom-toastr.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent extends BaseComponent implements OnInit {
  constructor(spinner: NgxSpinnerService, private formBuilder: FormBuilder, private userService: UserService, private toastrService: CustomToastrService) {
    super(spinner)
  }

  form: FormGroup;
  ngOnInit(): void {
    this.showSpinner(SpinnerType.BallAtom);
    this.form = this.formBuilder.group({
      nameSurname: ["", [
        Validators.required,
        Validators.maxLength(50),
        Validators.minLength(3)
      ]],
      username: ["", [
        Validators.required,
        Validators.maxLength(20),
        Validators.minLength(7)
      ]],
      email: ["", [
        Validators.required,
        Validators.maxLength(250),
        Validators.email
      ]],
      password: ["", [
        Validators.required
      ]],
      repassword: ["", [
        Validators.required
      ]]
    }, {
      validator: ConfirmPasswordValidator("password", "repassword")
    });
  }

  get component() {
    return this.form.controls;
  }

  submitted: boolean = false;
  async onSubmit(user: User) {
    this.submitted = true;
    if (this.form.invalid)
      return;
    const result: Create_User = await this.userService.create(user);
    if (result.succeeded) {
      this.toastrService.message(result.message, "User registration success", {
        messageType: ToastrMessageType.Success,
        position: ToastrPosition.TopRight
      });
    }
    else {
      this.toastrService.message(result.message, "User registration failed", {
        messageType: ToastrMessageType.Error,
        position: ToastrPosition.TopRight
      });
    }
  }
}
