package com.jaz.chatapp.chat;

import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ChatDao {
    private final MongoTemplate mongoTemplate;

    public ChatDao(MongoTemplate _mongoTemplate){
        this.mongoTemplate = _mongoTemplate;
    }

    public List<ChatMessage> findAll(){
        var query = new Query();
        query.with(Sort.by(Sort.Direction.ASC, "date"));
        return mongoTemplate.find(query,ChatMessage.class);
    }

    public ChatMessage findById(String id){
        return mongoTemplate.findById(id,ChatMessage.class);
    }

    public void AddMessage(ChatMessage chatMessage){
        mongoTemplate.save(chatMessage);
    }

}
