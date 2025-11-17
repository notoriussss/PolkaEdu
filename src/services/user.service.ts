/**
 * Servicio para interactuar con la API de usuarios
 */

import { apiClient } from '@/src/config/api';

export interface User {
  id: string;
  email: string;
  name?: string;
  walletAddress?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AssociateWalletRequest {
  walletAddress: string;
  name?: string;
  email?: string;
}

export interface AssociateWalletResponse {
  success: boolean;
  data: User;
}

export class UserService {
  /**
   * Asocia una wallet a un usuario o crea un usuario basado en wallet
   */
  async associateWallet(data: AssociateWalletRequest): Promise<AssociateWalletResponse> {
    try {
      const response = await apiClient.post<AssociateWalletResponse>('/api/users/wallet', data);
      return response;
    } catch (error) {
      console.error('Error al asociar wallet:', error);
      throw error;
    }
  }

  /**
   * Obtiene un usuario por ID
   */
  async getUserById(id: string): Promise<User> {
    try {
      const user = await apiClient.get<User>(`/api/users/${id}`);
      return user;
    } catch (error) {
      console.error(`Error al obtener el usuario ${id}:`, error);
      throw error;
    }
  }
}

// Instancia singleton del servicio
export const userService = new UserService();

