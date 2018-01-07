import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
declare var $ :any;

@Component({
    moduleId: module.id,
    selector: 'user-list',
    templateUrl: 'user-list.component.html',
    styleUrls: ['user-list.component.css']
})
export class UserListComponent implements OnInit {
 
    private sortByKey: string;
    private searchText:string;
    
    constructor() { 

    }

    ngOnInit() { 
        $('.chat[data-chat=person2]').addClass('active-chat');
        $('.person[data-chat=person2]').addClass('active');
        $('.left .person').mousedown(function(){    
        if ($(this).hasClass('.active')) {        return false;    } else {       
                 var findChat = $(this).attr('data-chat');  
                 var personName = $(this).find('.name').text();      
                  $('.right .top .name').html(personName);       
                  $('.chat').removeClass('active-chat'); 
                 $('.left .person').removeClass('active');  
                 $(this).addClass('active');  
                 $('.chat[data-chat = '+findChat+']').addClass('active-chat');   
                 }});      
    }


}

