# Base Image
FROM node as base

WORKDIR /usr/app/
COPY package.json ./
RUN npm install

# Seção de desenvolvimento
FROM base as development
ENV NODE_ENV=development
COPY . .
# CMD ["npm", "run", "dev"]

# Seção de produção
FROM base as production
ENV NODE_ENV=production
COPY . .

# Inspeção manual para verificar os conteúdos do diretório src/prisma/
RUN ls -l /usr/app/src/prisma/

# Execute a geração do Prisma
RUN npx prisma generate

EXPOSE 3000

# Use entrypoint.sh as the CMD
CMD ["sh", "/usr/app/entrypoint.sh"]
