

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("newsletters-form");
    const input = document.getElementById("newsletters-email");
    const errorText = form.querySelector(".form__text.error");
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
