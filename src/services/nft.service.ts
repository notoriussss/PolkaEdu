import { ApiPromise } from '@polkadot/api';
import { getApi, getSignerAccount, initPolkadot } from '../config/polkadot';
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto';
import axios from 'axios';
import 'dotenv/config';

export interface NFTMetadata {
  name: string;
  description: string;
  image?: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
  courseId: string;
  courseTitle: string;
  studentName: string;
  issuedAt: string;
}

export class NFTService {
  private api: ApiPromise | null = null;
  private collectionId: string;
  private pinataKey: string;
  private pinataSecret: string;

  constructor() {
    this.collectionId = process.env.NFT_COLLECTION_ID || '1';
    this.pinataKey = process.env.PINATA_KEY || '';
    this.pinataSecret = process.env.PINATA_SECRET || '';
  
    console.log("🔑 Pinata Key:", this.pinataKey ? "OK" : "NO DEFINIDA");
    console.log("🔑 Pinata Secret:", this.pinataSecret ? "OK" : "NO DEFINIDA");
  }
  

  private getApi(): ApiPromise {
    if (!this.api) {
      this.api = getApi();
    }
    return this.api;
  }
    
    // 💡 FUNCIÓN MEJORADA: Garantiza que SIEMPRE seamos admin de una colección
    // Si no somos admin, crea una nueva colección automáticamente
    async ensureCollectionExists(): Promise<void> {
        await initPolkadot(); 
        const api = this.getApi();
        const signer = getSignerAccount();
        if (!signer) return;

        const txOptions = { nonce: -1, tip: 0 }; 
        let currentCollectionId = this.collectionId;
        let maxAttempts = 5; // Máximo de intentos para evitar loops infinitos
        let attempt = 0;

        while (attempt < maxAttempts) {
            attempt++;
            let collectionExists = false;
            let isAdmin = false;

            // 1. Verificar si la colección existe y si somos admin
            if (api.query.uniques && api.query.uniques.class) {
                try {
                    const collection = await api.query.uniques.class(currentCollectionId);
                    const infoHuman = collection.toHuman();
                    
                    if (infoHuman && typeof infoHuman === 'object' && infoHuman !== null) {
                        collectionExists = true;
                        const admin = (infoHuman as any).owner || (infoHuman as any).admin || null;
                        
                        // Normalizar direcciones para comparar (convertir ambas al mismo formato SS58)
                        if (admin) {
                            try {
                                const adminAddress = admin.toString();
                                const signerAddress = signer.address;
                                
                                // Decodificar ambas direcciones a bytes (clave pública subyacente)
                                // decodeAddress valida el checksum SS58 y devuelve solo los bytes de la clave pública
                                const adminBytes = decodeAddress(adminAddress);
                                const signerBytes = decodeAddress(signerAddress);
                                
                                // Validar que ambas tengan la misma longitud (deberían ser 32 bytes para sr25519/ed25519)
                                if (adminBytes.length !== signerBytes.length) {
                                    console.warn(`⚠️ Longitudes diferentes: admin=${adminBytes.length}, signer=${signerBytes.length}`);
                                }
                                
                                // Comparar los bytes directamente (son la misma cuenta si los bytes coinciden)
                                // Esto es 100% preciso: si los bytes de la clave pública coinciden, es la misma cuenta
                                const isSameAddress = adminBytes.length === signerBytes.length &&
                                    adminBytes.every((byte, index) => byte === signerBytes[index]);
                                
                                if (isSameAddress) {
                                    isAdmin = true;
                                    console.log(`✅ Colección ${currentCollectionId} existe y eres el admin.`);
                                    this.collectionId = currentCollectionId; // Actualizar el ID usado
                                    return; // ¡Éxito! Somos admin, podemos continuar
                                } else {
                                    console.log(`⚠️ Colección ${currentCollectionId} existe pero el admin es ${adminAddress}, no tú (${signerAddress}).`);
                                    console.log(`🔄 Creando una nueva colección...`);
                                }
                            } catch (e) {
                                console.warn(`⚠️ Error al comparar direcciones: ${e}`);
                            }
                        }
                    }
                } catch (e) {
                    console.warn(`⚠️ Error al consultar colección ${currentCollectionId}: ${e}`);
                }
            }

            // 2. Si no existe o no somos admin, crear una nueva colección
            if (!collectionExists || !isAdmin) {
                // Generar un nuevo ID único para la colección
                if (!collectionExists) {
                    console.log(`📦 Colección ${currentCollectionId} no existe. Creándola...`);
                } else {
                    // Generar un nuevo ID si la colección existe pero no somos admin
                    const timestamp = Date.now();
                    currentCollectionId = (timestamp % 4000000000).toString();
                    if (parseInt(currentCollectionId) < 1000) {
                        currentCollectionId = (parseInt(currentCollectionId) + 1000).toString();
                    }
                    console.log(`📦 Generando nuevo ID de colección: ${currentCollectionId}`);
                }

                console.log(`👤 Creando colección con admin: ${signer.address}`);

                // Determinar qué pallet usar para crear
                let createTx: any;
                if (api.tx.uniques) {
                    createTx = api.tx.uniques.create(currentCollectionId, signer.address);
                } else if (api.tx.nfts) {
                    createTx = api.tx.nfts.create(currentCollectionId, signer.address);
                } else {
                    throw new Error('No se encontró ningún pallet NFT para crear la colección.');
                }

                // Enviar la transacción de creación
                try {
                    await new Promise<void>((resolve, reject) => {
                        createTx.signAndSend(signer, txOptions, ({ status, dispatchError }: any) => {
                            if (dispatchError) {
                                const decoded = api.registry.findMetaError(dispatchError.asModule);
                                const errorMessage = `${decoded.section}.${decoded.name}: ${decoded.docs.join(' ')}`;
                                
                                // Si el ID ya está en uso, generar uno nuevo y reintentar
                                if (decoded.section === 'uniques' && decoded.name === 'InUse') {
                                    console.log(`⚠️ ID ${currentCollectionId} ya está en uso. Generando nuevo ID...`);
                                    return reject(new Error('ID_IN_USE')); // Error especial para manejar
                                }
                                return reject(new Error(`Fallo al crear la colección: ${errorMessage}`));
                            }

                            if (status.isInBlock || status.isFinalized) {
                                console.log(`🎉 Colección ${currentCollectionId} creada exitosamente!`);
                                return resolve();
                            }
                            if (status.isDropped || status.isInvalid) {
                                return reject(new Error(`Estado inválido al crear colección: ${status.toString()}`));
                            }
                        }).catch((error: any) => reject(error));
                    });

                    // Esperar un poco para que la blockchain procese
                    await new Promise(resolve => setTimeout(resolve, 3000));

                    // Verificar que somos admin de la nueva colección
                    if (api.query.uniques && api.query.uniques.class) {
                        const collectionInfo = await api.query.uniques.class(currentCollectionId);
                        const infoHuman = collectionInfo.toHuman();
                        
                        if (infoHuman && typeof infoHuman === 'object' && infoHuman !== null) {
                            const admin = (infoHuman as any).owner || (infoHuman as any).admin || null;
                            
                            // Normalizar direcciones para comparar
                            if (admin) {
                                try {
                                    const adminAddress = admin.toString();
                                    const signerAddress = signer.address;
                                    
                                    // Decodificar ambas direcciones a bytes (clave pública subyacente)
                                    // decodeAddress valida el checksum SS58 y devuelve solo los bytes de la clave pública
                                    const adminBytes = decodeAddress(adminAddress);
                                    const signerBytes = decodeAddress(signerAddress);
                                    
                                    // Validar que ambas tengan la misma longitud
                                    if (adminBytes.length !== signerBytes.length) {
                                        console.warn(`⚠️ Longitudes diferentes: admin=${adminBytes.length}, signer=${signerBytes.length}`);
                                    }
                                    
                                    // Comparar los bytes directamente (son la misma cuenta si los bytes coinciden)
                                    // Esto es 100% preciso: si los bytes de la clave pública coinciden, es la misma cuenta
                                    const isSameAddress = adminBytes.length === signerBytes.length &&
                                        adminBytes.every((byte, index) => byte === signerBytes[index]);
                                    
                                    if (isSameAddress) {
                                        console.log(`✅ Confirmado: Eres el admin de la colección ${currentCollectionId}`);
                                        this.collectionId = currentCollectionId; // Actualizar el ID usado
                                        console.log(`💡 Actualiza tu .env con: NFT_COLLECTION_ID=${currentCollectionId}`);
                                        return; // ¡Éxito! Somos admin
                                    } else {
                                        console.warn(`⚠️ La colección se creó pero el admin es ${adminAddress}, no ${signerAddress}. Reintentando...`);
                                        // Continuar el loop para reintentar
                                    }
                                } catch (e) {
                                    console.warn(`⚠️ Error al verificar admin: ${e}. Reintentando...`);
                                }
                            } else {
                                console.warn(`⚠️ No se pudo obtener el admin de la colección. Reintentando...`);
                            }
                        }
                    }
                } catch (error: any) {
                    if (error.message === 'ID_IN_USE') {
                        // Generar nuevo ID y continuar el loop
                        const timestamp = Date.now();
                        currentCollectionId = ((timestamp + attempt * 1000) % 4000000000).toString();
                        if (parseInt(currentCollectionId) < 1000) {
                            currentCollectionId = (parseInt(currentCollectionId) + 1000).toString();
                        }
                        continue; // Reintentar con nuevo ID
                    }
                    throw error; // Otros errores se lanzan
                }
            }
        }

        // Si llegamos aquí, no pudimos crear una colección después de varios intentos
        throw new Error(
            `❌ No se pudo crear una colección donde seas admin después de ${maxAttempts} intentos. ` +
            `Verifica tu conexión y balance.`
        );
    }

