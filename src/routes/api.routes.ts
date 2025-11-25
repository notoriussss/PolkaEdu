import { Router, Request, Response } from 'express';

const router = Router();

/**
 * GET /api - Lista todos los endpoints disponibles
 */
router.get('/', (req: Request, res: Response) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  
  res.json({
    service: 'Polkadot Courses Backend API',
    version: '1.0.0',
    baseUrl,
    endpoints: {
      root: {
        method: 'GET',
        path: '/',
        description: 'Información del servicio'
      },
      health: {
        method: 'GET',
        path: '/health',
        description: 'Health check del servicio'
      },
      api: {
        method: 'GET',
        path: '/api',
        description: 'Lista de todos los endpoints disponibles (este endpoint)'
      },
      courses: {
        getAll: {
          method: 'GET',
          path: '/api/courses',
          description: 'Obtener todos los cursos'
        },
        getById: {
          method: 'GET',
          path: '/api/courses/:id',
          description: 'Obtener un curso por ID (incluye lecciones)'
        },
        create: {
          method: 'POST',
          path: '/api/courses',
          description: 'Crear un nuevo curso',
          body: {
            title: 'string (requerido)',
            description: 'string (opcional)',
            instructor: 'string (requerido)',
            duration: 'number (requerido)',
            price: 'number (opcional, default: 0)',
            imageUrl: 'string (opcional)',
            lessons: 'array (opcional)'
          }
        },
        update: {
          method: 'PUT',
          path: '/api/courses/:id',
          description: 'Actualizar un curso'
        },
        delete: {
          method: 'DELETE',
          path: '/api/courses/:id',
          description: 'Eliminar un curso'
        },
        getLessons: {
          method: 'GET',
          path: '/api/courses/:id/lessons',
          description: 'Obtener todas las lecciones de un curso'
        }
      },
      enrollments: {
        enroll: {
          method: 'POST',
          path: '/api/enrollments',
          description: 'Inscribir usuario en curso',
          body: {
            userId: 'string (requerido)',
            courseId: 'string (requerido)'
          }
        },
        enrollWithWallet: {
          method: 'POST',
          path: '/api/enrollments/wallet',
          description: 'Inscribir usuario usando wallet address',
          body: {
            walletAddress: 'string (requerido)',
            courseId: 'string (requerido)',
            transactionHash: 'string (opcional, requerido si el curso tiene precio)',
            amount: 'number (opcional, requerido si el curso tiene precio)'
          }
        },
        getByUser: {
          method: 'GET',
          path: '/api/enrollments/user/:userId',
          description: 'Obtener todas las inscripciones de un usuario (incluye certificados)'
        },
        getByWallet: {
          method: 'GET',
          path: '/api/enrollments/wallet/:walletAddress',
          description: 'Obtener todas las inscripciones de un usuario por wallet address (incluye certificados)'
        },
        getById: {
          method: 'GET',
          path: '/api/enrollments/:id',
          description: 'Obtener una inscripción por ID (incluye certificado)'
        },
        updateProgress: {
          method: 'PUT',
          path: '/api/enrollments/:id/progress',
          description: 'Actualizar progreso de una inscripción',
          body: {
            progress: 'number (0-100)'
          }
        },
        complete: {
          method: 'POST',
          path: '/api/enrollments/:id/complete',
          description: 'Completar curso y emitir certificado NFT'
        }
      },
      certificates: {
        getAll: {
          method: 'GET',
          path: '/api/certificates',
          description: 'Obtener todos los certificados'
        },
        getByUser: {
          method: 'GET',
          path: '/api/certificates/user/:userId',
          description: 'Obtener todos los certificados de un usuario'
        },
        getByWallet: {
          method: 'GET',
          path: '/api/certificates/wallet/:walletAddress',
          description: 'Obtener todos los certificados de un usuario por wallet address'
        },
        getById: {
          method: 'GET',
          path: '/api/certificates/:id',
          description: 'Obtener un certificado por ID'
        }
      },
      nfts: {
        create: {
          method: 'POST',
          path: '/api/nfts',
          description: 'Crear un NFT',
          body: {
            recipientAddress: 'string (requerido)',
            metadata: {
              name: 'string (requerido)',
              description: 'string (requerido)',
              image: 'string (opcional)',
              attributes: 'array (opcional)'
            }
          }
        },
        validateAddress: {
          method: 'POST',
          path: '/api/nfts/validate-address',
          description: 'Validar una dirección de Polkadot',
          body: {
            address: 'string (requerido)'
          }
        },
        getUserNFTs: {
          method: 'GET',
          path: '/api/nfts/user/:address',
          description: 'Obtener todos los NFTs de un usuario',
          queryParams: {
            collectionId: 'string (opcional)'
          }
        },
        getNFTInfo: {
          method: 'GET',
          path: '/api/nfts/:collectionId/:tokenId',
          description: 'Obtener información de un NFT específico'
        }
      },
      balance: {
        getMyBalance: {
          method: 'GET',
          path: '/api/balance/me',
          description: 'Obtener saldo de la cuenta configurada'
        },
        getBalance: {
          method: 'GET',
          path: '/api/balance/:address',
          description: 'Obtener saldo de una dirección específica'
        },
        getAccountInfo: {
          method: 'GET',
          path: '/api/balance/:address/info',
          description: 'Obtener información detallada de una cuenta'
        }
      },
      payments: {
        verify: {
          method: 'POST',
          path: '/api/payments/verify',
          description: 'Verificar un pago',
          body: {
            transactionHash: 'string (requerido)',
            recipientAddress: 'string (requerido)',
            amount: 'number (requerido)',
            senderAddress: 'string (opcional)'
          }
        },
        getBalance: {
          method: 'GET',
          path: '/api/payments/balance/:address',
          description: 'Obtener balance de una dirección'
        }
      },
      users: {
        getAll: {
          method: 'GET',
          path: '/api/users',
          description: 'Obtener todos los usuarios'
        },
        getById: {
          method: 'GET',
          path: '/api/users/:id',
          description: 'Obtener un usuario por ID'
        },
        create: {
          method: 'POST',
          path: '/api/users',
          description: 'Crear un nuevo usuario'
        },
        update: {
          method: 'PUT',
          path: '/api/users/:id',
          description: 'Actualizar un usuario'
        },
        delete: {
          method: 'DELETE',
          path: '/api/users/:id',
          description: 'Eliminar un usuario'
        }
      }
    },
    examples: {
      getCourses: `${baseUrl}/api/courses`,
      getCourseById: `${baseUrl}/api/courses/COURSE_ID`,
      getCourseLessons: `${baseUrl}/api/courses/COURSE_ID/lessons`,
      getUserEnrollments: `${baseUrl}/api/enrollments/user/USER_ID`,
      getUserCertificates: `${baseUrl}/api/certificates/user/USER_ID`,
      getUserNFTs: `${baseUrl}/api/nfts/user/WALLET_ADDRESS`
    }
  });
});

export default router;

