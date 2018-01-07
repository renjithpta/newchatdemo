import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgChat } from './ng-chat.component';
import { GroupByPipe } from './pipe/group-by.pipe';

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [NgChat,GroupByPipe],
  exports: [NgChat]
})
export class NgChatModule {
}