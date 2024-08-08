import { Component, OnInit } from '@angular/core';
import { GoogleDriveService } from '../../services/googleDrive.service';
import { FileInfo } from '../../models/FileInfo';
import { DataService } from '../../services/data.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.css', '../folder-list/folder-list.component.css']
})
export class FileListComponent implements OnInit{
  files: FileInfo[] = [];
  currentFolderId: string;
  subscription!: Subscription;
  fileDownloadUrl: string = 'https://drive.google.com/uc?export=download&id=';

  constructor(
    private googleDriveService: GoogleDriveService,
    private dataService: DataService

  ) {
    this.currentFolderId = 'root';
    this.getFileStructure(this.currentFolderId );
   }

 
  ngOnInit(): void {
    this.subscription = this.dataService.data$.subscribe((data) => {
      // Update variableB whenever data changes
      this.currentFolderId = data;
      // Trigger any necessary actions in component B
      this.getFileStructure(this.currentFolderId );
    });

  }


  getFileStructure(folderId: string) {
    this.googleDriveService.getFileStructure(folderId).subscribe(
      (data) => {
        // Process the data here
        const fileStructure = data.files;

        this.files = fileStructure.map((file: any) => {
          return {
            id: file.id,
            name: file.name,
            parents: file.parents[0],
            type: file.mimeType.split('.').pop(),
            createdTime: file.createdTime,
            size: file.size,
            iconLink: file.iconLink,
            modifiedTime: file.modifiedTime
          };
        });

        console.log('File structure:', this.files);
        
      },
      (error) => {
        console.error('Error fetching folder structure:', error);
      }
    );
  }

  deleteFile(id: string) {
    this.googleDriveService.deleteFile(id).subscribe(
      (data) => {
        console.log('File deleted:', data);
        this.getFileStructure(this.currentFolderId);
      },
      (error) => {
        console.error('Error deleting file:', error);
      }
    );
  }
  getFormattedSizeInMB(size: string): string {
    let num: number = parseInt(size);
    const sizeInMB = num / 1048576; // Divide by 1,048,576 to convert to MB

    if (!isNaN(sizeInMB)) {
      return sizeInMB.toFixed(2) + ' MB'; // Return size formatted to two decimal places
    } else {
      return '0.00 MB';
    }
    
  }


  downloadFile(fileId: string){
    
    const downloadUrl = `${this.fileDownloadUrl}${fileId}`; // this.fileDownloadUrl + this.googleDriveFile; ?filename=${originalFileName}
    console.log(downloadUrl);
    
    window.open(downloadUrl, '_blank');

  }


}
