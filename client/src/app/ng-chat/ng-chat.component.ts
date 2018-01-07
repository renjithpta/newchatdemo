import { Component, Input, OnInit, ViewChildren, HostListener ,ViewChild,ElementRef } from '@angular/core';
import { ChatAdapter } from './core/chat-adapter';
import { User } from "./core/user";
import { Message } from "./core/message";
import { Window } from "./core/window";
import { UserStatus } from "./core/user-status.enum";
import 'rxjs/add/operator/map';
import { MessageHistory } from './core/message-history';

@Component({
    selector: 'ng-chat',
    templateUrl: 'ng-chat.component.html',
    styleUrls: [
        '/assets/icons.css',
        '/assets/ng-chat.component.default.css',
        '/assets/loading-spinner.css'
    ]
})

export class NgChat implements OnInit {
    constructor() { }

    // Exposes the enum for the template
    UserStatus = UserStatus;
	
	@ViewChild('audioOption')
    audioPlayerRef: ElementRef;

    @Input()
    public title: string = "Employees";

    @Input()
    public adapter: ChatAdapter;

    @Input()
    public userId: any;

    @Input()
    public messagePlaceholder: string = "Type a message";

    @Input()
    public isCollapsed: boolean = false;

    @Input()    
    public pollFriendsList: boolean = false;

    @Input()
    public pollingInterval: number = 5000;

    @Input()    
    public historyEnabled: boolean = true;

    public searchInput: string = "";
	
	public status: string = "0";

    private users: User[];

    private isRecooneted = false;

    public showChat:boolean  = false;
    

    @Input()
    public userNmae: any;

    private reConnectCunt:number =0;

   

    get filteredUsers(): User[]
    {

        console.log("users",this.users)
        if (this.searchInput.length > 0){
            // Searches in the friend list by the inputted search string
            return this.users.filter(x => x.displayName.toUpperCase().includes(this.searchInput.toUpperCase()) || x.dept.toUpperCase().includes(this.searchInput.toUpperCase()));
        }

        return this.users;
    }

    // Defines the size of each opened window to calculate how many windows can be opened on the viewport at the same time.
    private windowSizeFactor: number = 300;

    // Total width size of the friends list section
    private friendsListWidth: number = 350;

    // Available area to render the plugin
    private viewPortTotalArea: number;

    windows: Window[] = [];

    private isBootsrapped: boolean = false;

    private oldUserId='';

    @ViewChildren('chatMessages') chatMessageClusters: any;

    ngOnInit() { 
        let adminUsers = ['admin','admin1','admin2'];
        let  adUser= adminUsers.find( (x) => (x === this.userNmae));
        if(!adUser) this.showChat = true;
        this.bootstrapChat();
    }
	
	onAudioPlay(){
        this.audioPlayerRef.nativeElement.play();
    }

    @HostListener('window:resize', ['$event'])
    onResize(event: any){
       this.viewPortTotalArea = event.target.innerWidth;
       this.NormalizeWindows();
    }

    public setShowChat(value:boolean){

        this.showChat = value;
      
        
    }
    // Checks if there are more opened windows than the view port can display
    private NormalizeWindows(): void
    {
        let maxSupportedOpenedWindows = Math.floor(this.viewPortTotalArea / this.windowSizeFactor);
        let difference = this.windows.length - maxSupportedOpenedWindows;

        if (difference >= 0){
            this.windows.splice(this.windows.length - 1 - difference);
        }
    }


    public onHistoyMessageReceived(result: MessageHistory[] , data:any){
        console.log('----------message history ------------------');
        console.log(result);
        let msgs :Message[] = Array<Message>();
        for(let msg of result){
            let newMsg :Message = new Message();
            if(msg.msgFrom === this.userNmae)
               newMsg.fromId = this.userId;
             else
             newMsg.fromId  = msg.msgFromId;

           if(msg.msgTo === this.userNmae)
             newMsg.toId = this.userId;
           else
              newMsg.toId = msg.msgToId;
            
           
             newMsg.message = msg.msg;
             newMsg.seenOn  = msg.createdOn;
             newMsg.updated_at = msg.createdOn;
             msgs.push(newMsg);
        }
        console.log('----------messages recived  history ------------------',msgs);

        for(let win of this.windows){
            console.log(win.chattingTo.displayName+'----------messages window  history ------------------'+ data.fromName.displayName);   
            if (win.chattingTo.displayName === data.toName.displayName  || win.chattingTo.displayName === data.fromName.displayName) {

                win.messages = [...msgs ];

            }

        }

    }


