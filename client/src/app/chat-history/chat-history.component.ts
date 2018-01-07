import { Component, OnInit ,Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ChatHistoryService } from './chat-history.service';
import { ChatHistory } from './chat-history.model';
@Component({
    moduleId: module.id,
    selector: 'chat-hist',
    templateUrl: 'chat-history.component.html',
    styleUrls: ['chat-history.component.css'],
    providers: [ChatHistoryService]
})
export class ChatHistoryComponent implements OnInit {
    private chatHistories: ChatHistory[];
    private sortByKey: string;
    private searchText:string;
    private showLoader:boolean= true;
    @Input()
    chatId:any;
    constructor(private chatService:ChatHistoryService) { 
      }

    ngOnInit() { 
           
    }

    public getChatHistory(id){
        this.showLoader = true;
        this.chatHistories= [];
        console.log(id+"chat id"+this.chatId);
        this.chatService.loadHistory(id).subscribe(issues => {
            this.chatHistories = issues;
            this.showLoader = false;
            console.log("chat history",this.chatHistories);
        }, error => {
           this.showLoader = false;
            console.log(error);
        });
    }


}

