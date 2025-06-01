# --------------------------------------------------------
# 🐳 backend.Dockerfile — E-Banking Backend (Spring + Tomcat)
# Emplacement : ebanking-2.0/docker/backend.Dockerfile
# --------------------------------------------------------

# Étape 1 : Build Maven avec Java 17 (multi-stage)
FROM maven:3.9.6-eclipse-temurin-17 AS builder

WORKDIR /app

# Copier le projet backend depuis le contexte (assumé à la racine)
COPY ./backend /app

# Injection de variables d'environnement (ex : pour future build CI)
# ENV JWT_SECRET=defaultsecret
# ENV DB_URL=jdbc:postgresql://localhost:5432/ebank

# ⚠️ Tests ignorés uniquement en dev. À activer pour CI/CD !
RUN mvn clean install -DskipTests

# Étape 2 : Image finale avec Tomcat 10.1.34 + Java 17
FROM tomcat:10.1.34-jdk17-temurin

# Nettoyage des apps par défaut
RUN rm -rf /usr/local/tomcat/webapps/*

# Déploiement de notre .war en tant que ROOT
COPY --from=builder /app/target/*.war /usr/local/tomcat/webapps/ROOT.war

# Port exposé
EXPOSE 8088

# Commande de lancement de Tomcat
CMD ["catalina.sh", "run"]
