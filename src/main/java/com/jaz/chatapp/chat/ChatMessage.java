package com.jaz.chatapp.chat;

import lombok.*;

import java.awt.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatMessage {

    String Message;
    String Sender;
    MessageType Type;
}
