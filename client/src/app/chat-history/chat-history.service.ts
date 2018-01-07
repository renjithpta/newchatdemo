import { Injectable } from '@angular/core';
import { Http ,Response} from '@angular/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import { ChatHistory } from './chat-history.model';




@Injectable()
export class ChatHistoryService {

    constructor(private http: Http) {
    }

   public loadHistory(id:any): Observable<ChatHistory[]> {
          return this.http.post('http://localhost:3000/currentchatboathistory',
           { id: id})
        // tslint:disable-next-line:no-trailing-whitespace
        .map((res: Response) =>  { 
           const result = res.json();
           return result as ChatHistory[];
        });
    }
  
}