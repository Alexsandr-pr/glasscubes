window.addEventListener("DOMContentLoaded", () => {

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