  async createCertificateNFT(
    recipientAddress: string,
    metadata: NFTMetadata
  ): Promise<{ tokenId: string; transactionHash: string }> {
    await initPolkadot();
    const signer = getSignerAccount();
    if (!signer) {
      throw new Error('No hay cuenta admin configurada para firmar transacciones. Define NFT_ADMIN_MNEMONIC.');
    }

    try {
      decodeAddress(recipientAddress);
    } catch (err) {
      throw new Error('Dirección de Polkadot inválida: formato SS58 incorrecto');
    }

    // 1. Subir metadata a IPFS vía Pinata
    const ipfsHash = await this.uploadMetadataToIPFS(metadata);

    // 💡 LLAMADA A LA FUNCIÓN DE VERIFICACIÓN (ahora más robusta)
    await this.ensureCollectionExists();

    // 2. Generar un tokenId único que no exista en la colección
    const api = this.getApi();
    const collectionIdNum = parseInt(this.collectionId, 10);
    
    if (isNaN(collectionIdNum) || collectionIdNum < 0 || collectionIdNum > 4294967295) {
      throw new Error(`Collection ID inválido: ${this.collectionId}. Debe ser un número entre 0 y 4,294,967,295`);
    }
    
    // SIEMPRE generar un tokenId único dinámicamente
    // NUNCA usar NFT_TOKEN_ID del .env para evitar conflictos
    const tokenIdNum = await this.generateUniqueTokenId(collectionIdNum);
    const tokenId = tokenIdNum.toString();
    
    // Validar que tokenIdNum esté en el rango válido
    if (isNaN(tokenIdNum) || tokenIdNum < 0 || tokenIdNum > 4294967295) {
      throw new Error(`Token ID inválido: ${tokenId}. Debe ser un número entre 0 y 4,294,967,295`);
    }
    
    let mintTx: any;
    let metadataTx: any;

    if (api.tx.uniques) {
      console.log('✅ Usando pallet-uniques para crear NFT');
      // Pasar como números, no strings
      mintTx = api.tx.uniques.mint(collectionIdNum, tokenIdNum, recipientAddress);
      metadataTx = api.tx.uniques.setMetadata(collectionIdNum, tokenIdNum, ipfsHash, 0);
    } else if (api.tx.nfts) {
      console.log('✅ Usando pallet-nfts para crear NFT');
      // Pasar como números, no strings
      mintTx = api.tx.nfts.mint(collectionIdNum, tokenIdNum, recipientAddress, null);
      metadataTx = api.tx.nfts.setMetadata(collectionIdNum, tokenIdNum, ipfsHash, 0);
    } else {
      console.warn('⚠️ No se encontró pallet de NFTs en esta red.');
        return {
          tokenId: tokenIdNum.toString(),
          transactionHash: `pending-${Date.now()}`
        };
    }

    const batch = api.tx.utility.batchAll([mintTx, metadataTx]);
    const txOptions = { nonce: -1, tip: 0 };

    return new Promise((resolve, reject) => {
      batch.signAndSend(signer, txOptions, ({ status, txHash, events, dispatchError }: any) => {
        
        // --- CÓDIGO DE MANEJO DE ERROR (MINT/BATCH) ---
        if (dispatchError) {
          let errorMessage = 'ExtrinsicFailed (Error desconocido)';

          if (dispatchError.isModule) {
            // Decodificar el error del módulo (index 51 es Uniques)
            const decoded = api.registry.findMetaError(dispatchError.asModule);
            errorMessage = `${decoded.section}.${decoded.name}: ${decoded.docs.join(' ')}`;
          } else {
            errorMessage = dispatchError.toString();
          }

          return reject(new Error(`Transacción fallida: ${errorMessage}. Posibles causas: fondos insuficientes, ID de token duplicado o permisos.`));
        }
        // --- FIN DEL CÓDIGO DE MANEJO DE ERROR ---


        if (status.isInBlock || status.isFinalized) {
          console.log(`✅ NFT creado en bloque ${status.isInBlock ? status.asInBlock : status.asFinalized}`);
          return resolve({
            tokenId: tokenIdNum.toString(),
            transactionHash: txHash.toString()
          });
        }

        if (status.isDropped || status.isInvalid) {
          return reject(new Error(`Estado inválido: ${status.toString()}`));
        }
      }).catch((error: any) => reject(error));
    });
  }

