import { ChatAdapter, User,UserStatus,Message } from './ng-chat'
//import { Message } from "./core/message";
import { Observable } from "rxjs/Rx";
import { Socket } from 'ng-socket-io';
import { Http, Response } from '@angular/http';

export class SocketIOAdapter extends ChatAdapter
{
    private socket: Socket;
    private http: Http;
    public userId: string;
	private users:Array<User>= new Array<User>();
    public userName:string;
    public dept:string;
    constructor(userId: string, socket: Socket, http: Http,username:string, dept:string) {
        super();
        this.socket = socket;
        this.http = http;
        this.userId = userId;
        this.userName= username;
        this.dept = dept;
        this.InitializeSocketListerners();  
    }

    public setUserId(userid:string){
           
        this.userId = userid;
        console.log("----user id---"+this.userId)

    }

   public resetDeatails(userid,username){
       this.userId = userid;
       this.userName= username;
       this.onChangeIdHandler(this.userId,this.userName);
   }

    listFriends(): Observable<User[]> {
        return this.http.post("http://localhost:3000/usrlist", { userId: this.userId })
        .map((res:Response) =>  { 
            const result = res.json();
          // let re = result.filter((x) => x.displayName.trim() != this.userName.trim() );
           const newList:User[] =[];
           for (let entry of result) {

               if(entry.displayName.trim() !== this.userName.trim()){
                        
                let isPresent = newList.find(x => x.displayName === entry.displayName);
                // tslint:disable-next-line:curly
                if (!isPresent) newList.push(entry);
                 
               }

           }
            
            return newList;
        })
        //...errors if any
        .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }

    getMessageHistory(idNme: any): Observable<Message[]> {
        return this.http.post("http://localhost:3000/currentchathistory", { fromName: this.userName,toName:idNme })
               .map((res:Response) =>  { 
                  const result = res.json();
                  console.log("result received",result);
                  let msgs:Message[] = new Array();
                  for(let entry of result){
                      console.log("inside ----")
                    let msg = new Message();
                    console.log(entry.msgFrom +"inside 2333 ----"+this.userName)
                    if(entry.msgFrom === this.userName ){
                    msg.fromId = this.userId;
                    }else{
                    msg.fromId = entry.msgFromId;
                    }
                    console.log("inside1 ----")
                    msg.message = entry.msg;
                    msg.seenOn  = entry.date;
                    console.log(entry.msgTo +"----inside2 ----"+ this.userName)
                    if(entry.msgTo === this.userName){
                    msg.toId =  this.userId;
                    }else{
                    msg.toId = entry.msgToId;
                    }
                    msg.updated_at = entry.createdOn;
                    msg.msgFrom = entry.msgFrom;
                    msg.msgTo = entry.msgTo;
                    console.log(entry.toId +" id "+ msg.toId );
                    msgs.push(msg);
                  }
                  console.log("messages",msgs);
                  return msgs;
                })
                //...errors if any
                .catch((error:any) => Observable.of([]));
    }

    
    sendMessage(message: Message): void {
	   this.socket.emit("sendMessage", message);
    }
    
	sendTyping(message: Message){
	
	    this.socket.emit("typing", message);
	}
	
	sendStopTyping(message: Message){
	
	 this.socket.emit("typingstoped", message);
	}
	
	public  sendSatusChange(data:any){
	  
	 
	this.socket.emit("user_status_change", data);
	
	}
	 
	public  sendJoin(){
     let user = this.users.find(x => x.id == this.userId);
     let details:any;
     this.socket.emit("join", {username:this.userName,dept:this.dept});
    }
	 private getUserNameFromId(id:any):string{
	   
	   let user=this.users.find(x => x.id == id);
	   if(user)
	     return user.displayName;
		else
		return '';
	   
	   }
	   
	  private getUserDtails(id:any):User{
	  
	    return this.users.find(x => x.id == id);
	   
	  
      }
      
      requestCurrentChatHistory(data: any): void {
        this.socket.emit("request-cuurent-history", data);
    }
	
    public InitializeSocketListerners(): void
    {
        this.socket.on("messageReceived", (messageWrapper) => {
            console.log("message history received**************************",messageWrapper.historyData);
            this.onMessageReceived(messageWrapper.user, messageWrapper.message,messageWrapper.historyData);
          });
	  
	   this.socket.on("starttyping", (messageWrapper) => {
        // Handle the received message to ng-chat
        this.onMessageReceived(messageWrapper.user, messageWrapper.message);
      });
	   this.socket.on("stoptyping", (messageWrapper) => {
        // Handle the received message to ng-chat
        this.onMessageReceived(messageWrapper.user, messageWrapper.message);
      });
	   
     
      this.socket.on('currnt-chats-history', (messageWrapper) => {
        this.onHistoryMessageReceived(messageWrapper.result , messageWrapper.data);

     });
 
     this.socket.on("useroffline", (messageWrapper) => {
        // Handle the received message to ng-chat
        this.onUserOffLineMessage(messageWrapper.name, messageWrapper.id);
      });

      this.socket.on("usrlist", (usersCollection: Array<User>) => {
        console.log("friends list**************************");
        let result =usersCollection.filter(x =>( (x.displayName != this.userName) ));

        const newList:User[] =[];
        for (let entry of usersCollection) {

            if(entry.displayName.trim() !== this.userName.trim()){
                     
             let isPresent = newList.find(x => x.displayName === entry.displayName);
             // tslint:disable-next-line:curly
             if (!isPresent) newList.push(entry);
              
            }

        }
        console.log("friends list**************************",usersCollection);
        this.onFriendsListChanged(newList);
      });
	  
	  this.socket.on('error', function () {
       console.log("Client: error");
        
       });
       let that = this;
	   this.socket.on('reconnect', function() {
            console.log('reconnect fired!');
			that.sendJoin();
        });
	   this.socket.on('connect_error', function () {
       console.log("Client:c srver offline  error");
       
       });
    }
}