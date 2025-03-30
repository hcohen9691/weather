import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})

export class AiService {
    private apiUrl = 'https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct';
    private apiKey = environment.apiKey2;
  
    constructor(private http: HttpClient) {}
  
    getClothingRecommendation(temperature: number, condition: string): Observable<any> {
      const prompt = `I need clothing recommendations for a day with ${temperature}°C temperature and ${condition.toLowerCase()} weather.`;
  
      const requestBody = {
        inputs: prompt,
        parameters: { max_new_tokens: 50 },
      };
  
      const headers = new HttpHeaders({
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      });
  
      return this.http.post(this.apiUrl, requestBody, { headers });
    }
  }
