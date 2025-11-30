import { Request, Response } from 'express';
import { storage } from '../storage/memory-storage';
import { UserService } from '../services/user.service';

const userService = new UserService();

export class CertificateController {
  /**
   * Obtiene todos los certificados
   * GET /api/certificates
   */
  async getAllCertificates(req: Request, res: Response) {
    try {
      const certificates = storage.getAllCertificates();
      
      const serialized = certificates.map(cert => ({
        id: cert.id,
        enrollmentId: cert.enrollmentId,
        userId: cert.userId,
        courseId: cert.courseId,
        nftTokenId: cert.nftTokenId,
        nftCollectionId: cert.nftCollectionId,
        transactionHash: cert.transactionHash,
        metadataUrl: cert.metadataUrl,
        issuedAt: cert.issuedAt instanceof Date ? cert.issuedAt.toISOString() : cert.issuedAt
      }));
      
      res.json({
        success: true,
        count: serialized.length,
        certificates: serialized
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Obtiene todos los certificados de un usuario
   * GET /api/certificates/user/:userId
   */
  async getUserCertificates(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      
      const certificates = storage.getAllCertificates().filter(c => c.userId === userId);
      
      const serialized = certificates.map(cert => ({
        id: cert.id,
        enrollmentId: cert.enrollmentId,
        userId: cert.userId,
        courseId: cert.courseId,
        nftTokenId: cert.nftTokenId,
        nftCollectionId: cert.nftCollectionId,
        transactionHash: cert.transactionHash,
        metadataUrl: cert.metadataUrl,
        issuedAt: cert.issuedAt instanceof Date ? cert.issuedAt.toISOString() : cert.issuedAt
      }));
      
      res.json({
        success: true,
        userId,
        count: serialized.length,
        certificates: serialized
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Obtiene todos los certificados de un usuario por wallet address
   * GET /api/certificates/wallet/:walletAddress
   */
  async getCertificatesByWallet(req: Request, res: Response) {
    try {
      const { walletAddress } = req.params;
      
      // Obtener usuario por wallet
      const user = await userService.getUserByWalletAddress(walletAddress);
      if (!user) {
        return res.json({
          success: true,
          walletAddress,
          count: 0,
          certificates: []
        });
      }
      
      const certificates = storage.getAllCertificates().filter(c => c.userId === user.id);
      
      const serialized = certificates.map(cert => ({
        id: cert.id,
        enrollmentId: cert.enrollmentId,
        userId: cert.userId,
        courseId: cert.courseId,
        nftTokenId: cert.nftTokenId,
        nftCollectionId: cert.nftCollectionId,
        transactionHash: cert.transactionHash,
        metadataUrl: cert.metadataUrl,
        issuedAt: cert.issuedAt instanceof Date ? cert.issuedAt.toISOString() : cert.issuedAt
      }));
      
      res.json({
        success: true,
        walletAddress,
        userId: user.id,
        count: serialized.length,
        certificates: serialized
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Obtiene un certificado por ID
   * GET /api/certificates/:id
   */
  async getCertificateById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const certificate = storage.getCertificateById(id);
      
      if (!certificate) {
        return res.status(404).json({ error: 'Certificado no encontrado' });
      }
      
      res.json({
        success: true,
        certificate: {
          id: certificate.id,
          enrollmentId: certificate.enrollmentId,
          userId: certificate.userId,
          courseId: certificate.courseId,
          nftTokenId: certificate.nftTokenId,
          nftCollectionId: certificate.nftCollectionId,
          transactionHash: certificate.transactionHash,
          metadataUrl: certificate.metadataUrl,
          issuedAt: certificate.issuedAt instanceof Date ? certificate.issuedAt.toISOString() : certificate.issuedAt
        }
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

