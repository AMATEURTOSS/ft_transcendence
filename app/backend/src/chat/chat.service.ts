import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatDto2 } from 'src/dto/chat';
import { ErrMsgDto } from 'src/dto/utility';
import { Chat } from 'src/entities/chat';
import { ChatUsers } from 'src/entities/chat-users';
import { Users } from 'src/entities/users';
import { err0, err10, err13, err15, err2, err24, err4, err6, err8, err9 } from 'src/err';
import { Repository } from 'typeorm';
import { ChatGateway } from './chat.gateway';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Users) private usersRepo: Repository<Users>,
    @InjectRepository(Chat) private chatRepo: Repository<Chat>,
    @InjectRepository(ChatUsers) private chatUsersRepo: Repository<ChatUsers>,
    private chatGateway: ChatGateway,
    ){}

  async createChat(owner_id: string, title: string, type: string, passwd: string, max_people: number){
    if (await this.usersRepo.count({user_id: owner_id}) === 0)  // 존재하지 않은 유저 라면
      return new ErrMsgDto(err2);
    if (type != 'public' && type != 'protected' && type != 'private')  // 존재하지 않은 방 타입이면
      return new ErrMsgDto(err6);
    if (type != 'protected' && passwd != '')  // 방타입이 protected가 아닌데 비밀번호가 있으면
      return new ErrMsgDto(err10);
    if (20 < max_people)  // 채널 최대 인원의 최대값 보다 크면
      return new ErrMsgDto(err15);
    if (await this.chatUsersRepo.count({user_id: owner_id}))  // 이미 다른방에 있는 유저 라면
      return new ErrMsgDto(err9);
    const newChat = await this.chatRepo.save({owner_id: owner_id, title: title, type: type, passwd: passwd, max_people: max_people});
    await this.chatUsersRepo.save({channel_id: newChat.channel_id, user_id: owner_id})  // 새로만든 채널에 owner 추가
    return {channel_id: newChat.channel_id};
    // return new ErrMsgDto(err0);
  }

  async readChat(){
    const chat = await this.chatRepo.find();  // 모든 채널
    let chatList = { chatList: Array<ChatDto2>() }
    let current_people;
    // 모든 채널의 제목, 타입, 현재인원 ,최대인원, 채널아이디만 담기
    for(var i in chat){
      if (chat[i].type === 'private')  // private 채널이면
        continue ;
      chatList.chatList.push(new ChatDto2());
      chatList.chatList[i].title = chat[i].title;
      chatList.chatList[i].type = chat[i].type;
      current_people = await this.readPeople(chat[i].channel_id);
      chatList.chatList[i].current_people = current_people;
      chatList.chatList[i].max_people = chat[i].max_people;
      chatList.chatList[i].channel_id = chat[i].channel_id;
    }
    return chatList;
  }
  async readTitle(title: string){
    const chat = await this.chatRepo.find();  // 모든 채널
    let chatList = { chatList: Array<ChatDto2>() }
    let current_people;
    let idx = -1;
    // 검색한 제목을 포함하는 채널의 제목, 타입, 현재인원, 최대인원, 채널아이디만 담기
    for(var i in chat){
      if ((chat[i].title.indexOf(title) == -1) || chat[i].type === 'private')  // 검색한 제목이 채널에 포함되지 않거나 private 채널이면
        continue ;
      chatList.chatList.push(new ChatDto2());
      chatList.chatList[++idx].title = chat[i].title;
      chatList.chatList[idx].type = chat[i].type;
      current_people = await this.readPeople(chat[i].channel_id);
      chatList.chatList[idx].current_people = current_people;
      chatList.chatList[idx].max_people = chat[i].max_people;
      chatList.chatList[idx].channel_id = chat[i].channel_id;
    }
    return chatList;
  }
  async readOwner(channel_id: number){
    if (await this.chatRepo.count({channel_id: channel_id}) === 0)  // 존재하지 않은 채널이면
      return new ErrMsgDto(err4);
    const chanel = await this.chatRepo.find({channel_id: channel_id});  // 채널 찾기
    return chanel[0].owner_id; 
  }
  async readPeople(channel_id: number){
    if (await this.chatRepo.count({channel_id: channel_id}) === 0)  // 존재하지 않은 채널이면
      return new ErrMsgDto(err4);
    let people = await this.chatUsersRepo.count({channel_id: channel_id});
    return people;
  }

  async updateChat(channel_id: number, title: string, type: string, passwd: string, max_people: number){
    if (type != 'public' && type != 'protected' && type != 'private')  // 존재하지 않은 방 타입이면
      return new ErrMsgDto(err6);
    if (type != 'protected' && passwd != '')  // 방타입이 protected가 아닌데 비밀번호가 있으면
      return new ErrMsgDto(err10);
    if (20 < max_people)  // 채널 최대 인원의 최대값 보다 크면
      return new ErrMsgDto(err15);
    if (await this.chatRepo.count({channel_id: channel_id}) === 0)  // 존재하지 않은 채널이면
      return new ErrMsgDto(err4);
    let current_people = await this.readPeople(channel_id);
    if (max_people < current_people)
      return new ErrMsgDto(err24);
    await this.chatRepo.save({channel_id: channel_id, title: title, type: type, passwd: passwd, max_people: max_people});
    return new ErrMsgDto(err0);
  }

  async updateOwner(channel_id: number, owner_id:string){
    if (await this.chatRepo.count({channel_id: channel_id}) === 0)  // 존재하지 않은 채널이면
      return new ErrMsgDto(err4);
    if (await this.usersRepo.count({user_id: owner_id}) === 0)  // 존재하지 않은 유저 라면
      return new ErrMsgDto(err2);
    if (await this.chatUsersRepo.count({channel_id: channel_id, user_id: owner_id}) === 0)  // 채널에 해당 유저가 없으면
      return new ErrMsgDto(err13);
    await this.chatRepo.save({channel_id: channel_id, owner_id: owner_id});
    return new ErrMsgDto(err0);
  }

  async deleteChat(channel_id: number){
    if (await this.chatRepo.count({channel_id: channel_id}) === 0)  // 존재하지 않은 채널이면
      return new ErrMsgDto(err4);
    if (await this.chatUsersRepo.count({channel_id: channel_id}))  // 채널에 사람이 남아 있으면
      return new ErrMsgDto(err8);
    await this.chatRepo.delete({channel_id: channel_id});
    return new ErrMsgDto(err0);
  }

  async emitChat(channel_id: string, userId: string, chatContent: string) {
    const chat = {
      user: userId,
      chat: chatContent,
    };
    this.chatGateway.server.to(channel_id).emit('message', chat);
  }
}