    public onUserDeatilChange(id:string,name:string):void{
        this.oldUserId = this.userId;
        this.userId = id;
        this.userNmae = name;
        this.isRecooneted = true;
        this.reConnectCunt = 0;
        this.adapter.listFriends()
        .map((users: User[]) => {
            this.users = users;
            console.log( this.isRecooneted+"---------------in user daetail 111111111 change ---------------------")
            this.reAssignWindowId(this.oldUserId);
        }).subscribe();

        console.log("---------------in user daetail change ---------------------")
        
    }
     
    private onUserOffLineMessageChangedHandler(name,id){
    
        let openedWindow = this.windows.find(x => x.chattingTo.displayName.trim() == name.trim());
        if(openedWindow){
            openedWindow.isOff = true;
        }
    }
    // Initializes the chat plugin and the messaging adapter
    private bootstrapChat(): void
    {
        if (this.adapter != null && this.userId != null)
        {
            this.viewPortTotalArea = window.innerWidth;

            // Binding event listeners
            this.adapter.messageReceivedHandler = (user, msg, hitory?) => this.onMessageReceived(user, msg, hitory );
            this.adapter.friendsListChangedHandler = (users) => this.onFriendsListChanged(users);
            this.adapter.onChangeIdHandler = (id,name) => this.onUserDeatilChange(id,name);
            this.adapter.onUserOffLineMessageChangedHandler = (name,id) => this.onUserOffLineMessageChangedHandler(name,id);
            this.adapter.messageHistoryReceivedHandler = (result , data) => this.onHistoyMessageReceived(result , data);
            // Loading current users list
            if (this.pollFriendsList){
                // Setting a long poll interval to update the friends list
                this.fetchFriendsList();
                setInterval(() => this.fetchFriendsList(), this.pollingInterval);
            }
            else
            {
                // Since polling was disabled, a friends list update mechanism will have to be implemented in the ChatAdapter.
                this.fetchFriendsList();
            }
            
            this.isBootsrapped = true;
        }

        if (!this.isBootsrapped){
            console.error("ng-chat component couldn't be bootstrapped.");
            
            if (this.userId == null){
                console.error("ng-chat can't be initialized without an user id. Please make sure you've provided an userId as a parameter of the ng-chat component.");
            }
            if (this.adapter == null){
                console.error("ng-chat can't be bootstrapped without a ChatAdapter. Please make sure you've provided a ChatAdapter implementation as a parameter of the ng-chat component.");
            }
        }
    }

    // Sends a request to load the friends list
    private fetchFriendsList(): void
    {
        this.adapter.listFriends()
        .map((users: User[]) => {
            this.users = users;
            
        }).subscribe();
    }

    private reAssignWindowId(oldId:string){
          console.log("------------------------reassignwindow----------------------------");
        for (let user of this.users){
            let openedWindow = this.windows.find(x => x.chattingTo.displayName.trim() == user.displayName.trim());
            console.log("openwindow", openedWindow)
            if(openedWindow){
             openedWindow.chattingTo.id =user.id;
             openedWindow.chattingTo.displayName = user.displayName;
             console.log("------------------------reassignwindow inside ----------------------------",openedWindow)
             for(let msg of openedWindow.messages){
                   
                console.log(msg.msgFrom+"------------------------reassignwindow----------------------------"+this.userNmae );
                    if( msg.msgFrom === this.userNmae)
                            msg.fromId = this.userId;
                    else
                        msg.fromId = user.id
                console.log( msg.msgTo+"------------------------reassignwindow----------------------------"+msg.msgFrom );
                    if( msg.msgTo === this.userNmae)
                        msg.toId = this.userId;
                    else
                        msg.toId  =  user.id
                      
                     
            }
            console.log("------------------------reassignwindow inside ----------------------------",openedWindow)
                console.log("openwindow", openedWindow.chattingTo);
            }
           
        }
    }

