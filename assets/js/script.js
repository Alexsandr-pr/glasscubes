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
			const offsetX = 10;
			const offsetY = -10;
			const edgePadding = 20;

			const defaultTop = btn.style.top || window.getComputedStyle(btn).top;
			const defaultRight = btn.style.right || window.getComputedStyle(btn).right;
			const defaultTransform = btn.style.transform || '';

			container.addEventListener('mousemove', e => {
				const rect = container.getBoundingClientRect();
				const btnW = btn.offsetWidth;
				const btnH = btn.offsetHeight;

				let x = e.clientX - rect.left + offsetX;
				let y = e.clientY - rect.top + offsetY;

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
				const rect = container.getBoundingClientRect();
				const btnW = btn.offsetWidth;
				const btnH = btn.offsetHeight;

				let resetX = 0;
				let resetY = 0;

				if (defaultRight !== 'auto') {
					resetX = (rect.width - parseFloat(defaultRight) - btnW) - (rect.width - parseFloat(defaultRight) - btnW);
				} else if (btn.style.left !== 'auto' && btn.style.left) {
					resetX = parseFloat(btn.style.left) - parseFloat(btn.style.left);
				}

				if (defaultTop !== 'auto') {
					resetY = parseFloat(defaultTop) - parseFloat(defaultTop);
				} else if (btn.style.bottom !== 'auto' && btn.style.bottom) {
					resetY = -(rect.height - parseFloat(btn.style.bottom) - btnH - (rect.height - parseFloat(btn.style.bottom) - btnH));
				}

				gsap.to(btn, {
					x: resetX,
					y: resetY,
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



	const tracks = document.querySelectorAll('.main-reviews__track');

	tracks.forEach((track, i) => {
		const line = track.querySelector('.main-reviews__line');

		line.innerHTML += line.innerHTML;

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

		line.querySelectorAll('.main-reviews-line__item').forEach(item => {
			item.addEventListener('mouseenter', () => tween.pause());
			item.addEventListener('mouseleave', () => tween.play());
		});
	});




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
				end: () => `+=${items.length * 100}%`,
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



	function initReviewModal() {
		const modal = document.getElementById('reviewModal');
		const overlay = modal.querySelector('.review-modal__overlay');
		const content = modal.querySelector('.review-modal__content');
		const inner = modal.querySelector('.review-modal__inner');
		const closeBtn = modal.querySelector('.review-modal__close');

		document.querySelectorAll('.text-reviews-item__more').forEach((btn) => {
			btn.addEventListener('click', () => {
				const card = btn.closest('.text-reviews-item');
				if (!card) return;

				inner.innerHTML = card.innerHTML;

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
					document.body.style.overflow = '';
				},
			});
		}

		closeBtn.addEventListener('click', closeModal);
		overlay.addEventListener('click', closeModal);
	}

	initReviewModal()
})
