import { Component, OnInit } from '@angular/core';
import { GoogleDriveService } from '../../services/googleDrive.service';
import { DataService } from '../../services/data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-upload-files-folders',
  templateUrl: './upload-files-folders.component.html',
  styleUrl: './upload-files-folders.component.css'
})
export class UploadFilesFoldersComponent implements OnInit{
  folderName: string = '';
  currentFolderId: string;
  subscription!: Subscription;

  constructor(
    private googleDriveService: GoogleDriveService,
    private dataService: DataService
  ) { 
    this.currentFolderId = 'root';
  }
  ngOnInit(): void {
    this.subscription = this.dataService.data$.subscribe((data) => {
      // Update variableB whenever data changes
      this.currentFolderId = data;
    });

  }
  submit(){}

  onFolderCreate(){
    if(this.folderName === '') return;
    this.googleDriveService.createFolder(this.folderName, this.currentFolderId).subscribe(
      (response) => {
   
        console.log('Folder created:', response);
        this.googleDriveService.renameAndShareFile(response.id, this.folderName).subscribe(
          (response) => {
            
            this.updateRoot();
            // Handle success
          },
          (error) => {
            console.error('Error rename file:', error);
            this.updateRoot();
            // Handle error
          }
        );
        this.folderName = '';

          // Handle success
      },
      (error) => {
        console.error('Error uploading file:', error);
        // Handle error
      }
    );

  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.uploadFileToDrive(file);
  }


  uploadFileToDrive(file: File) {
    const name = file.name.split('.')[0];
    this.googleDriveService.uploadFile(file).subscribe(
      (response) => {
        console.log('File uploaded:', response);
        this.renameAndShareFile(response.id, name);
        this.googleDriveService.moveFileToFolder(response.id, this.currentFolderId).subscribe(
          (response) => {
            this.updateRoot();
          },
          (error) => {
            this.updateRoot();
          }
        );
        console.log('File uploaded:', response);
          // Handle success
      },
      (error) => {
        console.error('Error uploading file:', error);
        // Handle error

      }
    );
  }
  
  renameAndShareFile(fileId: string, newName: string) {

    this.googleDriveService.renameAndShareFile(fileId, newName)
      .subscribe(response => {
        console.log('File renamed successfully:', response);
      }, error => {
        console.error('Error renaming file:', error);
      });
  }

  updateRoot() {

    this.dataService.sendData(this.currentFolderId);
  }

}
