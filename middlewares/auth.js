import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(400).json({ error: '인증 정보가 없습니다.' });
    }

    const tokenInfo = authHeader.split(' ');
    if (tokenInfo.length !== 2 || tokenInfo[0] !== 'Bearer') {
      return res.status(400).json({ error: '잘못된 인증 정보입니다.' });
    }

    const token = tokenInfo[1];
    const decodeToken = jwt.verify(token, process.env.JWT_SECRET || 'secretOrPrivateKey');
    const accountInfo = await prisma.account.findUnique({
      where: { accountId: decodeToken.accountId },
      select: { accountId: true, userName: true },
    });

    if (!accountInfo) {
      return res.status(400).json({ error: '계정 정보를 찾을 수 없습니다.' });
    }

    req.accountInfo = accountInfo;
    next();
  } catch (error) {
    return res.status(400).json({ error: '인증에 실패했습니다.' });
  }
};

export default authMiddleware;
