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

	document.querySelectorAll('[data-follow]').forEach(container => {
		const btn = container.querySelector('.fixed-button');
		const offsetX = 10;
		const offsetY = -10;
		const edgePadding = 20;

		// сохраняем исходное положение и transform
		const defaultTop = btn.style.top || window.getComputedStyle(btn).top;
		const defaultRight = btn.style.right || window.getComputedStyle(btn).right;
		const defaultTransform = btn.style.transform || '';

		container.addEventListener('mousemove', e => {
			const rect = container.getBoundingClientRect();
			const btnW = btn.offsetWidth;
			const btnH = btn.offsetHeight;

			// позиция курсора относительно контейнера
			let x = e.clientX - rect.left + offsetX;
			let y = e.clientY - rect.top + offsetY;

			// ограничения (с внутренним отступом)
			const minX = edgePadding;
			const minY = edgePadding;
			const maxX = rect.width - btnW - edgePadding;
			const maxY = rect.height - btnH - edgePadding;

			x = Math.min(Math.max(x, minX), maxX);
			y = Math.min(Math.max(y, minY), maxY);

			// двигаем только transform, чтобы ширина не трогалась
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

			// вычисляем позицию исходя из реального top/right/left/bottom
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

})