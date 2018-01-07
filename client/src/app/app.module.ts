import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
import { NgChatModule } from './ng-chat/ng-chat.module';
import { CustomerIssueComponent } from './customer_issues/customer-issue.component';
import { ModalComponent } from './dialog/dialog.component';
const config: SocketIoConfig = { url: 'http://localhost:3000/chatspace', options: {'forceNew':true  } };
import { ChatHistoryComponent } from './chat-history/chat-history.component';
import { UserListComponent } from './user-list/user-list.component';
import { TimeAgoPipe } from './ng-chat/pipe/time-ago.pipe';

@NgModule({
  declarations: [
    AppComponent,
    CustomerIssueComponent,
    ChatHistoryComponent,
    ModalComponent,
    UserListComponent,
    TimeAgoPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    NgChatModule,
   // tslint:disable-next-line:no-trailing-whitespace
    SocketIoModule.forRoot(config) 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
