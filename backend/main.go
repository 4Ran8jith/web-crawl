package main

import (
    "log"
    "web-crawl/models"
    "gorm.io/gorm"
)

func initDB() *gorm.DB {
    db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
    if err != nil {
        log.Fatal(err)
    }
    // Auto migrate schema
    db.AutoMigrate(&models.URL{})
	db := db.ConnectDB() // Connect + AutoMigrate

    return db
}
