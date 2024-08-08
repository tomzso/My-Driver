import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { TokenResponse } from '../models/Token';
import { Observable, map, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoogleDriveService {

  accessToken: string = '';
  private readonly macrosId: string = 'AKfycbyK5fdGhnvegexqtVEu3IPe4zmBBDpgPpBN4aJHfJGvYV5UwMcXbwukp5-giHQJG-nXWg';
  private readonly baseUrl = 'https://www.googleapis.com/drive/v3/files';
  private readonly baseUrlUpload = 'https://www.googleapis.com/upload/drive/v3/files';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  
  ) { 
    this.authService.getAccessToken().subscribe(
      (response: any ) => {
        console.log('Token fetched successfully:', response);
        const accessToken: string = (response as TokenResponse).access_token;
        this.accessToken = accessToken;

        console.log('AccessToken created', this.accessToken);
        // Handle success
      },
      (error) => {
        console.error('Error fetching token:', error);
        // Handle error
      }
    );
  }


  // rename file with Google Apps script
  renameAndShareFile(fileId: string, newName: string) {
    const url = `https://script.google.com/macros/s/${this.macrosId}/exec?fileId=${fileId}&newName=${newName}`;
    return this.http.get(url);
  }

  // Method to get the folder structure
  getFolderStructure(folderId: string = 'root'): Observable<any> {
    return this.authService.getAccessToken().pipe(
      switchMap((response: any) => {
        console.log('Token fetched successfully:', response);
        const accessToken: string = (response as TokenResponse).access_token;
        const headers = new HttpHeaders().set('Authorization', `Bearer ${accessToken}`);
        //const folderId = "0ACGD0-P68XCaUk9PVA"; //1DwsMtkVbFPrvjLirDccBkJuaq6dZ1dhx
        const params = new HttpParams()
          .set('q', `'${folderId}' in parents`)  // Files in the root directory
          .set('pageSize', '1000')
          .set('fields', 'files(id,name,mimeType,parents,createdTime, modifiedTime,iconLink)'); // files(id,name,mimeType,parents,createdTime, modifiedTime,iconLink)

        return this.http.get<any>(`${this.baseUrl}`, { headers, params }).pipe(
          map((data: any) => {
            // Filter out folders (files with MIME type 'application/vnd.google-apps.folder')
            const filesOnly = data.files.filter((file: any) => file.mimeType == 'application/vnd.google-apps.folder');
            return { files: filesOnly }; // Return only files
          })
        );
      })
    );
  }

  // Method to get the folder structure
  getFileStructure(folderId: string = 'root'): Observable<any> {
    return this.authService.getAccessToken().pipe(
      switchMap((response: any) => {
        console.log('Token fetched successfully:', response);
        const accessToken: string = (response as TokenResponse).access_token;
        const headers = new HttpHeaders().set('Authorization', `Bearer ${accessToken}`);
        const params = new HttpParams()
          .set('q', `'${folderId}' in parents`)  // Files in the root directory
          .set('pageSize', '1000')
          .set('fields', 'files(id,name,mimeType,parents,createdTime,size,iconLink,modifiedTime)'); //  'files(id,name,mimeType,parents,createdTime,size,iconLink,modifiedTime)'

        return this.http.get<any>(`${this.baseUrl}`, { headers, params }).pipe(
          map((data: any) => {
            // Filter out folders (files with MIME type 'application/vnd.google-apps.folder')
            const filesOnly = data.files.filter((file: any) => file.mimeType !== 'application/vnd.google-apps.folder');
            return { files: filesOnly }; // Return only files
          })
        );
      })
    );
  }


  uploadFile(file: File) {

    const formData = new FormData();

    let type = file.type;
    switch (file.type) {
      case "text/plain":
          type = "text/html";
          break;
      default:
          break;
  }

  const fileData = new File([file], file.name, { type: type, lastModified: file.lastModified }); // 'text/html'
  console.log('File:', fileData);
  formData.append('file', fileData);

  console.log('formData:', formData);

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.accessToken}`,
      
    });
    console.log('upload accesstoken:', this.accessToken);
    
    return this.http.post<any>(this.baseUrlUpload, formData, { headers });
  }


  deleteFile(fileId: string) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.accessToken}`
    });
    console.log('delete accesstoken:', this.accessToken);
    return this.http.delete<any>(`https://www.googleapis.com/drive/v3/files/${fileId}`, { headers });
  }


  createFolder(folderName: string, parentFolderId: string = 'root'): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.accessToken}`);
    const body = {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [parentFolderId]
    };

    return this.http.post<any>(this.baseUrl, body, { headers });
  }


  moveFileToFolder(fileId: string, folderId = 'root') {
    // Replace 'YOUR_SCRIPT_URL' with the actual URL of your Google Apps Script web app
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbw9-aciNo56Caav7Z1XqITrITuy3dWXbPXPBEbFmWY27ZhcZW-k6VwTNYk1UKRxORC_Ag/exec';


    const url = `${scriptUrl}?sourceFileId=${fileId}&targetFolderId=${folderId}`;

    return this.http.get(url);
  }

}