  async getNFTInfo(collectionId: string, tokenId: string): Promise<any> {
    const api = this.getApi();
    
    // Convertir a números enteros (u32)
    const collectionIdNum = parseInt(collectionId, 10);
    const tokenIdNum = parseInt(tokenId, 10);
    
    if (isNaN(collectionIdNum) || collectionIdNum < 0 || collectionIdNum > 4294967295) {
      throw new Error(`Collection ID inválido: ${collectionId}. Debe ser un número entre 0 y 4,294,967,295`);
    }
    if (isNaN(tokenIdNum) || tokenIdNum < 0 || tokenIdNum > 4294967295) {
      throw new Error(`Token ID inválido: ${tokenId}. Debe ser un número entre 0 y 4,294,967,295`);
    }
    
    if (api.query.uniques && api.query.uniques.asset) {
      // Pasar como números, no strings
      const nftInfo = await api.query.uniques.asset(collectionIdNum, tokenIdNum);
      return nftInfo.toHuman();
    } else if (api.query.nfts && api.query.nfts.item) {
      // Pasar como números, no strings
      const nftInfo = await api.query.nfts.item(collectionIdNum, tokenIdNum);
      return nftInfo.toHuman();
    }
    throw new Error('No se encontró pallet de NFTs para consultar información');
  }

