# Usar imagen oficial de Node.js
FROM node:18-alpine

# Instalar yarn globalmente
RUN npm install -g yarn

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package.json yarn.lock* ./
COPY tsconfig.json ./

# Instalar dependencias con yarn
# Si hay yarn.lock, usa --frozen-lockfile, si no, instala normalmente
RUN if [ -f yarn.lock ]; then yarn install --frozen-lockfile; else yarn install; fi

# Copiar código fuente
COPY . .

# Compilar TypeScript
RUN yarn build

# Exponer puerto
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["yarn", "start"]

