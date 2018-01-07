export class Message{
    public fromId: any;
    public toId: any;
    public message: string;
    public seenOn?: Date;
	public updated_at?:Date;
	public isTyping?:boolean;
	public msgFrom:string;
	public msgTo:string;
}