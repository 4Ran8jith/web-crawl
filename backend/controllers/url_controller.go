package controllers

import (
    "net/http"
    "webcrawler/database"
    "webcrawler/models"
    "webcrawler/utils"

    "github.com/gin-gonic/gin"
)

func AddURL(c *gin.Context) {
    var req struct {
        Link string `json:"link"`
    }
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
        return
    }

    url := models.URL{
        Link:   req.Link,
        Status: "queued",
    }

    if err := database.DB.Create(&url).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save URL"})
        return
    }

    go utils.CrawlURL(url.ID, req.Link) // start crawling in background

    c.JSON(http.StatusOK, gin.H{"message": "Crawl started", "id": url.ID})
}

func GetURLs(c *gin.Context) {
    var urls []models.URL
    page := c.DefaultQuery("page", "1")
    limit := c.DefaultQuery("limit", "10")
    sort := c.DefaultQuery("sort", "created_at desc")

    db := database.DB

    db.Order(sort).Scopes(Paginate(page, limit)).Find(&urls)
	
	id := c.Param("id")
    var url models.URL
    if err := database.DB.First(&url, id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "URL not found"})
        return
    }

    c.JSON(http.StatusOK, urls)
}

func ReanalyzeURL(c *gin.Context) {
    id := c.Param("id")
    var url models.URL
    if err := database.DB.First(&url, id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "URL not found"})
        return
    }
    go utils.CrawlURL(url.ID, url.Link)
    c.JSON(http.StatusOK, gin.H{"message": "Re-analysis started"})
}

func DeleteURL(c *gin.Context) {
    id := c.Param("id")
    if err := database.DB.Delete(&models.URL{}, id).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete URL"})
        return
    }
    c.JSON(http.StatusOK, gin.H{"message": "URL deleted"})
}

