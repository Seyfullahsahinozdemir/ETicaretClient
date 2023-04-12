import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadComponent } from './file-upload.component';
import { NgxFileDropModule } from 'ngx-file-drop';
import { DialogsModule } from '../../../dialogs/dialogs.module';
import { FileUploadDialogComponent } from 'src/app/dialogs/file-upload-dialog/file-upload-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [FileUploadComponent, FileUploadDialogComponent],
  imports: [CommonModule, NgxFileDropModule, MatDialogModule, MatButtonModule],
  exports: [FileUploadComponent],
})
export class FileUploadModule {}
