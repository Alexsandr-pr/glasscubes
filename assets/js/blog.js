



window.addEventListener("DOMContentLoaded", () => {
    new Swiper(".related-posts__swiper", {
        spaceBetween: 24,
        draggable: true,
        grabCursor: true,
        keyboard: true,
        navigation: {
            nextEl: ".related-posts__prev",
            prevEl: ".related-posts__next",
        },
        pagination: {
            el: ".related-posts__pagination",
            type: "progressbar",
        },
        breakpoints: {
            120: {
                slidesPerView: 1,
            },
            487.98: {
                slidesPerView: "auto",
            }
        },
    });

});