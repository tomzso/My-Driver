import { Component, OnInit } from '@angular/core';
import { FolderInfo } from '../../models/FolderInfo';
import { GoogleDriveService } from '../../services/googleDrive.service';
import { DataService } from '../../services/data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-folder-list',
  templateUrl: './folder-list.component.html',
  styleUrl: './folder-list.component.css'
})
export class FolderListComponent implements OnInit{

  folders: FolderInfo[] = [];
  

  pathId: string[] = [];
  pathName: string[] = [];
  currentFolderId: string;
  combinedPath: string;
  joinedPath: string = ' > ';
  subscription!: Subscription;

  constructor(
    private googleDriveService: GoogleDriveService,
    private dataService: DataService
  ) { 
    this.pathId.push("Root");
    this.pathName.push("Root");
    this.currentFolderId = 'root';
    this.combinedPath = this.pathName.join(' ' + this.joinedPath + ' ');
    this.updateRoot();
  }
  ngOnInit(): void {
    this.getFolderStructure(this.currentFolderId);
    this.subscription = this.dataService.data$.subscribe((data) => {
      // Update variableB whenever data changes
      this.currentFolderId = data;
      this.getFolderStructure(this.currentFolderId);

    });
  }

  
  updateRoot() {

    this.dataService.sendData(this.currentFolderId);
  }

  getFolderStructure(folderId: string) {


    this.googleDriveService.getFolderStructure(folderId).subscribe(
      (data) => {
        // Process the data here
        const folderStructure = data.files;
        console.log('Folder structure full:', folderStructure);
        // folderStructure
        this.folders = folderStructure.map((folder: any) => {
          return {
            id: folder.id,
            name: folder.name,
            parents: folder.parents[0],
            type: folder.mimeType.split('.').pop(),
            createdTime: folder.createdTime,
            iconLink: folder.iconLink,
            modifiedTime: folder.modifiedTime
          };
        });

        console.log('Folder structure:', this.folders);
       
      },
      (error) => {
        console.error('Error fetching folder structure:', error);
      }
    );
  }

  deleteFolder(id: string) {
    this.googleDriveService.deleteFile(id).subscribe(
      (data) => {
        console.log('File deleted:', data);
        this.getFolderStructure(this.currentFolderId);
      },
      (error) => {
        console.error('Error deleting file:', error);
      }
    );

  }
  navigateFolder(folderId: string, folderName: string) {
    this.pathId.push(folderId);
    this.pathName.push(folderName);
    this.currentFolderId = folderId;
    this.getFolderStructure(folderId);
    this.combinedPath = this.pathName.join('   ' + this.joinedPath + '   ');
    this.updateRoot();
  }
  navigateBack() {
    if (this.pathId.length <= 1) {
      return;
    }
    this.pathId.pop();
    this.pathName.pop();
    this.currentFolderId = this.pathId[this.pathId.length - 1];
    this.getFolderStructure(this.currentFolderId);
    this.combinedPath = this.pathName.join('   ' + this.joinedPath + '   ');
    this.updateRoot();
  }

}
