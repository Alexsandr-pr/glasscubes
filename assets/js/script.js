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

	function initFollowButtons() {
		document.querySelectorAll('[data-follow]').forEach(container => {
			const btn = container.querySelector('.fixed-button');
			const offsetX = 0;
			const offsetY = 0;
			const edgePadding = 20;

			const defaultTop = btn.style.top || window.getComputedStyle(btn).top;
			const defaultRight = btn.style.right || window.getComputedStyle(btn).right;
			const defaultTransform = btn.style.transform || '';

			container.addEventListener('mousemove', e => {
				const rect = container.getBoundingClientRect();
				const btnW = btn.offsetWidth;
				const btnH = btn.offsetHeight;

				let x = e.clientX - rect.left - btnW / 2 + offsetX;
				let y = e.clientY - rect.top - btnH / 2 + offsetY;

				const minX = edgePadding;
				const minY = edgePadding;
				const maxX = rect.width - btnW - edgePadding;
				const maxY = rect.height - btnH - edgePadding;

				x = Math.min(Math.max(x, minX), maxX);
				y = Math.min(Math.max(y, minY), maxY);

				gsap.to(btn, {
					x: x - (rect.width - parseFloat(defaultRight) - btnW),
					y: y - parseFloat(defaultTop),
					duration: 0.4,
					ease: "power2.out"
				});
			});

			container.addEventListener('mouseleave', () => {
				gsap.to(btn, {
					x: 0,
					y: 0,
					duration: 0.4,
					ease: "power3.inOut",
					onComplete: () => {
						btn.style.transform = defaultTransform;
					}
				});
			});
		});
	}

	initFollowButtons();

	function initVideoOnScroll() {
		const video = document.querySelector('.main-hero-video__bg');
		let played = false;

		function checkScroll() {
			const scrollY = window.scrollY || window.pageYOffset;

			if (scrollY > 300 && !played) {
				video.play();
				played = true;
				window.removeEventListener('scroll', checkScroll);
			}
		}

		window.addEventListener('scroll', checkScroll);
	}

	initVideoOnScroll()


	gsap.registerPlugin(ScrollTrigger);

	const rotatedCardsWrapper = document.querySelectorAll(["[data-cards]"]);

	rotatedCardsWrapper.forEach((cards, index) => {
		const targets = Array.from(cards.querySelectorAll("[data-card]"));

		targets.forEach((card, index) => {
			if (index === 0) return;
			gsap.set(card, {
				rotate: 2.7,
				y: 48 * index,
			});
		});

		targets.forEach((card, index) => {
			if (index === 0) return;
			gsap.to(card, {
				y: 0,
				marginTop: -15,
				rotate: 0,
				duration: 0.6,
				ease: "power2.out",
				scrollTrigger: {
					trigger: cards,
					start: "top 400px",
					end: "top 10%",
					scrub: true,
				},
			});
		});
	})

	const scrollSection = document.querySelectorAll(".main__features");

	scrollSection.forEach((section) => {
		const wrapper = section.querySelector(".features__wrapper");
		const items = wrapper.querySelectorAll(".features-card");

		initScroll(section, items);
	})

	function initScroll(section, items) {
		items.forEach((item, index) => {
			if (index !== 0) {
				gsap.set(item, { yPercent: 100 });
			}
		})

		const timeline = gsap.timeline({
			scrollTrigger: {
				trigger: section,
				pin: true,
				start: "top top",
				end: () => `+=${items.length * 40}%`,
				scrub: 1,
				invalidateOnRefresh: true,
			},
			defaults: { ease: "none" },
		})

		items.forEach((item, index) => {
			timeline.to(item, {
				scale: 0.9,
				borderRadius: "10px",
			});

			timeline.to(
				items[index + 1], { yPercent: 0 },
				"<"
			);
		})
	}



	function initVideoReviewModal() {
		const modal = document.getElementById('videoReviewModal');
		const overlay = modal.querySelector('.review-modal__overlay');
		const content = modal.querySelector('.video-review-modal__content');
		const inner = modal.querySelector('.review-modal__inner');
		const closeBtn = modal.querySelector('.review-modal__close');

		document.querySelectorAll('[data-url]').forEach((btn) => {
			btn.addEventListener('click', () => {
				
				const videoUrl = btn.dataset.url;
				console.log(videoUrl)
				if (!videoUrl) return;

				const videoHTML = `
					<video class="review-video" controls autoplay playsinline>
						<source src="${videoUrl}" type="video/mp4">
						Your browser does not support the video tag.
					</video>
				`;
				inner.innerHTML = videoHTML;

				modal.classList.add('is-active');

				gsap.fromTo(
					overlay,
					{ opacity: 0 },
					{ opacity: 1, duration: 0.3, ease: 'power2.out' }
				);
				gsap.fromTo(
					content,
					{ opacity: 0, y: 40 },
					{ opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', delay: 0.1 }
				);

				document.body.style.overflow = 'hidden';
			});
		});

		function closeModal() {
			const video = inner.querySelector('video');
			if (video) video.pause();

			gsap.to(content, {
				opacity: 0,
				y: 40,
				duration: 0.3,
				ease: 'power2.inOut',
			});
			gsap.to(overlay, {
				opacity: 0,
				duration: 0.25,
				ease: 'power2.inOut',
				onComplete: () => {
					modal.classList.remove('is-active');
					inner.innerHTML = '';
					document.body.style.overflow = '';
				},
			});
		}

		closeBtn.addEventListener('click', closeModal);
		overlay.addEventListener('click', closeModal);
	}

	initVideoReviewModal();





	function initSlider() {

		const slider = document.querySelector(".partners-slider__wrapper");
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

	function initReviews() {

		function formatDate(dateString) {
			const date = new Date(dateString);
			const day = date.getDate();
			const month = date.toLocaleString("en", { month: "long" });
			return `${day} ${month}`;
		}

		const linesWrapper = document.querySelector(".main-reviews__lines");
		const linesContainers = document.querySelectorAll(".main-reviews-line");

		function createCard(consumerName, createdAt, title, text, reviewUrl) {
			return `
				<div class="main-reviews-line__item text-reviews-item">
					<div class="text-reviews-item__top">
						<div class="text-reviews-item__user">
							<p class="text-reviews-item__user-name h6">${consumerName}</p>
							<p class="text-reviews-item__date small-text">${formatDate(createdAt)}</p>
						</div>
						<div class="text-reviews-item__stars">
							<img width="96" height="18" src="./assets/icons/stars.svg" alt="Rating">
						</div>
					</div>
					<h3 class="text-reviews-item__title h5">${title}</h3>
					<p class="text-reviews-item__text regular-text">${text}</p>
					<a href="${reviewUrl}" target="_blank" class="text-reviews-item__more">read more</a>
				</div>
			`;
		}

		async function fetchReviews() {
			try {
				linesWrapper.classList.add("is-loading");

				const res = await fetch(
					"https://widget.trustpilot.com/trustbox-data/539ad60defb9600b94d7df2c?businessUnitId=51929a4f00006400052c105b&locale=en-GB&reviewLanguages=en&reviewStars=5&reviewsPerPage=100"
				);
				const data = await res.json();

				const reviews = data?.reviews || [];
				if (!reviews.length) return;

				reviews.forEach((review, i) => {
					const lineIndex = i % linesContainers.length;
					linesContainers[lineIndex].insertAdjacentHTML(
						"beforeend",
						createCard(
							review.consumer?.displayName || "Anonymous",
							review.createdAt,
							review.title,
							review.text,
							review.reviewUrl
						)
					);
				});
			} catch (err) {
				console.error("Error loading reviews:", err);
			} finally {
				linesWrapper.classList.remove("is-loading");
				initGSAP()
			}
		}
		fetchReviews();

		function initGSAP() {
			const tracks = document.querySelectorAll(".main-reviews__track");

			tracks.forEach((track, i) => {
				const line = track.querySelector(".main-reviews__line");
				const direction = i % 2 === 0 ? -1 : 1;

				if (direction === 1) {
					gsap.set(line, { xPercent: -50 });
				}

				const tween = gsap.to(line, {
					xPercent: direction === 1 ? 0 : -50,
					ease: "none",
					duration: 20,
					repeat: -1,
				});

				// теперь карточки уже загружены — события наведения работают
				line.querySelectorAll(".main-reviews-line__item").forEach((item) => {
					item.addEventListener("mouseenter", () => tween.pause());
					item.addEventListener("mouseleave", () => tween.play());
				});
			});
		}
	}

	initReviews()



})
