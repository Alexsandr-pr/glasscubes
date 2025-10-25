
window.addEventListener("DOMContentLoaded", () => {

    function initFollowButtons() {
        try {
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
        } catch (error) {
            console.error('Error initializing follow buttons:', error);
        }
    }

    initFollowButtons();

    function initVideoOnScroll() {
        try {
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
        } catch (error) {
            console.error('Error initializing video on scroll:', error);
        }
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
})
