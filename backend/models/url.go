package models

import "gorm.io/gorm"

type URL struct {
    gorm.Model
    Link             string
    HtmlVersion      string
    PageTitle        string
    H1Count          int
    H2Count          int
    H3Count          int
    InternalLinks    int
    ExternalLinks    int
    BrokenLinks      int
    HasLoginForm     bool
    Status           string // queued, running, done, error
}