  /**
   * Obtiene todos los NFTs de una cuenta en una colección específica
   * Si collectionId no se proporciona, busca en TODAS las colecciones
   */
  async getUserNFTs(address: string, collectionId?: string): Promise<any[]> {
    const api = this.getApi();
    const userNFTs: any[] = [];

    try {
      // Normalizar la dirección para comparación
      const { decodeAddress } = await import('@polkadot/util-crypto');
      const addressBytes = decodeAddress(address);
      
      // Si se proporciona collectionId, usarlo; si no, buscar en todas las colecciones
      const searchSpecificCollection = collectionId !== undefined && collectionId !== null;
      let targetCollectionIdNum: number | null = null;
      
      if (searchSpecificCollection) {
        const targetCollectionId = collectionId || this.collectionId;
        targetCollectionIdNum = parseInt(targetCollectionId, 10);
        if (isNaN(targetCollectionIdNum)) {
          console.warn(`Collection ID inválido: ${targetCollectionId}`);
          return userNFTs;
        }
        console.log(`🔍 Buscando NFTs para dirección: ${address}, Colección específica: ${targetCollectionIdNum}`);
      } else {
        console.log(`🔍 Buscando NFTs para dirección: ${address} en TODAS las colecciones`);
      }

      // Intentar con pallet uniques usando account.entries() que es más confiable
      if (api.query.uniques && api.query.uniques.account) {
        try {
          console.log('📦 Consultando usando pallet uniques...');
          
          // Usar entries() para obtener todas las entradas de account
          const accountEntries = await api.query.uniques.account.entries();
          console.log(`📊 Encontradas ${accountEntries.length} entradas en uniques.account`);
          
          for (const [key, value] of accountEntries) {
            try {
              // La clave tiene formato: [account, collectionId, tokenId]
              const keyArgs = key.args || [];
              if (keyArgs.length < 3) continue;
              
              const [account, collection, token] = keyArgs;
              
              // Convertir collection a número
              let collectionNum: number;
              const collectionStr = collection.toString();
              collectionNum = parseInt(collectionStr.split('.')[0].split('e')[0].split('E')[0], 10);
              
              // Si estamos buscando en una colección específica, filtrar
              if (searchSpecificCollection && (isNaN(collectionNum) || collectionNum !== targetCollectionIdNum)) {
                continue;
              }
              
              // Comparar la dirección usando bytes
              const accountAddress = account.toString();
              const accountBytes = decodeAddress(accountAddress);
              
              const isSameAddress = accountBytes.length === addressBytes.length &&
                accountBytes.every((byte, index) => byte === addressBytes[index]);
              
              if (isSameAddress) {
                // Convertir token a número
                const tokenStr = token.toString();
                const tokenNum = parseInt(tokenStr.split('.')[0].split('e')[0].split('E')[0], 10);
                
                if (isNaN(tokenNum)) continue;
                
                // Obtener información del token
                try {
                  const tokenInfo = await api.query.uniques.asset(collectionNum, tokenNum);
                  const tokenInfoHuman = tokenInfo.toHuman();
                  if (tokenInfoHuman && tokenInfoHuman !== null) {
                    console.log(`✅ NFT encontrado: Collection ${collectionNum}, Token ${tokenNum}`);
                    userNFTs.push({
                      collectionId: collectionNum.toString(),
                      tokenId: tokenNum.toString(),
                      owner: address,
                      info: tokenInfoHuman
                    });
                  }
                } catch (error) {
                  console.warn(`Error al obtener info del token ${tokenNum}:`, error);
                }
              }
            } catch (error) {
              // Ignorar errores al procesar una entrada individual
              continue;
            }
          }
          
          if (userNFTs.length > 0) {
            console.log(`✅ Se encontraron ${userNFTs.length} NFT(s) usando pallet uniques`);
            return userNFTs;
          }
        } catch (error) {
          console.warn('Error al consultar uniques.account.entries:', error);
        }
      }

      // Si no se encontraron NFTs con uniques, intentar con nfts
      if (userNFTs.length === 0 && api.query.nfts && api.query.nfts.account) {
        try {
          console.log('📦 Consultando usando pallet nfts...');
          
          // Obtener todas las entradas de account
          const accountEntries = await api.query.nfts.account.entries();
          console.log(`📊 Encontradas ${accountEntries.length} entradas en nfts.account`);
          
          for (const [key, value] of accountEntries) {
            try {
              const [account, collection, token] = key.args;
              
              // Comparar la dirección del account con la dirección buscada usando bytes
              const accountAddress = account.toString();
              const accountBytes = decodeAddress(accountAddress);
              
              const isSameAddress = accountBytes.length === addressBytes.length &&
                accountBytes.every((byte, index) => byte === addressBytes[index]);
              
              // Comparar collectionId
              const collectionStr = collection.toString();
              const collectionNum = parseInt(collectionStr.split('.')[0].split('e')[0].split('E')[0], 10);
              
              // Si estamos buscando en una colección específica, filtrar
              const collectionMatches = !searchSpecificCollection || (!isNaN(collectionNum) && collectionNum === targetCollectionIdNum);
              
              if (isSameAddress && collectionMatches) {
                const valueHuman = value.toHuman();
                if (valueHuman && valueHuman !== null) {
                  try {
                    const tokenStr = token.toString();
                    const tokenInfo = await api.query.nfts.item(collectionNum, tokenStr);
                    const tokenInfoHuman = tokenInfo.toHuman();
                    if (tokenInfoHuman && tokenInfoHuman !== null) {
                      console.log(`✅ NFT encontrado: Collection ${collectionNum}, Token ${tokenStr}`);
                      userNFTs.push({
                        collectionId: collectionNum.toString(),
                        tokenId: tokenStr,
                        owner: address,
                        info: tokenInfoHuman
                      });
                    }
                  } catch (error) {
                    console.warn(`Error al obtener info del token ${token.toString()}:`, error);
                  }
                }
              }
            } catch (error) {
              // Ignorar errores al procesar una entrada individual
              continue;
            }
          }
          
          if (userNFTs.length > 0) {
            console.log(`✅ Se encontraron ${userNFTs.length} NFT(s) usando pallet nfts`);
          }
        } catch (error) {
          console.warn('Error al consultar nfts.account.entries:', error);
        }
      }
      
      if (userNFTs.length === 0) {
        console.log(`⚠️ No se encontraron NFTs para la dirección ${address} en la colección ${targetCollectionId}`);
      }
    } catch (error) {
      console.error('Error general al obtener NFTs del usuario:', error);
    }

    return userNFTs;
  }

