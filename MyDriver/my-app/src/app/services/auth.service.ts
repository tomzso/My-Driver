import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public loggedIn = false;
  readonly CLIENT_ID = '177950567170-kh22fj4ej96195cuk3mlqmetu37f0f4a.apps.googleusercontent.com';
  readonly CLIENT_SECRET = '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';
  readonly REFRESH_TOKEN = '1//04TyB2kg3G7YzCgYIARAAGAQSNwF-L9IrsYaUkzInI5F-sx1k_Lm0fQAWgANxoqyRpc7qbnHVDg4oI6fkRA75RZHJLrbQYNRhgBs'; // 1//04uoAJv1mDcTvCgYIARAAGAQSNwF-L9Ir_5JYXD7UcnluY5gp8AmnmpUcli3D8pCSpDZjLvtGlkjm2BaT2vZrAOHQF_C5USBlvjg
  readonly url = 'https://oauth2.googleapis.com/token';

  constructor(private http: HttpClient) { 
    const loggedInUser = sessionStorage.getItem("loggedInUser") || localStorage.getItem("loggedInUser");
    this.loggedIn = loggedInUser ? true : false;

  }

  getAccessToken(){

    const body = new URLSearchParams();
    body.set('client_id', this.CLIENT_ID);
    body.set('client_secret', this.CLIENT_SECRET);
    body.set('refresh_token', this.REFRESH_TOKEN);
    body.set('grant_type', 'refresh_token');

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url, body.toString(), { headers });
  }

}
