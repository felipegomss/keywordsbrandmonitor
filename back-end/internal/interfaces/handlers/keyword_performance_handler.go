package handlers

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"github.com/felipegomss/keywordsbrandmonitor/back-end/internal/domain"
)

type KeywordPerformanceHandler interface {
	GetKeywordPerformance(c *gin.Context)
}

type keywordPerformanceHandler struct {
	keywordPerformanceRepository domain.KeywordPerformanceRepository
}

func NewKeywordPerformanceHandler(repo domain.KeywordPerformanceRepository) KeywordPerformanceHandler {
	return &keywordPerformanceHandler{
		keywordPerformanceRepository: repo,
	}
}

func (h *keywordPerformanceHandler) GetKeywordPerformance(c *gin.Context) {
	performanceData, err := h.keywordPerformanceRepository.GetAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}

	c.JSON(http.StatusOK, performanceData)
}