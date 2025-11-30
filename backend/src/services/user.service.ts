import { storage, User } from '../storage/memory-storage';
import * as bcrypt from 'bcryptjs';

export class UserService {
  /**
   * Crea un nuevo usuario
   */
  async createUser(data: {
    email: string;
    password: string;
    name?: string;
    walletAddress?: string;
  }) {
    // Verificar que el email no esté en uso
    const existing = storage.getUserByEmail(data.email);
    if (existing) {
      throw new Error('El email ya está registrado');
    }

    // Hash de la contraseña
    const passwordHash = await bcrypt.hash(data.password, 10);

    return storage.createUser({
      email: data.email,
      passwordHash,
      name: data.name,
      walletAddress: data.walletAddress
    });
  }

  /**
   * Obtiene un usuario por ID
   */
  async getUserById(id: string) {
    return storage.getUserById(id);
  }

  /**
   * Obtiene un usuario por email
   */
  async getUserByEmail(email: string) {
    return storage.getUserByEmail(email);
  }

  /**
   * Obtiene todos los usuarios
   */
  async getAllUsers() {
    return storage.getAllUsers();
  }

  /**
   * Actualiza un usuario
   */
  async updateUser(id: string, data: Partial<{
    email: string;
    name: string;
    walletAddress: string;
  }>) {
    return storage.updateUser(id, data);
  }

  /**
   * Elimina un usuario
   */
  async deleteUser(id: string) {
    const deleted = storage.deleteUser(id);
    if (!deleted) {
      throw new Error('Usuario no encontrado');
    }
    return { success: true };
  }

  /**
   * Verifica credenciales de usuario
   */
  async verifyCredentials(email: string, password: string): Promise<User | null> {
    const user = storage.getUserByEmail(email);
    if (!user) {
      return null;
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    return isValid ? user : null;
  }

  /**
   * Obtiene un usuario por dirección de wallet
   */
  async getUserByWalletAddress(walletAddress: string): Promise<User | undefined> {
    return storage.getUserByWalletAddress(walletAddress);
  }

  /**
   * Crea un usuario basado en wallet (sin contraseña)
   */
  async createUserFromWallet(walletAddress: string, name?: string, email?: string): Promise<User> {
    // Verificar que la wallet no esté ya asociada
    const existing = storage.getUserByWalletAddress(walletAddress);
    if (existing) {
      throw new Error('Esta wallet ya está asociada a un usuario');
    }

    // Si se proporciona email, verificar que no esté en uso
    if (email) {
      const existingEmail = storage.getUserByEmail(email);
      if (existingEmail) {
        throw new Error('El email ya está registrado');
      }
    }

    // Crear usuario con wallet (sin contraseña requerida)
    return storage.createUser({
      email: email || `wallet_${walletAddress.slice(0, 8)}@polkaedu.local`,
      passwordHash: '', // Sin contraseña para usuarios basados en wallet
      name: name || `Usuario ${walletAddress.slice(0, 8)}`,
      walletAddress
    });
  }
}

