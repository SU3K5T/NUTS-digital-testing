// Добавим глобальные переменные для управления слайдером
let currentSlide = 0
let slidesCount = 0
let cardsData = []

// Функция для загрузки данных из JSON-файла
async function loadCardsData() {
	try {
		const response = await fetch('js/data.json')
		if (!response.ok) throw new Error('Что-то пошло не так :Е')
		const data = await response.json()
		return data
	} catch (error) {
		console.error('Ошибка', error)
		return []
	}
}

// Функция для создания карточки
function createCard(cardData) {
	const card = document.createElement('article')
	const formatDescription =
		cardData.description.slice(0, 141) +
		(cardData.description.length > 141 ? '...' : '')
	card.className = 'card'
	card.innerHTML = `
    <div class="card__inner">
      <div class="card__image-wrapper">
        <img class="card__image" src="${cardData.image_path}" alt="${cardData.title}">
      </div>
      <div class="card__text-wrapper">
        <h2 class="card__title">${cardData.title}</h2>
        <p class="card__description">${formatDescription}</p>
      </div>
      <a href="${cardData.link}" class="card__link"></a>
    </div>
  `
	return card
}

// Функция для создания пагинации
function createPagination() {
	const pagination = document.querySelector('.slider__pagination')

	for (let i = 0; i < slidesCount; i++) {
		const dot = document.createElement('button')
		dot.className = `slider__dot ${i === 0 ? 'active' : ''}`
		dot.dataset.index = i
		dot.addEventListener('click', () => goToSlide(i))
		pagination.appendChild(dot)
	}

	return pagination
}

// Функция для перехода к конкретному слайду
function goToSlide(index) {
	const slider = document.querySelector('.slider__cards')
	const cardWidth = document.querySelector('.card').offsetWidth

	currentSlide = index
	const offset = -currentSlide * cardWidth
	slider.style.transform = `translateX(${offset}px)`

	const sliderDots = document.querySelectorAll('.slider__dot')
	const activeDot = document.querySelector('.slider__dot.active')
	activeDot.classList.remove('active')
	sliderDots[index].classList.add('active')
}

// Функция для создания  слайдера
async function initSlider() {
	const interval = setInterval(() => {
		goToSlide((currentSlide + 1) % slidesCount)
	}, 4000)

	const slider = document.querySelector('.slider__cards')
	if (!slider) return

	// Загружаем данные
	cardsData = await loadCardsData()
	slidesCount = cardsData.length // 4

	createPagination()

	// создаем карточки на основке полученного cardData
	cardsData.forEach((cardData) => {
		const card = createCard(cardData)
		slider.appendChild(card)
	})

	// навигаыйия
	const prevBtn = document.querySelector('.slider__button--left')
	prevBtn.addEventListener('click', () => {
		clearInterval(interval)
		goToSlide((currentSlide - 1 + slidesCount) % slidesCount)
	})

	const nextBtn = document.querySelector('.slider__button--right')
	nextBtn.addEventListener('click', () => {
		clearInterval(interval)
		goToSlide((currentSlide + 1) % slidesCount)
	})
}

document.addEventListener('DOMContentLoaded', initSlider)
