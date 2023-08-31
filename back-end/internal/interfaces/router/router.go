package router

import (
	"github.com/gin-gonic/gin"
	"github.com/felipegomss/keywordsbrandmonitor/back-end/internal/interfaces/handlers"
)

type Router interface {
	Run(port string) error
}

type router struct {
	engine *gin.Engine
}

func NewRouter(keywordHandler handlers.KeywordPerformanceHandler) Router {
	r := gin.Default()

	r.GET("/api/keyword-performance", keywordHandler.GetKeywordPerformance)

	return &router{
		engine: r,
	}
}

func (r *router) Run(port string) error {
	return r.engine.Run(":" + port)
}
