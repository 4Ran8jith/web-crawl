package routes

import (
    "webcrawler/controllers"
    "webcrawler/middleware"

    "github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
    r.POST("/login", controllers.Login)

    api := r.Group("/api")
    api.Use(middleware.AuthMiddleware())
    {
        api.POST("/urls", controllers.AddURL)
        api.GET("/urls", controllers.GetURLs)
        api.GET("/urls/:id", controllers.GetURLByID)
        api.POST("/urls/:id/reanalyze", controllers.ReanalyzeURL)
        api.DELETE("/urls/:id", controllers.DeleteURL)
    }
}
