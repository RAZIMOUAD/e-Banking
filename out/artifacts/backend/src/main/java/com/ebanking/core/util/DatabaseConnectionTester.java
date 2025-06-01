package com.ebanking.core.util;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.postgresql.ds.PGSimpleDataSource;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.jdbc.core.JdbcTemplate;

public class DatabaseConnectionTester {

    public static void main(String[] args) {
        System.out.println("========== TEST DE CONNEXION AUX BASES DE DONNÉES ==========\n");

        testMongoDB();
        System.out.println("\n-----------------------------------------------------\n");
        testPostgreSQL();

        System.out.println("\n========== TESTS TERMINÉS ==========");
    }

    private static void testMongoDB() {
        // Configuration MongoDB en dur
        String mongoUri = "mongodb+srv://khalil-tahoun:9KNm_syar.dNBUx@cluster0.kvcjduc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
        String dbName = "ebankingLogs";

        MongoClient mongoClient = null;
        try {
            System.out.println("Tentative de connexion à MongoDB...");

            mongoClient = MongoClients.create(mongoUri);
            MongoTemplate mongoTemplate = new MongoTemplate(mongoClient, dbName);

            String databaseName = mongoTemplate.getDb().getName();
            System.out.println("✅ Connexion réussie à MongoDB! Base: " + databaseName);

            System.out.println("\nCollections disponibles:");
            mongoTemplate.getCollectionNames().forEach(name ->
                    System.out.println(" - " + name));

        } catch (Exception e) {
            System.err.println("❌ Échec de la connexion à MongoDB: " + e.getMessage());
            e.printStackTrace();
        } finally {
            if (mongoClient != null) {
                mongoClient.close();
            }
        }
    }

    private static void testPostgreSQL() {
        // Configuration PostgreSQL en dur
        String url = "jdbc:postgresql://pg-3bb6ecbc-khaliltahoun-513e.i.aivencloud.com:16291/ebankingdb?sslmode=require";
        String username = "avnadmin";
        String password = "AVNS_0XZH_V21HYsRuuAyE0l"; // Remplacez par votre mot de passe

        try {
            System.out.println("Tentative de connexion à PostgreSQL...");

            PGSimpleDataSource dataSource = new PGSimpleDataSource();
            dataSource.setUrl(url);
            dataSource.setUser(username);
            dataSource.setPassword(password);

            JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);

            Integer result = jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            System.out.println("✅ Connexion réussie à PostgreSQL! Test: " + result);

            try {
                System.out.println("\nTables dans le schéma public:");
                jdbcTemplate.query(
                        "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'",
                        (rs, rowNum) -> rs.getString("table_name")
                ).forEach(tableName -> System.out.println(" - " + tableName));
            } catch (Exception e) {
                System.out.println("⚠️ Impossible de lister les tables: " + e.getMessage());
            }

        } catch (Exception e) {
            System.err.println("❌ Échec de la connexion à PostgreSQL: " + e.getMessage());
            e.printStackTrace();
        }
    }
}