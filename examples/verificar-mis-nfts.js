/**
 * Ejemplo de cómo verificar los NFTs que tienes en tu cuenta
 * 
 * USO:
 * 1. Asegúrate de que el servidor esté corriendo: npm run dev
 * 2. Pasa tu dirección de Polkadot como argumento: node examples/verificar-mis-nfts.js <wallet-address>
 *    O modifica la variable miDireccion en el código
 * 3. Ejecuta: node examples/verificar-mis-nfts.js
 */

const API_URL = 'http://localhost:3000';

async function verificarMisNFTs() {
  try {
    // Obtener dirección desde argumentos de línea de comandos o usar la predeterminada
    const miDireccion = process.argv[2] || '16PyBgikMLuGe9YmuZY9tgKYQjxdn2E2MQnctEMN4YacB3fQ';
    
    if (!miDireccion) {
      console.error('❌ Error: Debes proporcionar una dirección de wallet');
      console.log('💡 Uso: node examples/verificar-mis-nfts.js <wallet-address>');
      process.exit(1);
    }

    console.log('🔍 Verificando NFTs en tu cuenta...\n');
    console.log(`📍 Dirección: ${miDireccion}\n`);

    // Ver todos los NFTs de tu cuenta
    const response = await fetch(`${API_URL}/api/nfts/user/${miDireccion}`);
    const result = await response.json();

    if (response.ok && result.success) {
      console.log(`✅ Encontré ${result.data.count} NFT(s) en tu cuenta\n`);

      if (result.data.nfts.length === 0) {
        console.log('📭 No tienes NFTs aún.');
        console.log('💡 Pide a alguien que te envíe un NFT o crea uno usando:');
        console.log('   node examples/crear-nft-ejemplo.js\n');
      } else {
        console.log('📋 Tus NFTs:\n');
        result.data.nfts.forEach((nft, index) => {
          console.log(`${index + 1}. NFT #${nft.tokenId}`);
          console.log(`   Colección: ${nft.collectionId}`);
          console.log(`   Owner: ${nft.owner}`);
          console.log(`   Info:`, nft.info);
          console.log('');
        });

        console.log('🔍 Para ver más detalles de un NFT específico:');
        console.log(`   GET ${API_URL}/api/nfts/${result.data.collectionId}/${result.data.nfts[0].tokenId}`);
      }
    } else {
      console.error('❌ Error:', result.error);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Asegúrate de que:');
    console.log('   1. El servidor esté corriendo (npm run dev)');
    console.log('   2. La dirección sea válida');
    console.log('   3. Tengas conexión a internet');
  }
}

// Ejecutar
verificarMisNFTs();

