

window.addEventListener("DOMContentLoaded", () => {


    function initButtonsPayment() {

        const price = {
            monthly: {
                essential: {
                    cost: 120,
                    costPerUser: 18,
                },
                professional: {
                    cost: 180,
                    costPerUser: 22,
                },
                advantage: {
                    cost: 360,
                    costPerUser: 38,
                },
            },
            annually: {
                essential: {
                    cost: 96,
                    costPerUser: 14.4,
                },
                professional: {
                    cost: 144,
                    costPerUser: 17.6,
                },
                advantage: {
                    cost: 288,
                    costPerUser: 30.4,
                },
            },
        };

        function updateprice(priceKey = "annually") {
            const cards = document.querySelectorAll(".pricing-card");

            if(cards.length > 0) {
                cards.forEach(card => {
                    const type = card.getAttribute("data-type");
                    const pricing = card.querySelector(".pricing-card__price .h2");
                    const pricingPerUser = card.querySelector(".pricing-per-user");
                    const data = price[priceKey][type];

                    pricing.textContent = `£${data.cost}`;
                    pricingPerUser.textContent = `£${data.costPerUser}`;
                })
            }
        }

        const buttonsPayment = document.querySelectorAll("[data-option]");
        const buttonsPaymentActive = document.querySelector(".buttons-payment__active");

        buttonsPayment.forEach((button, index) => {
            button.addEventListener("click", () => {

                buttonsPayment.forEach(button => button.classList.remove("_active"));

                button.classList.add("_active")
                 const type = button.getAttribute("data-option");

                buttonsPaymentActive.style.left = index === 0 ? `4px` : `126px`;
                
                updateprice(type)
            });
        });
    }

    initButtonsPayment();
})