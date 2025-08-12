import { Router } from 'express'
import { supabasePublic, supabaseAdmin } from '@/config/supabase'
import { prisma } from '@/config/database'
import { logger } from '@/utils/logger'
import crypto from 'crypto'

const router = Router()

// Status endpoint
router.get('/status', (req, res) => {
  res.json({ 
    message: 'Auth routes funcionando',
    timestamp: new Date().toISOString(),
    supabase: {
      configured: !!supabasePublic,
      admin: !!supabaseAdmin
    }
  })
})

// Register - Hybrid Supabase + Local Auth
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body

    if (!email || !password || !name) {
      return res.status(400).json({ 
        message: 'Email, senha e nome são obrigatórios' 
      })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return res.status(400).json({ message: 'Email já está em uso' })
    }

    let userId: string
    let supabaseUser: any = null

    // Try Supabase first, fallback to local
    if (supabasePublic) {
      try {
        const { data, error } = await supabasePublic.auth.signUp({
          email,
          password,
          options: {
            data: { name }
          }
        })

        if (!error && data.user) {
          userId = data.user.id
          supabaseUser = data.user
          logger.info('✅ Usuario criado com Supabase Auth')
        } else {
          throw new Error(error?.message || 'Supabase signup failed')
        }
      } catch (supabaseError) {
        logger.warn('⚠️ Supabase signup failed, using local auth:', supabaseError)
        // Generate a UUID for local user
        userId = crypto.randomUUID()
      }
    } else {
      userId = crypto.randomUUID()
      logger.info('📝 Using local auth (no Supabase)')
    }

    // Save user in our database
    const bcrypt = require('bcryptjs')
    const hashedPassword = await bcrypt.hash(password, 12)
    
    const user = await prisma.user.create({
      data: {
        id: userId,
        name,
        email,
        password: hashedPassword,
        emailVerified: supabaseUser?.email_confirmed_at ? new Date(supabaseUser.email_confirmed_at) : null
      }
    })

    // Generate our own JWT
    const jwt = require('jsonwebtoken')
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    )

    const { password: _, ...userWithoutPassword } = user

    res.status(201).json({
      user: userWithoutPassword,
      accessToken: token,
      refreshToken: token, // Using same token for simplicity
      message: 'Usuário criado com sucesso',
      authMethod: supabaseUser ? 'supabase' : 'local'
    })
  } catch (error) {
    logger.error('Register error:', error)
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
})

// Login - Hybrid Supabase + Local Auth
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email e senha são obrigatórios' 
      })
    }

    // Find user in our database
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas' })
    }

    let loginSuccess = false
    let authMethod = 'local'

    // Try Supabase first if configured
    if (supabasePublic) {
      try {
        const { data, error } = await supabasePublic.auth.signInWithPassword({
          email,
          password
        })

        if (!error && data.user) {
          loginSuccess = true
          authMethod = 'supabase'
          logger.info('✅ Login com Supabase Auth bem-sucedido')
        }
      } catch (supabaseError) {
        logger.warn('⚠️ Supabase login failed, trying local auth')
      }
    }

    // Fallback to local auth if Supabase failed or not configured
    if (!loginSuccess && user.password) {
      const bcrypt = require('bcryptjs')
      const validPassword = await bcrypt.compare(password, user.password)
      
      if (validPassword) {
        loginSuccess = true
        authMethod = 'local'
        logger.info('✅ Login local bem-sucedido')
      }
    }

    if (!loginSuccess) {
      return res.status(401).json({ message: 'Credenciais inválidas' })
    }

    // Update last sign in
    await prisma.user.update({
      where: { id: user.id },
      data: { lastSignInAt: new Date() }
    })

    // Generate our own JWT
    const jwt = require('jsonwebtoken')
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    )

    const { password: _, ...userWithoutPassword } = user

    res.json({
      user: userWithoutPassword,
      accessToken: token,
      refreshToken: token,
      authMethod
    })
  } catch (error) {
    logger.error('Login error:', error)
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
})

// Logout
router.post('/logout', async (req, res) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader?.replace('Bearer ', '')

    if (token && supabasePublic) {
      await supabasePublic.auth.signOut()
    }

    res.json({ message: 'Logout realizado com sucesso' })
  } catch (error) {
    logger.error('Logout error:', error)
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
})

// Get current user - Hybrid JWT + Supabase
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return res.status(401).json({ message: 'Token não fornecido' })
    }

    let userId: string | null = null

    // Try our JWT first
    try {
      const jwt = require('jsonwebtoken')
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret')
      if (decoded && typeof decoded === 'object' && 'userId' in decoded) {
        userId = decoded.userId
        logger.info('✅ Token JWT local válido')
      }
    } catch (jwtError) {
      logger.info('⚠️ Token JWT local inválido, tentando Supabase...')
    }

    // Fallback to Supabase if local JWT failed
    if (!userId && supabaseAdmin) {
      try {
        const { data, error } = await supabaseAdmin.auth.getUser(token)
        
        if (!error && data.user) {
          userId = data.user.id
          logger.info('✅ Token Supabase válido')
        }
      } catch (supabaseError) {
        logger.warn('⚠️ Token Supabase também inválido')
      }
    }

    if (!userId) {
      return res.status(401).json({ message: 'Token inválido' })
    }

    // Get user from our database
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' })
    }

    const { password: _, ...userWithoutPassword } = user

    res.json(userWithoutPassword)
  } catch (error) {
    logger.error('Get user error:', error)
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
})

export { router as authRoutes }