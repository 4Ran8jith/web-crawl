package db

import (
    "log"
    "os"
    "gorm.io/driver/mysql"
    "gorm.io/gorm"
    "web-crawl/models"
)

func ConnectDB() *gorm.DB {
    dsn := os.Getenv("DB_USER") + ":" +
        os.Getenv("DB_PASSWORD") + "@tcp(" +
        os.Getenv("DB_HOST") + ":" +
        os.Getenv("DB_PORT") + ")/" +
        os.Getenv("DB_NAME") + "?charset=utf8mb4&parseTime=True&loc=Local"

    db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
    if err != nil {
        log.Fatal("Failed to connect to DB:", err)
    }

    // Auto-create table schema
    db.AutoMigrate(&models.URL{})

    return db
}