    // Updates the friends list via the event handler
    private onFriendsListChanged(users: User[]): void{
        if (users){
            this.users = users;
            this.setUsersStatus();
            console.log("-----user list changed -----------")
            if(this.isRecooneted)  {
                console.log(this.isRecooneted+"-----user list changed 1-----------")
                this.reAssignWindowId(this.oldUserId) ;
                setInterval(function(){this.isRecooneted = false;
                    console.log(this.isRecooneted+"-----in timer-----------")},50000);
            }  
        }
    }
	
	

    private onMessageReceived(user: User, message: Message, history?: any) {
        
        this.showChat = true;
        if(history && history.fromId ) {
                  history.recivedId = this.userId;
                  this.adapter.requestCurrentChatHistory(history);
          }
            
        if(user && message){
		    if(message.isTyping){
			
			  let openedWindow = this.windows.find(x => x.chattingTo.id == user.id);
			  if(openedWindow) openedWindow.isTyping = true;
			  
			}else{
			 
            let chatWindow = this.openChatWindow(user);
			  if(!chatWindow[0].hasFocus)this.onAudioPlay();
			chatWindow[0].isTyping = false;
            if (!chatWindow[1] || !this.historyEnabled){
                chatWindow[0].messages.push(message);
                this.scrollChatWindowToBottom(chatWindow[0]);
            }
			}
        }
    }

    // Opens a new chat whindow. Takes care of available viewport
    // Returns => [Window: Window object reference, boolean: Indicates if this window is a new chat window]
    private openChatWindow(user: User,isManual?:string): [Window, boolean]
    {
        // Is this window opened?
        let openedWindow = this.windows.find(x => x.chattingTo.id == user.id);
        if(!openedWindow) 
          openedWindow = this.windows.find(x => x.chattingTo.displayName == user.displayName);
           console.log("openwindow",openedWindow);

        if (!openedWindow)
        {
            let newChatWindow: Window = {
                chattingTo: user,
                messages:  [],
                isLoadingHistory: this.historyEnabled,
				isTyping:false,
                hasFocus: false // This will be triggered when the 'newMessage' input gets the current focus
            };

            // Loads the chat history via an RxJs Observable
            if (isManual)  {
                this.adapter.getMessageHistory(newChatWindow.chattingTo.displayName)
                .map((result: Message[]) => {
                    //newChatWindow.messages.push.apply(newChatWindow.messages, result);
                    if(result.length >= 1){
                    newChatWindow.messages = result.concat(newChatWindow.messages);
                    newChatWindow.isLoadingHistory = false;
                    setTimeout(() => { this.scrollChatWindowToBottom(newChatWindow)});
                    }
                }).subscribe();
            }

            this.windows.unshift(newChatWindow);

            // Is there enough space left in the view port ?
            if (this.windows.length * this.windowSizeFactor >= this.viewPortTotalArea - this.friendsListWidth){                
                this.windows.pop();
            }

            return [newChatWindow, true];
        }
        else
        {
            // Returns the existing chat window     
            return [openedWindow, false];       
        }
    }

    // Scrolls a chat window message flow to the bottom
    private scrollChatWindowToBottom(window: Window): void
    {
        if (!window.isCollapsed){
            let windowIndex = this.windows.indexOf(window);

            setTimeout(() => {
                this.chatMessageClusters.toArray()[windowIndex].nativeElement.scrollTop = this.chatMessageClusters.toArray()[windowIndex].nativeElement.scrollHeight;
            }); 
        }
    }

    // Marks all messages provided as read with the current time.
    private markMessagesAsRead(user: User, messages: Message[]): void
    {
        let currentDate = new Date();

        messages.forEach((msg)=>{
            msg.seenOn = currentDate;
        });
    }

