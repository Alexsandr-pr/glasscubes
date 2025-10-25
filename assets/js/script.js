window.addEventListener("DOMContentLoaded", () => {

	function burgerMenu() {
		const header = document.querySelector(".header");
		const buttonBurger = document.querySelector(".burger-menu");

		buttonBurger.addEventListener("click", () => {
			if (header.classList.contains("_active")) {
				header.classList.remove("_active");
				document.body.style.overflow = "";
			} else {
				header.classList.add("_active");
				document.body.style.overflow = "hidden";
			}
		});
	}

	burgerMenu();



	function modalsInit() {

		const modalButtons = document.querySelectorAll("[data-modal-button]");

		const scrollBarWidth = window.innerWidth - document.body.offsetWidth + "px";

		function modalOpen(modalId, activeClass = "_active", modalVideoUrl) {
			const modal = document.getElementById(modalId);
			if (!modal) return;

			modal.classList.add(activeClass);

			if (modalVideoUrl) {
				const videoReviewModalContent = modal.querySelector(".video-review-modal");

				const videoHTML = `
					<video class="video-review-modal__video" controls>
						<source src="${modalVideoUrl}" type="video/webm">
						Your browser does not support the video tag.
					</video>
				`;

				videoReviewModalContent.innerHTML = videoHTML;
			}

			const video = modal.querySelector("video");

			if (video) {
				video.play();
			}

			document.body.style.overflow = "hidden";
			document.body.style.paddingRight = scrollBarWidth;
		}

		function closeModal(modalId, activeClass = "_active") {
			const modal = document.getElementById(modalId);
			if (!modal) return;
			modal.classList.remove(activeClass);

			const form = modal.querySelector("form");
			if (form) {
				form.reset();
				form.classList.remove("_active");
				const errorText = form.querySelector(".form__text.error");
				if (errorText) errorText.classList.add("hidden");
			}

			const video = modal.querySelector("video");
			if (video) {
				video.pause()
			}

			document.body.style.overflow = "";
			document.body.style.paddingRight = "";
		}

		if (modalButtons.length > 0) {
			modalButtons.forEach((button) => {
				button.addEventListener("click", (e) => {
					e.preventDefault();
					const modalId = button.getAttribute("data-modal-button");
					const modalVideoUrl = button.getAttribute("data-modal-url");

					modalOpen(modalId, "_active", modalVideoUrl);

				});
			});
		}

		function initModalEvents() {
			document.addEventListener("click", (e) => {
				const activeModal = document.querySelector(".modal._active");
				if (!activeModal) return;

				const modalId = activeModal.getAttribute("id");

				if (e.target.closest("[data-modal-close]")) {
					closeModal(modalId);
				}

				if (e.target.classList.contains("modal") && !e.target.closest(".modal__content")) {
					closeModal(modalId);
				}
			});

			document.addEventListener("keydown", (e) => {
				if (e.key === "Escape") {
					const activeModal = document.querySelector(".modal._active");
					if (activeModal) {
						const modalId = activeModal.getAttribute("id");
						closeModal(modalId);
					}
				}
			});
		}

		initModalEvents();
	}

	modalsInit();


	function initSlider() {

		const slider = document.querySelector(".partners-slider__wrapper");

		if (!slider) {
			return;
		}

		const prevBtn = document.getElementById("prev");
		const nextBtn = document.getElementById("next");
		const thumb = document.getElementById("thumb");
		const pagination = document.getElementById("pagination");

		function getSlideWidth() {
			return window.innerWidth <= 767 ? window.innerWidth : 389;
		}

		function getActiveWidth() {
			return window.innerWidth <= 767 ? window.innerWidth : 456;
		}

		function getGap() {
			return window.innerWidth <= 767 ? 12 : 24;
		}

		let isAnimating = false;

		const slides = () => Array.from(slider.children);
		const totalSlides = slides().length;

		function setActive() {
			slides().forEach((slide, i) => slide.classList.toggle("active", i === 0));
			updateThumb();
		}

		function updateThumb() {
			const lineWidth = pagination.offsetWidth - thumb.offsetWidth;
			const index = Number(slider.dataset.index || 0);
			const pos = (index / (totalSlides - 1)) * lineWidth;
			thumb.style.left = pos + "px";
		}

		function moveNext() {
			if (isAnimating) return;
			isAnimating = true;

			let index = Number(slider.dataset.index || 0);
			index = (index + 1) % totalSlides;
			slider.dataset.index = index;

			const moveX = slides()[0].classList.contains("active")
				? getActiveWidth() + getGap()
				: getSlideWidth() + getGap();

			slider.style.transition = "transform 0.5s ease";
			slider.style.transform = `translateX(-${moveX}px)`;

			setTimeout(() => {
				slider.style.transition = "none";
				slider.appendChild(slides()[0]);
				slider.style.transform = "translateX(0)";
				setActive();
				isAnimating = false;
			}, 500);
		}

		function movePrev() {
			if (isAnimating) return;
			isAnimating = true;

			let index = Number(slider.dataset.index || 0);
			index = (index - 1 + totalSlides) % totalSlides;
			slider.dataset.index = index;

			const last = slides().at(-1);
			slider.insertBefore(last, slides()[0]);

			const moveX = last.classList.contains("active")
				? getActiveWidth() + getGap()
				: getSlideWidth() + getGap();

			slider.style.transition = "none";
			slider.style.transform = `translateX(-${moveX}px)`;

			requestAnimationFrame(() => {
				slider.style.transition = "transform 0.5s ease";
				slider.style.transform = "translateX(0)";
			});

			setTimeout(() => {
				setActive();
				isAnimating = false;
			}, 500);
		}

		slider.dataset.index = 0;
		setActive();
		updateThumb();

		nextBtn.addEventListener("click", moveNext);
		prevBtn.addEventListener("click", movePrev);

		let touchStartX = 0;
		let touchEndX = 0;
		let touchStartY = 0;
		let touchEndY = 0;
		const swipeThreshold = 60;

		function handleTouchStart(e) {
			const touch = e.touches[0];
			touchStartX = touch.clientX;
			touchStartY = touch.clientY;
		}

		function handleTouchMove(e) {
			const touch = e.touches[0];
			touchEndX = touch.clientX;
			touchEndY = touch.clientY;
		}

		function handleTouchEnd() {
			const deltaX = touchEndX - touchStartX;
			const deltaY = touchEndY - touchStartY;

			if (Math.abs(deltaY) > Math.abs(deltaX)) return;

			if (Math.abs(deltaX) > swipeThreshold) {
				if (deltaX < 0) {
					moveNext();
				} else {
					movePrev();
				}
			}

			touchStartX = 0;
			touchEndX = 0;
		}

		if ("ontouchstart" in window || navigator.maxTouchPoints > 0) {
			slider.addEventListener("touchstart", handleTouchStart, { passive: true });
			slider.addEventListener("touchmove", handleTouchMove, { passive: true });
			slider.addEventListener("touchend", handleTouchEnd);
		}

		window.addEventListener("resize", () => {
			updateThumb();
		});
	}

	initSlider();
})
