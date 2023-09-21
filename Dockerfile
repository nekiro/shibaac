FROM node

WORKDIR /usr/app/
COPY package.json ./
RUN npm install

# Copiar todo o conteúdo do diretório do projeto para o container
COPY . .

# Inspeção manual para verificar os conteúdos do diretório src/prisma/
RUN ls -l /usr/app/src/prisma/

# Execute a geração do Prisma
RUN npx prisma generate

EXPOSE 3000

# Execute as migrações, seeds e então a aplicação
CMD ["sh", "-c", "npm run migrations:run && npm run create:seeds && npm run dev"]
