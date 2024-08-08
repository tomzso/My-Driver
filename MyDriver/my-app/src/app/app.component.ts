import { Component, OnInit } from '@angular/core';
import { AuthGuard } from './services/authGuard.service';
import { GoogleDriveService } from './services/googleDrive.service';
import { FolderInfo } from './models/FolderInfo';
import { FileInfo } from './models/FileInfo';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  activateRouterOutlet: boolean = false;

  
  files: FileInfo[] = [];
  constructor(private authGuard: AuthGuard,private googleDriveService: GoogleDriveService) {
    // Check if the user is authenticated (logined in)
    this.activateRouterOutlet = !authGuard.canActivate();

  }
  ngOnInit(): void {


    // getFileStructure
    this.googleDriveService.getFileStructure().subscribe(
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
          };
        });

        console.log('File structure:', this.files);
        
      },
      (error) => {
        console.error('Error fetching folder structure:', error);
      }
    );
    
  }
  
}
