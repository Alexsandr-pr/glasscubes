

window.addEventListener("DOMContentLoaded", () => {


    function initButtonsPayment() {
        const buttonsPayment = document.querySelectorAll("[data-option]");
        const buttonsPaymentActive = document.querySelector(".buttons-payment__active");

        buttonsPayment.forEach((button, index) => {
            button.addEventListener("click", () => {

                buttonsPayment.forEach(button => button.classList.remove("_active"));

                button.classList.add("_active")

                buttonsPaymentActive.style.left = index === 0 ? `4px` : `126px`;
            });
        });
    }

    initButtonsPayment();
})