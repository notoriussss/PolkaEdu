import { Request, Response } from 'express';
import { NFTService, NFTMetadata } from '../services/nft.service';

const nftService = new NFTService();

export class NFTController {
  /**
   * Crea un NFT y lo asocia a una cuenta
   * POST /api/nfts
   */
  async createNFT(req: Request, res: Response) {
    try {
      const { recipientAddress, metadata } = req.body;

      // Validar que se proporcionó la dirección del destinatario
      if (!recipientAddress) {
        return res.status(400).json({ 
          error: 'recipientAddress es requerido' 
        });
      }

      // Validar que la dirección es válida
      if (!nftService.validateAddress(recipientAddress)) {
        return res.status(400).json({ 
          error: 'Dirección de Polkadot inválida: formato SS58 incorrecto' 
        });
      }

      // Validar metadata mínima
      if (!metadata || !metadata.name || !metadata.description) {
        return res.status(400).json({ 
          error: 'metadata.name y metadata.description son requeridos' 
        });
      }

      // Crear el NFT y asociarlo a la cuenta
      const result = await nftService.createCertificateNFT(
        recipientAddress,
        metadata as NFTMetadata
      );

      res.status(201).json({
        success: true,
        message: 'NFT creado exitosamente',
        data: {
          tokenId: result.tokenId,
          transactionHash: result.transactionHash,
          recipientAddress,
          collectionId: process.env.NFT_COLLECTION_ID || '1'
        }
      });
    } catch (error: any) {
      console.error('Error al crear NFT:', error);
      res.status(500).json({ 
        error: error.message || 'Error al crear NFT' 
      });
    }
  }

  /**
   * Valida una dirección de Polkadot
   * POST /api/nfts/validate-address
   */
  async validateAddress(req: Request, res: Response) {
    try {
      const { address } = req.body;

      if (!address) {
        return res.status(400).json({ 
          error: 'address es requerido' 
        });
      }

      const isValid = nftService.validateAddress(address);

      res.json({
        valid: isValid,
        address,
        message: isValid 
          ? 'Dirección válida' 
          : 'Dirección inválida: formato SS58 incorrecto'
      });
    } catch (error: any) {
      res.status(500).json({ 
        error: error.message || 'Error al validar dirección' 
      });
    }
  }

  /**
   * Obtiene información de un NFT específico
   * GET /api/nfts/:collectionId/:tokenId
   */
  async getNFTInfo(req: Request, res: Response) {
    try {
      const { collectionId, tokenId } = req.params;

      if (!collectionId || !tokenId) {
        return res.status(400).json({ 
          error: 'collectionId y tokenId son requeridos' 
        });
      }

      const nftInfo = await nftService.getNFTInfo(collectionId, tokenId);

      res.json({
        success: true,
        data: {
          collectionId,
          tokenId,
          info: nftInfo
        }
      });
    } catch (error: any) {
      console.error('Error al obtener información del NFT:', error);
      res.status(500).json({ 
        error: error.message || 'Error al obtener información del NFT' 
      });
    }
  }

  /**
   * Obtiene todos los NFTs asociados a una cuenta
   * GET /api/nfts/user/:address
   * Query params opcionales: ?collectionId=1
   * Si no se proporciona collectionId, busca en TODAS las colecciones
   */
  async getUserNFTs(req: Request, res: Response) {
    try {
      const { address } = req.params;
      const { collectionId } = req.query;

      if (!address) {
        return res.status(400).json({ 
          error: 'address es requerido' 
        });
      }

      // Validar dirección
      if (!nftService.validateAddress(address)) {
        return res.status(400).json({ 
          error: 'Dirección de Polkadot inválida' 
        });
      }

      console.log(`📥 Solicitud de NFTs para ${address}, collectionId: ${collectionId || 'TODAS'}`);

      // Obtener NFTs del usuario usando el servicio
      // Si collectionId no se proporciona, buscar en todas las colecciones
      const userNFTs = await nftService.getUserNFTs(
        address, 
        collectionId ? (collectionId as string) : undefined
      );

      console.log(`📤 Devolviendo ${userNFTs.length} NFT(s) para ${address}`);

      // Si encontramos NFTs, determinar la colección más común
      let detectedCollectionId = collectionId || process.env.NFT_COLLECTION_ID || '1';
      if (userNFTs.length > 0 && !collectionId) {
        // Contar NFTs por colección
        const collectionCounts: { [key: string]: number } = {};
        userNFTs.forEach(nft => {
          const colId = nft.collectionId || '1';
          collectionCounts[colId] = (collectionCounts[colId] || 0) + 1;
        });
        // Obtener la colección con más NFTs
        detectedCollectionId = Object.keys(collectionCounts).reduce((a, b) => 
          collectionCounts[a] > collectionCounts[b] ? a : b
        );
      }

      res.json({
        success: true,
        data: {
          address,
          collectionId: detectedCollectionId,
          nfts: userNFTs,
          count: userNFTs.length
        }
      });
    } catch (error: any) {
      console.error('Error al obtener NFTs del usuario:', error);
      res.status(500).json({ 
        error: error.message || 'Error al obtener NFTs del usuario' 
      });
    }
  }
}

