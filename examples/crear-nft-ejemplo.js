/**
 * Ejemplo de cómo crear un NFT y asociarlo a una cuenta
 * 
 * USO:
 * 1. Asegúrate de que el servidor esté corriendo: npm run dev
 * 2. Pasa la dirección del destinatario como argumento: node examples/crear-nft-ejemplo.js <wallet-address>
 *    O modifica la variable recipientAddress en el código
 * 3. Ejecuta: node examples/crear-nft-ejemplo.js
 */

const API_URL = 'http://localhost:3000';

async function crearNFT() {
  try {
    console.log('🚀 Creando NFT...\n');

    // Obtener dirección desde argumentos de línea de comandos o usar la predeterminada
    const recipientAddress = process.argv[2] || '16PyBgikMLuGe9YmuZY9tgKYQjxdn2E2MQnctEMN4YacB3fQ';
    
    if (!recipientAddress) {
      console.error('❌ Error: Debes proporcionar una dirección de wallet');
      console.log('💡 Uso: node examples/crear-nft-ejemplo.js <wallet-address>');
      process.exit(1);
    }

    const response = await fetch(`${API_URL}/api/nfts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipientAddress: recipientAddress,
        metadata: {
          name: 'Certificado de Curso de Polkadot',
          description: 'Certificado por completar el curso de Introducción a Polkadot',
          courseId: 'curso-123',
          courseTitle: 'Introducción a Polkadot',
          studentName: 'Juan Pérez',
          issuedAt: new Date().toISOString(),
          attributes: [
            {
              trait_type: 'Nivel',
              value: 'Principiante'
            },
            {
              trait_type: 'Duración',
              value: '20 horas'
            }
          ]
        }
      })
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ NFT creado exitosamente!\n');
      console.log('📋 Detalles:');
      console.log(`   Token ID: ${result.data.tokenId}`);
      console.log(`   Transaction Hash: ${result.data.transactionHash}`);
      console.log(`   Collection ID: ${result.data.collectionId}`);
      console.log(`   Destinatario: ${result.data.recipientAddress}\n`);
      
      console.log('🔍 Puedes verificar el NFT con:');
      console.log(`   GET ${API_URL}/api/nfts/${result.data.collectionId}/${result.data.tokenId}`);
      console.log(`   GET ${API_URL}/api/nfts/user/${result.data.recipientAddress}`);
    } else {
      console.error('❌ Error al crear NFT:', result.error);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Asegúrate de que:');
    console.log('   1. El servidor esté corriendo (npm run dev)');
    console.log('   2. La dirección del destinatario sea válida');
    console.log('   3. Tengas balance suficiente en tu cuenta');
  }
}

// Ejecutar
crearNFT();

