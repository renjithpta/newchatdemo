import { Observable } from 'rxjs/Observable';
import { Message } from "./message";
import { User } from "./user";
import { MessageHistory } from './message-history';

export abstract class ChatAdapter
{
    // ### Abstract adapter methods ###

    public abstract listFriends(): Observable<User[]>;
    
    public abstract getMessageHistory(userId: any): Observable<Message[]>;

    public abstract sendMessage(message: Message): void;
	
	public abstract sendTyping(message: Message): void;
	
	public abstract sendStopTyping(message: Message): void;
	
	public abstract sendSatusChange(data:any):void;
    
    public abstract setUserId(userId:string);
    
    public  abstract resetDeatails(userid,username);

    public abstract requestCurrentChatHistory(data: any): void;

    // ### Adapter/Chat income/ingress events ###

    public onFriendsListChanged(users: User[]): void
    {
        this.friendsListChangedHandler(users);
    }
    
    public onUserOffLineMessage(name: string, id:string) {
       
        this.onUserOffLineMessageChangedHandler(name, id);
    }
      

    public onMessageReceived(user: User, message: Message,  history?: any): void {
        this.messageReceivedHandler(user, message, history);
    }
     
    public onChangeId(id: string, name: string): void
    {
        this.onChangeIdHandler(id, name);
    }

    public onHistoryMessageReceived(messages: MessageHistory[], data: any): void   {
        this.messageHistoryReceivedHandler(messages, data);
    }
    // Event handlers
    friendsListChangedHandler: (users: User[]) => void  = (users: User[]) => {};
    onUserOffLineMessageChangedHandler: (name: string , id: string) => void  = (name: string, id: string) => {};
    onChangeIdHandler: (id: string,name:string) => void  = (id:string,name: string) => {};
    messageReceivedHandler: (user: User, message: Message, history ?: any) => void = (user: User, message: Message, history?: any) => {};
    messageHistoryReceivedHandler: (messages: MessageHistory[], data: any) => void = (messages: MessageHistory[],  data: any) => {};
}