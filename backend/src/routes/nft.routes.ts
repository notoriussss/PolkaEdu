import { Router } from 'express';
import { NFTController } from '../controllers/nft.controller';

const router = Router();
const nftController = new NFTController();

// IMPORTANTE: Las rutas más específicas deben ir ANTES que las rutas con parámetros genéricos
// De lo contrario, Express las confundirá

// Validar una dirección de Polkadot (ruta específica)
router.post('/validate-address', (req, res) => nftController.validateAddress(req, res));

// Obtener todos los NFTs de un usuario (ruta específica con prefijo "user")
router.get('/user/:address', (req, res) => nftController.getUserNFTs(req, res));

// Obtener información de un NFT específico (ruta con parámetros)
router.get('/:collectionId/:tokenId', (req, res) => nftController.getNFTInfo(req, res));

// Crear un NFT y asociarlo a una cuenta (debe ir al final)
router.post('/', (req, res) => nftController.createNFT(req, res));

export default router;

