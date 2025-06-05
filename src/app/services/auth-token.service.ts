import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthTokenService {
  private apiUrl = `${environment.base_url + '/auth'}`;

  private readonly TOKEN_KEY = 'access_token';
  private readonly USERNAME = 'username';
  private readonly TOKEN_TYPE = 'tokenType';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    const loginObj = {
      username,
      password,
      client_secret: '280',
    };

    const body = new URLSearchParams();

    Object.entries(loginObj).forEach(([key, value]) => {
      if (value !== undefined) {
        body.append(key, value);
      }
    });

    return this.http.post(`${this.apiUrl}`, body.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USERNAME);
    localStorage.removeItem(this.TOKEN_TYPE);
  }

  saveDataLogin(data: any) {
    // console.log(data);
    localStorage.setItem(this.TOKEN_KEY, data.access_token);
    localStorage.setItem(this.TOKEN_TYPE, data.token_type);
    localStorage.setItem(this.USERNAME, data.username);
  }

  getDataLogin() {
    return {
      access_token: this.getAccessToken(),
      token_type: this.getTokenType(),
      username: this.getUsername(),
    };
  }

  saveToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getTokenType(): string | null {
    return localStorage.getItem(this.TOKEN_TYPE);
  }

  saveTokenType(tokentype: string) {
    localStorage.setItem(this.TOKEN_TYPE, tokentype);
  }

  saveUsername(username: string) {
    localStorage.setItem(this.USERNAME, username);
  }

  getUsername(): string | null {
    return localStorage.getItem(this.USERNAME);
  }
}
