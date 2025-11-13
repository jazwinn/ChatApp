package com.jaz.chatapp.chat;

import lombok.*;

import java.awt.*;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatMessage {
    private String id;
    private String message;
    private String sender;
    private MessageType type;
    private LocalDateTime Date;
}
