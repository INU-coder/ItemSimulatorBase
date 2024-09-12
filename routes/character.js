import express from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import isValidAuth from '../middlewares/auth.js';
import authMiddleware from '../middlewares/auth.js';


const router = express.Router();

// [심화] 라우터마다 prisma 클라이언트를 생성하고 있다. 더 좋은 방법이 있지 않을까?
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
  errorFormat: 'pretty',
});

// [필수] 3. 캐릭터 생성
router.post('/character/create', authMiddleware, async (req, res) => {
  try {
    const { characterId, name, level } = req.body;
    const newCharacter = await prisma.character.create({
      data: {
        characterId: characterId,
        name: name,
        level: level,
      },
    });
    res.status(200).json({ message: '캐릭터 생성 성공', character: newCharacter });
  } catch (error) {
    console.error('캐릭터 생성 중 오류:', error);
    res.status(500).json({ error: '캐릭터 생성 실패' });
  }
});

// [필수] 4. 캐릭터 삭제
router.post('/character/delete', authMiddleware, async (req, res) => {
  try {
    const { characterId } = req.body; 
    const deletedCharacter = await prisma.character.delete({
      where: { characterId: characterId },
    });
    res.status(200).json({ message: '캐릭터 삭제 성공', character: deletedCharacter });
  } catch (error) {
    console.error('캐릭터 삭제 중 오류:', error);
    res.status(500).json({ error: '캐릭터 삭제 실패' });
  }
});

// [필수] 5. 캐릭터 상세 조회
router.get('/character/detail/:characterId', authMiddleware, async (req, res) => {
  try {
    const { characterId } = req.params; 
    const character = await prisma.character.findUnique({
      where: { characterId: parseInt(characterId) },
    });
    if (!character) {
      return res.status(404).json({ message: '캐릭터를 찾을 수 없습니다.' });
    }
    res.status(200).json({ message: '캐릭터 조회 성공', character: character });
  } catch (error) {
    console.error('캐릭터 조회 중 오류:', error);
    res.status(500).json({ error: '캐릭터 조회 실패' });
  }
});

// 6-3. [도전] "회원"에 귀속된 캐릭터를 생성하기
router.post('/character/createfromuser',authMiddleware, async (req, res) => {
  const authResult = await isValidAuth(req);
  console.log(`나와라ㅠㅠ: ${JSON.stringify(req.authResult)}`);
});


// 6-4. [도전] "회원"에 귀속된 캐릭터를 삭제하기
router.post('/character/deletefromuser', authMiddleware, async (req, res) => {
});

export default router;
