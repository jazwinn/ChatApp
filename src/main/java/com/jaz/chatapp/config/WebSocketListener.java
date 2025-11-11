package com.jaz.chatapp.config;

import com.jaz.chatapp.chat.ChatMessage;
import com.jaz.chatapp.chat.MessageType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketListener {

    private final SimpMessageSendingOperations simpMessageSendingOperations;

    @EventListener
    public void webSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String userName = headerAccessor.getSessionAttributes().get("username").toString();
        if(userName != null){
            log.info("User Disconnected {}", userName);
            var chatMessage = new ChatMessage().builder().
                    Sender(userName).
                    Type(MessageType.LEAVE).build();
            simpMessageSendingOperations.convertAndSend("/topic/public", chatMessage);

        }
    }
}
