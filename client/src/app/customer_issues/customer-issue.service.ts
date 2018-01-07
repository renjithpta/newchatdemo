import { Injectable } from '@angular/core';
import { Http } from '@angular/http';



import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import { CustomerIssue } from './customer-issue.model';


@Injectable()
export class CustomerIssueService {

    constructor(private http: Http) {
    }

    

    loadIssuesUsingPromise(): Promise<CustomerIssue[]> {
        return new Promise(resolve =>
            setTimeout(resolve, 2000))
            .then(() => {
                return this.http.post('http://localhost:3000/customerissue', {}).toPromise().then(response => response.json());
            });
    }
    loadIssueUsingObservable(): Observable<CustomerIssue[]> {
        return this.http.post('http://localhost:3000/customerissue',{}).map(res => res.json());
    }
    getIssueId(id: number){
        return this.http.post('http://localhost:3000/customerissuebyid', { id: id}).map(res => {
           let issues= res.json();
           return   issues.filter(x => x.id  = id);
          });
    }
}