    // Returns the total unread messages from a chat window. TODO: Could use some Angular pipes in the future 
    unreadMessagesTotal(window: Window): string
    {
        if (window){
            if (window.hasFocus){
                this.markMessagesAsRead(window.chattingTo, window.messages);
            }
            else{
			   
                let totalUnreadMessages = window.messages.filter(x => x.fromId != this.userId && !x.seenOn).length;
                
                if (totalUnreadMessages > 0){

                    if (totalUnreadMessages > 99) 
                        return  "99+";
                    else
                        return String(totalUnreadMessages); 
                }
            }
        }
            
        // Empty fallback.
        return "";
    }

    // Monitors pressed keys on a chat window and dispatch a message when the enter key is typed
    onChatInputTyped(event: any, window: Window): void
    {
        if (event.keyCode == 13 && window.newMessage && window.newMessage.trim() != "")
        {
            let message = new Message();
            message.fromId = this.userId;
            message.toId = window.chattingTo.id;
            message.message = window.newMessage;
            let date = new Date();
            message.updated_at=date;
            console.log(this.userNmae+"---message "+ window.chattingTo.displayName)
            message.msgFrom = this.userNmae;
            console.log("message.msgFrom"+message.msgFrom)
            message.msgTo = window.chattingTo.displayName;
			console.log("message.msgTo :"+message.msgTo );
            message.isTyping = false;
            console.log("---message--- ", message)
            window.messages.push(message);
            console.log("---message ", window.messages)
            this.adapter.sendMessage(message);
            window.newMessage = ""; // Resets the new message input
            this.scrollChatWindowToBottom(window);

        }else{
		    
			let message = new Message();
		    message.fromId = this.userId;
            message.toId = window.chattingTo.id;
            message.message = "typing@server";
            let date = new Date();
			message.updated_at=date;
            message.isTyping = true;
            message.msgFrom = this.userNmae;
            message.msgTo = window.chattingTo.displayName;
			console.log("date :"+message.updated_at);
            this.adapter.sendTyping(message);
		
		}
    }

    // Closes a chat window via the close 'X' button
    onCloseChatWindow(window: Window): void 
    {
        let index = this.windows.indexOf(window);

        this.windows.splice(index, 1);
    }

    // Toggle friends list visibility
    onChatTitleClicked(event: any): void
    {
        this.isCollapsed = !this.isCollapsed;
    }

    // Toggles a chat window visibility between maximized/minimized
    onChatWindowClicked(window: Window): void
    {
        window.isCollapsed = !window.isCollapsed;
        this.scrollChatWindowToBottom(window);
    }

    // Asserts if a user avatar is visible in a chat cluster
    isAvatarVisible(window: Window, message: Message, index: number): boolean
    {
        if (message.fromId != this.userId){
            if (index == 0){
                return true; // First message, good to show the thumbnail
            }
            else{
                // Check if the previous message belongs to the same user, if it belongs there is no need to show the avatar again to form the message cluster
                if (window.messages[index - 1].fromId != message.fromId ){
                    return true;
                }
            }
        }

        return false;
    }

    // Toggles a window focus on the focus/blur of a 'newMessage' input
    toggleWindowFocus(window: Window): void
    {
        window.hasFocus = !window.hasFocus;
    }
    
    // tslint:disable-next-line:one-line
    public setUsersStatus(){

        if(this.windows && this.windows.length > 0) {
            let i =0;
            let tempUsers:string[] =[]
            for (let user of this.users){
                const openedWindow = this.windows.find(x => x.chattingTo.displayName.trim() == user.displayName.trim());
                if(openedWindow){
                    openedWindow.chattingTo.status = user.status;
                }
                i++;
                tempUsers.push(user.displayName);
                if( i >= this.windows.length ) { break; }
               
            }
       
            if(i < this.windows.length) {
                
                for(let win of this.windows){
                    
                    const winName = tempUsers.find(x =>  x == win.chattingTo.displayName);
                    if(!winName) {
                     
                        win.chattingTo.status = UserStatus.Offline;

                    }
                }

            }

        }

       
    }
	public onStatusChange(event){
	 event.preventDefault();
	 event.stopPropagation();
	 this.adapter.sendSatusChange({fromId:this.userId,status:this.status});
	}
}
