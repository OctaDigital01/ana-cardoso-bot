import { Request, Response, NextFunction } from 'express'
import { logger } from '@/utils/logger'
import { config } from '@/config/environment'

export interface AppError extends Error {
  statusCode?: number
  status?: string
  isOperational?: boolean
  code?: string
  details?: any
}

export class ValidationError extends Error {
  statusCode = 400
  status = 'error'
  isOperational = true
  code = 'VALIDATION_ERROR'
  details: any

  constructor(message: string, details?: any) {
    super(message)
    this.details = details
    this.name = 'ValidationError'
  }
}

export class AuthenticationError extends Error {
  statusCode = 401
  status = 'error'
  isOperational = true
  code = 'AUTHENTICATION_ERROR'

  constructor(message: string = 'Token de autenticação inválido ou expirado') {
    super(message)
    this.name = 'AuthenticationError'
  }
}

export class AuthorizationError extends Error {
  statusCode = 403
  status = 'error'
  isOperational = true
  code = 'AUTHORIZATION_ERROR'

  constructor(message: string = 'Sem permissão para acessar este recurso') {
    super(message)
    this.name = 'AuthorizationError'
  }
}

export class NotFoundError extends Error {
  statusCode = 404
  status = 'error'
  isOperational = true
  code = 'NOT_FOUND'

  constructor(message: string = 'Recurso não encontrado') {
    super(message)
    this.name = 'NotFoundError'
  }
}

export class ConflictError extends Error {
  statusCode = 409
  status = 'error'
  isOperational = true
  code = 'CONFLICT'

  constructor(message: string = 'Recurso já existe') {
    super(message)
    this.name = 'ConflictError'
  }
}

export class RateLimitError extends Error {
  statusCode = 429
  status = 'error'
  isOperational = true
  code = 'RATE_LIMIT_EXCEEDED'

  constructor(message: string = 'Muitas requisições. Tente novamente mais tarde') {
    super(message)
    this.name = 'RateLimitError'
  }
}

export class InternalServerError extends Error {
  statusCode = 500
  status = 'error'
  isOperational = false
  code = 'INTERNAL_SERVER_ERROR'

  constructor(message: string = 'Erro interno do servidor') {
    super(message)
    this.name = 'InternalServerError'
  }
}

// Função para determinar se um erro é operacional
function isOperationalError(error: AppError): boolean {
  if (error.isOperational) {
    return true
  }

  // Prisma errors
  if (error.name?.includes('Prisma')) {
    return true
  }

  // Joi validation errors
  if (error.name === 'ValidationError') {
    return true
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
    return true
  }

  return false
}

// Função para enviar resposta de erro para produção
function sendErrorProd(error: AppError, res: Response) {
  if (isOperationalError(error)) {
    res.status(error.statusCode || 500).json({
      error: {
        message: error.message,
        code: error.code || 'ERROR',
        ...(error.details && { details: error.details })
      }
    })
  } else {
    // Log do erro não operacional
    logger.error('Erro não operacional:', error)

    res.status(500).json({
      error: {
        message: 'Algo deu errado no servidor',
        code: 'INTERNAL_SERVER_ERROR'
      }
    })
  }
}

// Função para enviar resposta de erro para desenvolvimento
function sendErrorDev(error: AppError, res: Response) {
  res.status(error.statusCode || 500).json({
    error: {
      message: error.message,
      code: error.code || 'ERROR',
      status: error.status || 'error',
      stack: error.stack,
      ...(error.details && { details: error.details })
    }
  })
}

// Handler principal de erros
export function errorHandler(
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Set default values
  error.statusCode = error.statusCode || 500
  error.status = error.status || 'error'

  // Log do erro
  logger.error(`${req.method} ${req.originalUrl}`, {
    error: error.message,
    stack: error.stack,
    userId: (req as any).user?.id,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  })

  // Handle specific errors
  let err = { ...error }

  // Prisma errors
  if (error.name === 'PrismaClientKnownRequestError') {
    err = handlePrismaError(error as any)
  }

  // Joi validation errors
  if (error.name === 'ValidationError' && (error as any).details) {
    err = handleJoiError(error as any)
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    err = new AuthenticationError('Token inválido')
  }

  if (error.name === 'TokenExpiredError') {
    err = new AuthenticationError('Token expirado')
  }

  // Multer errors
  if (error.name === 'MulterError') {
    err = handleMulterError(error as any)
  }

  // Send error response
  if (config.nodeEnv === 'development') {
    sendErrorDev(err, res)
  } else {
    sendErrorProd(err, res)
  }
}

// Handler para erros do Prisma
function handlePrismaError(error: any): AppError {
  const { code, meta } = error

  switch (code) {
    case 'P2002':
      return new ConflictError(
        `Registro duplicado no campo: ${meta?.target?.join(', ') || 'unknown'}`
      )
    
    case 'P2025':
      return new NotFoundError('Registro não encontrado')
    
    case 'P2003':
      return new ValidationError('Violação de chave estrangeira')
    
    case 'P2014':
      return new ValidationError('Dados relacionados inválidos')
    
    default:
      return new InternalServerError('Erro no banco de dados')
  }
}

// Handler para erros do Joi
function handleJoiError(error: any): AppError {
  const details = error.details?.map((detail: any) => ({
    field: detail.path.join('.'),
    message: detail.message,
    value: detail.context?.value
  }))

  return new ValidationError('Dados inválidos', details)
}

// Handler para erros do Multer
function handleMulterError(error: any): AppError {
  switch (error.code) {
    case 'LIMIT_FILE_SIZE':
      return new ValidationError('Arquivo muito grande')
    
    case 'LIMIT_FILE_COUNT':
      return new ValidationError('Muitos arquivos')
    
    case 'LIMIT_UNEXPECTED_FILE':
      return new ValidationError('Campo de arquivo inesperado')
    
    default:
      return new ValidationError('Erro no upload do arquivo')
  }
}

// Handler para promises não tratadas
export function handleUncaughtExceptions() {
  process.on('uncaughtException', (error: Error) => {
    logger.error('Exceção não capturada:', error)
    
    // Graceful shutdown
    process.exit(1)
  })

  process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
    logger.error('Promise rejeitada não tratada:', {
      reason,
      promise: promise.toString()
    })
    
    // Convert to exception and let uncaughtException handler deal with it
    throw reason
  })
}

// Async wrapper para controllers
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

// Create error helper
export function createError(
  statusCode: number,
  message: string,
  code?: string,
  details?: any
): AppError {
  const error: AppError = new Error(message)
  error.statusCode = statusCode
  error.code = code || 'ERROR'
  error.isOperational = true
  error.details = details
  
  return error
}