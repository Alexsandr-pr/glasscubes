document.addEventListener("DOMContentLoaded", () => {
    const firstBlock = document.querySelector(".main-demo");
    const secondBlock = document.querySelector(".main-response");

    const form = document.querySelector(".main-demo-form");
    const input = form.querySelector(".main-demo-form__input");
    const message = form.querySelector(".form__text");
    const button = form.querySelector("button");

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showMessage(text, type = "error") {
        message.textContent = text;
        message.classList.remove("hidden", "error", "success");
        message.classList.add(type);

        setTimeout(() => {
            message.classList.add("hidden");
        }, 3000);
    }

    input.addEventListener("input", () => {
        const email = input.value.trim();

        if (email === "") {
            message.classList.add("hidden");
            return;
        }

        if (!isValidEmail(email)) {
            message.textContent = "Email doesn’t exist. Please try another one";
            message.classList.remove("hidden");
            message.classList.add("error");
        } else {
            message.classList.add("hidden");
            message.classList.remove("error");
        }
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = input.value.trim();

        if (!isValidEmail(email)) {
            showMessage("Email doesn’t exist. Please try another one", "error");
            return;
        }

        button.disabled = true;

        fetch("/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        })
            .then((res) => res.json())
            .catch(() => {}) 
            .finally(() => {
                localStorage.setItem("showResponseBlock", "true");
                location.reload();
                window.scrollTo({
                    top: 0
                });
            });
    });


    if (localStorage.getItem("showResponseBlock") === "true") {
        firstBlock.style.display = "none";
        secondBlock.style.display = "block";

        localStorage.removeItem("showResponseBlock");

        window.scrollTo({
            top: 0
        });
    }
});
