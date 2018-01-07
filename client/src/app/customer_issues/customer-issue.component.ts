import { Component, OnInit, EventEmitter, Output,ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CustomerIssueService } from './customer-issue.service';
import { CustomerIssue } from './customer-issue.model'; 
import { ModalComponent } from '../dialog/dialog.component';
import { ChatHistoryComponent } from '../chat-history/chat-history.component';

@Component({
    moduleId: module.id,
    selector: 'cust-issue',
    templateUrl: 'customer-issuue.component.html',
    styleUrls: ['customer-issue.component.css'],
    providers: [CustomerIssueService]
})
export class CustomerIssueComponent implements OnInit {
    private custIssue: CustomerIssue[];
    private sortByKey: string;
    private searchText:string;
    private chatId:any;
    private showLoader:boolean= true;
    @Output()
    private showChatEvent = new EventEmitter<CustomerIssue>();
    @ViewChild('modal1') historyModel:ModalComponent;
    @ViewChild(ChatHistoryComponent)  histComp:ChatHistoryComponent;
    constructor(private custService:CustomerIssueService) { 
        
        this.showLoader = true;
        this.custService.loadIssueUsingObservable().subscribe(issues => {
            this.showLoader = false;
            this.custIssue = issues;
            console.log(this.custIssue);
        }, error => {

            console.log(error);
        });
    }

    ngOnInit() { 


    
        
    }

    public showChatHistory(model,id){
        console.log(model,id)
       this.chatId = id;
       this.histComp.getChatHistory(id);
       this.historyModel.show();
    }
  
    public showChatWindow(issue:CustomerIssue){
       this.showChatEvent.emit(issue);
    }
   
}

