package com.jaz.chatapp.chat;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;
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
    public void loadMessages(SimpMessageHeaderAccessor accessor) {
        String username = (String) accessor.getSessionAttributes().get("username");
        if (username == null) {
            System.out.println("Username missing in session!");
            return;
        }

        List<ChatMessage> messages = chatDao.findAll();
        System.out.println("Sending " + messages.size() + " messages to user: " + username);
        simpMessagingTemplate.convertAndSendToUser(username, "/queue/messages", messages);
    }


}
