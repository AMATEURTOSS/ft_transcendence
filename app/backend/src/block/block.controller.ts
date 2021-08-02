import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { boolean, string } from 'joi';
import { BlockDto1, BlockDto2, BlockDto3 } from 'src/dto/block';
import { BlockService } from './block.service';

@ApiTags('Block')
@Controller('block')
export class BlockController {
  constructor(private blockService: BlockService){}

  @ApiOperation({ summary: '차단 추가', description: '친구인 상태이면 친구 삭제'})
  @ApiResponse({ type: string, description: '차단 추가 실패시 실패이유' })
  @ApiBody({ type: BlockDto1, description: '내 유저 아이디, 차단할 유저 아이디' })
  @Post()
  createBlock(@Body() b: BlockDto1){
    return this.blockService.createBlock(b.user_id, b.block_id);
  }

  @ApiOperation({ summary: '해당 유저의 차단 목록 검색'})
  @ApiResponse({ 
    type: BlockDto2, 
    description: `
      해당 유저의 차단 아이디 배열
      검색 실패시 실패 이유 반환
    ` })
  @ApiBody({ type: BlockDto3, description: '차단 목록을 검색할 유저 아이디' })
  @Get()
  readblock(@Body() b: BlockDto3){
    return this.blockService.readBlock(b.user_id);
  }

  @ApiOperation({ summary: '해당 유저가 차단한 유저 인지 확인'})
  @ApiResponse({
    type: boolean, 
    description: `
      이미 차단한 유저 이면 true, 아니면 false
      확인 실패시 실패 이유 반환
    ` })
  @ApiBody({ type: BlockDto1, description: '차단 했는지 확인할 유저아이디, 채널아이디' })
  @Get()
  isBlock(@Body() b: BlockDto1){
    return this.blockService.isBlock(b.user_id, b.block_id);
  }

  @ApiOperation({ summary: '차단 해제'})
  @ApiResponse({ type: string, description: '차단 해제 실패시 실패이유' })
  @ApiBody({ type: BlockDto1, description: '내 유저 아이디, 차단할 유저 아이디' })
  @Delete()
  deleteBlock(@Body() b: BlockDto1){
    return this.blockService.deleteBlock(b.user_id, b.block_id);
  }

  @ApiOperation({ summary: '해당 유저에 대한 모든 차단 관계 해제', description: '회원 탈퇴시 에만 사용됨'})
  @ApiResponse({ type: string, description: '차단 해제 실패시 실패이유' })
  @ApiBody({ type: BlockDto3, description: '모든 차단 관계를 해제할 유저 아이디' })
  @Delete('all')
  deleteAllBlock(@Body() b: BlockDto3){
    return this.blockService.deleteAllBlock(b.user_id);
  }
}