  /**
   * Verifica si un tokenId ya existe en la colección
   */
  private async checkTokenExists(collectionId: number, tokenId: number): Promise<boolean> {
    const api = this.getApi();
    
    try {
      if (api.query.uniques && api.query.uniques.asset) {
        const asset = await api.query.uniques.asset(collectionId, tokenId);
        // Si el asset existe y no es null/undefined, el token ya existe
        const assetHuman = asset.toHuman();
        return assetHuman !== null && assetHuman !== undefined;
      } else if (api.query.nfts && api.query.nfts.item) {
        const item = await api.query.nfts.item(collectionId, tokenId);
        const itemHuman = item.toHuman();
        return itemHuman !== null && itemHuman !== undefined;
      }
    } catch (error) {
      // Si hay error al consultar, asumimos que no existe
      return false;
    }
    
    return false;
  }

  /**
   * Genera un tokenId único que no existe en la colección
   * Intenta hasta encontrar uno disponible (máximo 100 intentos)
   */
  private async generateUniqueTokenId(collectionId: number): Promise<number> {
    const maxAttempts = 100;
    let attempts = 0;
    
    while (attempts < maxAttempts) {
      // Generar un tokenId basado en timestamp + número aleatorio
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 100000); // Número aleatorio más grande
      const microsecond = process.hrtime()[1] % 1000000; // Microsegundos para más unicidad
      
      // Combinar para crear un ID único
      const uniqueId = (timestamp % 4000000000) * 1000000 + random * 1000 + (microsecond % 1000);
      
      // Asegurar que esté en el rango válido de u32
      const tokenId = (uniqueId % 4294967295);
      
      // Mínimo 1 para evitar 0
      const finalTokenId = Math.max(1, tokenId);
      
      // Verificar si ya existe
      const exists = await this.checkTokenExists(collectionId, finalTokenId);
      
      if (!exists) {
        console.log(`✅ Token ID único generado: ${finalTokenId}`);
        return finalTokenId;
      }
      
      attempts++;
      
      // Si ya existe, esperar un poco antes de intentar de nuevo
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    
    throw new Error(`No se pudo generar un Token ID único después de ${maxAttempts} intentos. La colección puede estar muy llena.`);
  }

  private async uploadMetadataToIPFS(metadata: NFTMetadata): Promise<string> {
    try {
      const res = await axios.post(
        'https://api.pinata.cloud/pinning/pinJSONToIPFS',
        metadata,
        {
          headers: {
            'Content-Type': 'application/json',
            pinata_api_key: this.pinataKey,
            pinata_secret_api_key: this.pinataSecret,
          },
        }
      );
      console.log('✅ Metadata subida a IPFS:', res.data);
      return `ipfs://${res.data.IpfsHash}`;
    } catch (error: any) {
      console.error('❌ Error al subir metadata a IPFS:', error.response?.data || error.message);
      throw new Error('Error al subir metadata a IPFS');
    }
  }
  

  validateAddress(address: string): boolean {
    try {
      if (!address || typeof address !== 'string') return false;
      decodeAddress(address);
      return true;
    } catch {
      return false;
    }
  }
}