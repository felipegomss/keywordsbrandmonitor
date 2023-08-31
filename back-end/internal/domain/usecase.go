package usecase

import "github.com/felipegomss/keywordsbrandmonitor/back-end/internal/domain"

type KeywordPerformanceUsecase interface {
	GetAll() ([]domain.KeywordPerformance, error)
}

type keywordPerformanceUsecase struct {
	keywordPerformanceRepository domain.KeywordPerformanceRepository
}

func NewKeywordPerformanceUsecase(repo domain.KeywordPerformanceRepository) KeywordPerformanceUsecase {
	return &keywordPerformanceUsecase{
		keywordPerformanceRepository: repo,
	}
}

func (u *keywordPerformanceUsecase) GetAll() ([]domain.KeywordPerformance, error) {
	return u.keywordPerformanceRepository.GetAll()
}