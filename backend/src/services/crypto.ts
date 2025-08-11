import CryptoJS from 'crypto-js'
import { config } from '@/config/environment'

export class CryptoService {
  private static encryptionKey = config.encryptionKey || 'telegrambotmanager32charkey12345'

  static encrypt(text: string): string {
    return CryptoJS.AES.encrypt(text, this.encryptionKey).toString()
  }

  static decrypt(encryptedText: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedText, this.encryptionKey)
    return bytes.toString(CryptoJS.enc.Utf8)
  }

  static hashPassword(password: string): string {
    return CryptoJS.SHA256(password).toString()
  }

  static comparePassword(password: string, hash: string): boolean {
    return this.hashPassword(password) === hash
  }
}