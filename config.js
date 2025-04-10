import dotenv from 'dotenv';

dotenv.config();

export default {
  db: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true',
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000,
      acquireTimeoutMillis: 30000
    }
  },

  security: {
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    },
    session: {
      timeout: 30 * 60 * 1000, // 30 minutos
      maxLoginAttempts: 3,
      lockoutDuration: 15 * 60 * 1000 // 15 minutos
    },
    password: {
      saltRounds: 10,
      resetTokenExpiry: '1h'
    }
  },

  notifications: {
    email: {
      enabled: process.env.EMAIL_ENABLED === 'true',
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    },
    sms: {
      enabled: process.env.SMS_ENABLED === 'true',
      provider: process.env.SMS_PROVIDER,
      apiKey: process.env.SMS_API_KEY
    }
  },

  app: {
    name: 'Taller MYM',
    port: parseInt(process.env.PORT) || 3001,
    env: process.env.NODE_ENV || 'development',
    apiVersion: 'v1',
    baseUrl: process.env.BASE_URL || 'http://localhost:3001',
    cors: {
      origin: process.env.CORS_ORIGIN || '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
    }
  },

  storage: {
    uploads: {
      dir: process.env.UPLOAD_DIR || 'uploads',
      maxSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB
      allowedTypes: ['image/jpeg', 'image/png', 'application/pdf']
    }
  },

  modules: {
    inventory: {
      lowStockThreshold: parseInt(process.env.LOW_STOCK_THRESHOLD) || 5,
      autoReorderEnabled: process.env.AUTO_REORDER_ENABLED === 'true'
    },
    workflow: {
      maxActiveOrders: parseInt(process.env.MAX_ACTIVE_ORDERS) || 20,
      defaultPriority: 'normal',
      statuses: ['pendiente', 'en_progreso', 'completado', 'cancelado']
    },
    finance: {
      currency: process.env.CURRENCY || 'MXN',
      taxRate: parseFloat(process.env.TAX_RATE) || 0.16,
      paymentMethods: ['efectivo', 'tarjeta', 'transferencia']
    }
  },

  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || 'app.log'
  }
};