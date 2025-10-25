
function modalsInit() {
    const modalButtons = document.querySelectorAll("[data-modal-button]");

    const scrollBarWidth = window.innerWidth - document.body.offsetWidth + "px";

    function modalOpen(modalId, activeClass = "_active") {
		const modal = document.getElementById(modalId);
		if (!modal) return;
		modal.classList.add(activeClass);

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
            const errorText = form.querySelector(".newsletters-form__text.error");
            if (errorText) errorText.classList.add("hidden");
        }
        
		document.body.style.overflow = "";
		document.body.style.paddingRight = "";
	}

    if (modalButtons.length > 0) {
        modalButtons.forEach((button) => {
            button.addEventListener("click", (e) => {
                e.preventDefault();
                const modalId = button.getAttribute("data-modal-button");
                modalOpen(modalId, "_active");
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
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("newsletters-form");
    const input = document.getElementById("newsletters-email");
    const label = input.closest("label");
    const errorText = form.querySelector(".newsletters-form__text.error");
    const button = form.querySelector("button");

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    input.addEventListener("focus", () => {
        form.classList.add("_active");
    });

    input.addEventListener("blur", () => {
        if (input.value.trim() === "") {
            form.classList.remove("_active");
            errorText.classList.add("hidden");
        }
    });

    input.addEventListener("input", () => {
        const email = input.value.trim();
        if (email === "") {
            errorText.classList.add("hidden");
            return;
        }

        if (!isValidEmail(email)) {
            errorText.textContent = "Email doesn’t exist. Please try another one";
            errorText.classList.remove("hidden");
        } else {
            errorText.classList.add("hidden");
        }
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        button.disabled = true;
        const email = input.value.trim();

        if (!isValidEmail(email)) {
            errorText.textContent = "Email doesn’t exist. Please try another one";
            errorText.classList.remove("hidden");
            button.disabled = false;
            return;
        }

        fetch("/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Server error");
                return res.json();
            })
            .then(() => {
                form.reset();
                form.classList.remove("_active");
                errorText.classList.add("hidden");
                alert("Thank you for subscribing!");
            })
            .catch(() => {
                button.disabled = false;
                errorText.textContent = "Something went wrong. Please try again later.";
                errorText.classList.remove("hidden");
            });
    });
});
