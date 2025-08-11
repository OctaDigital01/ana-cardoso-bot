import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '@/config/environment'
import { prisma } from '@/config/database'

interface JwtPayload {
  id: string
  email: string
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string
        email: string
      }
    }
  }
}

export async function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    
    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' })
    }

    const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload
    
    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    })

    if (!user || !user.active) {
      return res.status(401).json({ error: 'Usuário não autorizado' })
    }

    req.user = {
      id: decoded.id,
      email: decoded.email
    }

    next()
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' })
  }
}