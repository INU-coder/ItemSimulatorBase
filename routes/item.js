import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();

// [심화] 라우터마다 prisma 클라이언트를 생성하고 있다. 더 좋은 방법이 있지 않을까?
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
  errorFormat: 'pretty',
});

// [필수] 1. 아이템 생성
// 1. 아이템 코드, 아이템 명, 아이템 능력, 아이템 가격을 req(request)에서 json으로 전달받기
// 2. 데이터베이스에 아이템 저장하기
router.post('/item/create/:itemId', async (req, res) => {
  try {
    const itemCode = req.body.item_code;
    const itemName = req.body.item_name;
    const atk = req.body.atk;
    const price = req.body.price;

    const createItem = await prisma.item.create({
      data: {
        itemCode: itemCode,
        itemName: itemName,
        atk: atk,
        price: price,
      }, 
    });

    res.status(200).json({ item_info: createItem });
    console.log(createItem);
   } catch (error) { // 클라이언트에게 에러 코드 자체를 출력
   console.error("에러가 발생 했습니다.", error);

   res.status(500).json({
    error: '실패했습니다.',
    message: error.message || '알 수 없는 오류가 발생했습니다.'
    // catch (error) { 
  //   res.status(500).json({ error: error}) -> error:error / error:'에러가 발생했습니다.'
  //  console.log(error);
  });
}
});
  // console.log('item create');

// [필수] 2. 아이템 목록 조회
router.get('/item/list', async (req, res) => {
  try {
    const itemList = await prisma.item.findMany();
    res.status(200).json({ items: itemList });
  } catch (error) {
    console.error('아이템 목록 조회 실패:', error);
    res.status(500).json({
      error: '실패했습니다.',
      message: error.message || '알 수 없는 오류가 발생했습니다.',
    });
  }
});

// [필수] 3. 특정 아이템 조회
// 아이템 코드는 URL의 parameter로 전달받기
router.get('/item/:itemCode', async (req, res) => {
  try {
  const itemCode = parseInt(req.params.itemCode); // string

  const result = await prisma.item.findUnique({ where: { itemCode: parseInt(itemCode)}});
  //const result = await prisma.item.findUnique({ where: { itemCode: parseInt(itemCode)}});
  // 위 코드에서 itemCode: itemCode 이렇게 쓰면 스트링으로 간다. 따라서 숫자로 바꿔주어야하는데,
  // 그방법이 parseInt(itemCode) or +itemCode 를 사용하면된다. +기능은 prisma에서 지원하는 기능.
  
  if (findItem == null) {
    res.status(404).json({error: '헉! 그런... 아이템은... 존재하지 않는데...!' });
    return;
  }
  
  res.status(200).json({ item_info: findItem });
} catch (error) {
  res.status(500).json({ error: '아이템 조회에 실패했어요.'});
  console.log(error);
}
});

// [필수] 4. 특정 아이템 수정
// 아이템 코드는 URL의 parameter로 전달 받기
// 수정할 아이템 명, 아이템 능력을 req(request)에서 json으로 전달받기
router.post('/item/update', (req, res) => {
  prisma.item.update();
});

export default router;
