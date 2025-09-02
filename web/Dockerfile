FROM node:20-alpine AS build
WORKDIR /web
COPY package*.json ./
RUN npm ci --no-audit --no-fund
COPY . .
ARG VITE_API_URL=http://localhost:8000
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

FROM node:20-alpine
WORKDIR /web
RUN npm i -g serve
COPY --from=build /web/dist ./dist
EXPOSE 5173
CMD ["serve","-s","dist","-l","5173"]
