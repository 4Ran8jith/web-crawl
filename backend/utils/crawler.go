package utils

import (
    "log"
    "strings"
    "webcrawler/database"
    "webcrawler/models"

    "github.com/gocolly/colly/v2"
)

func CrawlURL(id uint, url string) {
    db := database.DB

    // Update status to running
    db.Model(&models.URL{}).Where("id = ?", id).Update("status", "running")

    c := colly.NewCollector()

    result := models.URL{}

    c.OnHTML("html", func(e *colly.HTMLElement) {
        doctype := e.DOM.Get(0).Node.Data
        result.HtmlVersion = doctype
    })

    c.OnHTML("title", func(e *colly.HTMLElement) {
        result.PageTitle = e.Text
    })

    c.OnHTML("h1", func(e *colly.HTMLElement) {
        result.H1Count++
    })
    c.OnHTML("h2", func(e *colly.HTMLElement) {
        result.H2Count++
    })
    c.OnHTML("h3", func(e *colly.HTMLElement) {
        result.H3Count++
    })

    c.OnHTML("a[href]", func(e *colly.HTMLElement) {
        href := e.Attr("href")
        if strings.HasPrefix(href, "/") || strings.HasPrefix(href, url) {
            result.InternalLinks++
        } else {
            result.ExternalLinks++
        }
    })

    c.OnHTML("form", func(e *colly.HTMLElement) {
        if e.ChildAttr("input[type=password]", "name") != "" {
            result.HasLoginForm = true
        }
    })

    err := c.Visit(url)
    if err != nil {
        db.Model(&models.URL{}).Where("id = ?", id).Update("status", "error")
        log.Println("Crawl failed:", err)
        return
    }

    result.Status = "done"
    db.Model(&models.URL{}).Where("id = ?", id).Updates(result)
}
