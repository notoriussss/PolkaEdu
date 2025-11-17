import { NFTService, NFTMetadata } from './nft.service';
import 'dotenv/config';

// 👆 Ajusta la ruta según dónde tengas guardado tu NFTServicesrc\services\mint-nft.ts

async function main() {
  const nftService = new NFTService();

  const metadata: NFTMetadata = {
    name: "Certificado Curso Blockchain",
    description: "Certificado oficial emitido en Asset Hub Paseo",
    image: "https://mi-servidor.com/certificado.png",
    attributes: [
      { trait_type: "Nivel", value: "Avanzado" },
      { trait_type: "Duración", value: "40 horas" }
    ],
    courseId: "BC101",
    courseTitle: "Introducción a Blockchain",
    studentName: "Juan Pérez",
    issuedAt: new Date().toISOString()
  };

  const result = await nftService.createCertificateNFT(
    "5ERJpi4heUdcVU6D5uAMsqNwfNWB3HZNvBTXRY1HbH278MXR", // 👈 dirección válida SS58
    metadata
  );
  

  console.log("✅ NFT creado:", result);
}

main().catch(console.error);
