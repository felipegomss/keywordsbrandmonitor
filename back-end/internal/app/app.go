// internal/app/app.go
package app

import (
	"github.com/felipegomss/keywordsbrandmonitor/back-end/internal/domain"
	"github.com/felipegomss/keywordsbrandmonitor/back-end/internal/interfaces/router"
	"github.com/felipegomss/keywordsbrandmonitor/back-end/internal/interfaces/repositories"
	"github.com/felipegomss/keywordsbrandmonitor/back-end/internal/interfaces/handlers"
)

type App struct {
	Router            router.Router
	KeywordRepository domain.KeywordPerformanceRepository
	KeywordUseCase    domain.KeywordPerformanceUseCase
}

func NewApp() *App {
	keywordRepository := repositories.NewKeywordPerformanceRepository()
	keywordUseCase := domain.NewKeywordPerformanceUseCase(keywordRepository)
	router := router.NewRouter(handlers.NewKeywordPerformanceHandler(keywordUseCase))
	return &App{
		Router:            router,
		KeywordRepository: keywordRepository,
		KeywordUseCase:    keywordUseCase,
	}
}

func (app *App) StartServer(port string) error {
	return app.Router.Run(port)
}
