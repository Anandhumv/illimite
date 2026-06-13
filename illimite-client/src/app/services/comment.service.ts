import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface StorefrontComment {
  id: string;
  name: string;
  email: string;
  message: string;
  status: 'pending' | 'approved';
  createdAt: string;
}

export interface CreateCommentPayload {
  name: string;
  email: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = environment.apiBaseUrl;

  createComment(payload: CreateCommentPayload): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(`${this.apiBaseUrl}/comments`, payload);
  }

  getAdminComments(): Observable<StorefrontComment[]> {
    return this.http.get<StorefrontComment[]>(`${this.apiBaseUrl}/admin/comments`);
  }
}
