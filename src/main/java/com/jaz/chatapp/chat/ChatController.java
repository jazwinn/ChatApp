package com.jaz.chatapp.chat;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;
import java.util.List;

@Controller
public class ChatController {

    private final ChatDao chatDao;
    private final SimpMessagingTemplate simpMessagingTemplate;

    public ChatController(ChatDao chatDao, SimpMessagingTemplate simpMessagingTemplate) {
        this.chatDao = chatDao;
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public ChatMessage sendMessage(@Payload ChatMessage sendMessage){
        sendMessage.setDate(LocalDateTime.now());
        chatDao.AddMessage(sendMessage);
        return sendMessage;
    }


    @MessageMapping("/chat.addUser")
    @SendTo("/topic/public")
    public ChatMessage addUser(@Payload ChatMessage sendMessage, SimpMessageHeaderAccessor headerAccessor){
        //adds username to websocket
        headerAccessor.getSessionAttributes().put("username", sendMessage.getSender());

        return sendMessage;
    }

    @MessageMapping("/chat.loadMessages")
    public void loadMessages(SimpMessageHeaderAccessor headerAccessor){
        String username = (String) headerAccessor.getSessionAttributes().get("username");
        List<ChatMessage> messages = chatDao.findAll();
        simpMessagingTemplate.convertAndSendToUser(username, "/queue/messages", messages);
        System.out.println("Sending messages to user: " + username + " -> " + messages);
    }

}
