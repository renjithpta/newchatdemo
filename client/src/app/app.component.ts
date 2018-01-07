import { Component, ViewChild } from '@angular/core';
import { ChatAdapter } from  './ng-chat'
import { SocketIOAdapter } from './socketio-adapter'
import { Socket } from 'ng-socket-io';
import { Http } from '@angular/http';
import { NgChat } from './ng-chat/ng-chat.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  
  userId: string;
  username: string;
  department: string = 'House Keeping';
  departmentList:string[] =['House Keeping','Administarion','Front Desk','Store'];
  adminUsers:string[] = ['admin','admin1','admin2'];
  public adapter: ChatAdapter;
  public  isDisbaled = false;
  @ViewChild(NgChat)  chatComp:NgChat;
  openPopup: Function;
  
    setPopupAction(fn: any) {
      console.log('setPopupAction');
      this.openPopup = fn;
    }

  constructor(private socket: Socket, private http: Http) {
    this.InitializeSocketListerners();  
  }


  public joinRoom(): boolean{
  
    if(this.username === ''){
      alert("Enter username")
      return false;
    }
    let user= this.adminUsers.find( (x) => (x === this.username))
 

    if(!user && this.department === this.departmentList[1]){

       alert('Only admin user is allowed  to use admin deprtment!');
       return false;

    }
   
    if(this.isAdmin()){
      document.body.style.backgroundImage = 'none';
      document.body.style.backgroundColor = "#E6E6FA" ;
    }
    this.socket.emit("join", {username: this.username,dept:this.department});
  }

  public onUserNameKeyUp(){
     this.isDisbaled = false;
     this.username = this.username.toLocaleLowerCase();
     if(this.isAdmin()){
      
              this.department = this.departmentList[1];
              this.isDisbaled = true;
      
      }
   }

  public onUserNameBlur(){
   
     if(this.isAdmin()){

        this.department = this.departmentList[1];
        this.isDisbaled = true;

     }

  }

  public isAdmin():boolean{
    let user= this.adminUsers.find( (x) => (x === this.username))
    if(user) return true; else return false;

  }


  public InitializeSocketListerners(): void {
    this.socket.on("generatedUserId", (userId) => {
      // Initializing the chat with the userId and the adapter with the socket instance
      console.log("change id===============")
      if(!this.adapter){
      this.adapter = new SocketIOAdapter(userId, this.socket, this.http,this.username, this.department);
      }else{
        this.adapter.resetDeatails(this.userId,this.username);
        this.adapter.setUserId(this.userId);

      }
      this.userId = userId;
      let user= this.adminUsers.find( (x) => (x === this.username))
      });
  }

  showChat(event){

    this.chatComp.showChat = true;
    this.chatComp.isCollapsed = false;
  }
}