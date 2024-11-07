# Usar una imagen ligera de Node.js
FROM node:18-alpine

# Crear un directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./

# Instalar dependencias
RUN npm install --production

# Copiar el resto de la aplicación
COPY . .

# Exponer el puerto en el que el backend escucha
EXPOSE 5000

# Comando para ejecutar el servidor en producción
CMD ["node", "server.js"]
