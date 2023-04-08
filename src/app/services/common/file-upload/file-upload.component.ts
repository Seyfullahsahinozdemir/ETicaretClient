import { Component, Input } from '@angular/core';
import { FileSystemFileEntry, NgxFileDropEntry } from 'ngx-file-drop';
import { HttpClientService } from '../http-client.service';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { AlertifyService, MessageType, Position } from '../../admin/alertify.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../ui/custom-toastr.service';
import { MatDialog } from '@angular/material/dialog';
import { FileUploadDialogComponent, FileUploadDialogState } from 'src/app/dialogs/file-upload-dialog/file-upload-dialog.component';
import { DialogService } from '../dialog.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent {
  constructor(private httpClientService: HttpClientService, private alertify: AlertifyService, private toastr: CustomToastrService, private dialog: MatDialog, private dialogService: DialogService) {}

  public files: NgxFileDropEntry[];

  @Input() options: Partial<FileUploadOptions>
  public selectedFiles(files: NgxFileDropEntry[]) {
    this.files = files;

    const fileData: FormData = new FormData();
    for (const file of files) {
      (file.fileEntry as FileSystemFileEntry).file((_file) => {
        fileData.append(_file.name, _file, file.relativePath)
      });
    }

    this.dialogService.openDialog({
      componentType: FileUploadDialogComponent,
      data: FileUploadDialogState.Yes,
      afterClosed: () => {
        this.httpClientService.post({
          controller: this.options.controller,
          action: this.options.action,
          queryString: this.options.queryString,
          headers: new HttpHeaders({"responseType" : "blob"}), 
        }, fileData).subscribe(data => {
          const message: string = "Files uploaded successfully";
          if (this.options.isAdminPage) {
            this.alertify.message(message, {
              position: Position.TopRight,
              dismissOthers: true,
              messageType: MessageType.Success
            });
          }
          else {
            this.toastr.message(message, "Upload", {
              messageType: ToastrMessageType.Success,
              position: ToastrPosition.TopRight
            })
          }
        }, (errorResponse: HttpErrorResponse) => {
          const message: string = "Failed Upload Operation";
          if (this.options.isAdminPage) {
            this.alertify.message(message, {
              position: Position.TopRight,
              dismissOthers: true,
              messageType: MessageType.Error
            });
          }
          else {
            this.toastr.message(message, "Upload", {
              messageType: ToastrMessageType.Error,
              position: ToastrPosition.TopRight
            })
          }
        });
      }
    });
  }

}

export class FileUploadOptions {
  controller?: string;
  action?: string;
  queryString?: string;
  explanation?: string;
  accept?: string;
  isAdminPage?: boolean;
}