import { Request, Response } from 'express';
import { UserService } from '../services/user.service';

const userService = new UserService();

export class UserController {
  async createUser(req: Request, res: Response) {
    try {
      const user = await userService.createUser(req.body);
      // No enviar el hash de la contraseña
      const { passwordHash, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);
      
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      
      const { passwordHash, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await userService.getAllUsers();
      // No enviar hashes de contraseñas
      const usersWithoutPasswords = users.map(({ passwordHash, ...user }) => user);
      res.json(usersWithoutPasswords);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await userService.updateUser(id, req.body);
      
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      
      const { passwordHash, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await userService.deleteUser(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Asocia una wallet a un usuario o crea un usuario basado en wallet
   * POST /api/users/wallet
   */
  async associateWallet(req: Request, res: Response) {
    try {
      const { walletAddress, name, email } = req.body;

      if (!walletAddress) {
        return res.status(400).json({ error: 'walletAddress es requerido' });
      }

      // Buscar usuario existente por wallet
      let user = await userService.getUserByWalletAddress(walletAddress);

      if (!user) {
        // Crear nuevo usuario basado en wallet
        user = await userService.createUserFromWallet(walletAddress, name, email);
      } else if (name || email) {
        // Actualizar nombre o email si se proporciona
        user = await userService.updateUser(user.id, { name, email });
      }

      const { passwordHash, ...userWithoutPassword } = user;
      res.json({
        success: true,
        data: userWithoutPassword
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}

