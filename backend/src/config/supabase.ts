import { createClient } from '@supabase/supabase-js'
import { config } from './environment'
import { logger } from '@/utils/logger'

// Supabase client for admin operations (service role)
export const supabaseAdmin = config.supabase.url && config.supabase.serviceRoleKey
  ? createClient(config.supabase.url, config.supabase.serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null

// Supabase client for public operations (anon key)
export const supabasePublic = config.supabase.url && config.supabase.anonKey
  ? createClient(config.supabase.url, config.supabase.anonKey)
  : null

// Initialize Supabase connection
export async function initializeSupabase() {
  try {
    if (!config.supabase.url) {
      logger.warn('⚠️ Supabase URL não configurada - usando apenas Prisma')
      return false
    }

    if (!config.supabase.serviceRoleKey) {
      logger.warn('⚠️ Supabase Service Role Key não configurada')
      return false
    }

    // Test admin connection
    if (supabaseAdmin) {
      const { data, error } = await supabaseAdmin.from('users').select('count', { count: 'exact', head: true })
      
      if (error) {
        logger.error('❌ Erro ao conectar com Supabase:', error.message)
        return false
      }
      
      logger.info('✅ Supabase Admin conectado com sucesso')
    }

    // Test public connection
    if (supabasePublic) {
      const { data, error } = await supabasePublic.auth.getSession()
      logger.info('✅ Supabase Public client inicializado')
    }

    return true
  } catch (error) {
    logger.error('❌ Erro ao inicializar Supabase:', error)
    return false
  }
}

// Helper function to get user from Supabase Auth
export async function getSupabaseUser(accessToken: string) {
  if (!supabaseAdmin) return null

  try {
    const { data, error } = await supabaseAdmin.auth.getUser(accessToken)
    
    if (error) {
      logger.error('Erro ao obter usuário do Supabase:', error.message)
      return null
    }

    return data.user
  } catch (error) {
    logger.error('Erro ao verificar token Supabase:', error)
    return null
  }
}

export { createClient }