package com.ebanking.core.config;

import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.data.mongodb.config.AbstractMongoClientConfiguration;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.concurrent.TimeUnit;

//@Configuration
//@EnableMongoRepositories(basePackages = "com.ebanking.core.repository.nosql")
//@PropertySource("classpath:application.properties") // Assurez-vous que ce fichier existe
public class MongoConfig  {

  /*  private static final Logger logger = LoggerFactory.getLogger(MongoConfig.class);

    // ATTENTION: Pour la sécurité en production, utilisez des variables d'environnement
    // ou un gestionnaire de secrets comme Vault plutôt que de hardcoder la chaîne de connexion
    @Value("${spring.data.mongodb.uri:mongodb+srv://khalil-tahoun:9KNm_syar.dNBUx@cluster0.kvcjduc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0}")
    private String mongoUri;

    @Value("${spring.data.mongodb.database:ebankingLogs}")
    private String mongoDatabaseName;

    @Override
    protected String getDatabaseName() {
        return mongoDatabaseName;
    }

    @Override
    public MongoClient mongoClient() {
        try {
            logger.info("Initializing MongoDB client with database: {}", mongoDatabaseName);

            // Configuration avancée du client MongoDB avec des timeouts et paramètres de connexion
            ConnectionString connectionString = new ConnectionString(mongoUri);

            MongoClientSettings settings = MongoClientSettings.builder()
                    .applyConnectionString(connectionString)
                    .applyToSocketSettings(builder ->
                            builder.connectTimeout(5000, TimeUnit.MILLISECONDS)
                                    .readTimeout(10000, TimeUnit.MILLISECONDS))
                    .applyToConnectionPoolSettings(builder ->
                            builder.maxWaitTime(10000, TimeUnit.MILLISECONDS)
                                    .maxSize(50))
                    .build();

            return MongoClients.create(settings);
        } catch (Exception e) {
            logger.error("Failed to create MongoDB client: {}", e.getMessage(), e);
            throw new RuntimeException("Could not connect to MongoDB", e);
        }
    }

    @Bean
    public MongoTemplate mongoTemplate() {
        try {
            MongoTemplate template = new MongoTemplate(mongoClient(), getDatabaseName());
            // Vérification de la connexion
            template.getDb().getName();
            logger.info("Successfully connected to MongoDB: {}", getDatabaseName());
            return template;
        } catch (Exception e) {
            logger.error("Failed to create MongoTemplate: {}", e.getMessage(), e);
            throw new RuntimeException("Could not initialize MongoTemplate", e);
        }
    }

    @Bean
    public void mongoHealthCheck(MongoTemplate mongoTemplate) {
        // Simple bean pour vérifier que MongoDB est accessible au démarrage
        try {
            String dbName = mongoTemplate.getDb().getName();
            logger.info("MongoDB health check passed. Connected to database: {}", dbName);
        } catch (Exception e) {
            logger.error("MongoDB health check failed: {}", e.getMessage());
            // En environnement de production, vous pourriez vouloir échouer au démarrage
            // throw new RuntimeException("MongoDB health check failed", e);
        }
    }*/
}