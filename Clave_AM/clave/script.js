document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("password");
    const keys = document.querySelector(".keys");
    const clearBtn = document.getElementById("clear");

    let real = "";

    const shuffle = () => {
        const nums = [...keys.querySelectorAll(".number")];
        for (let i = nums.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [nums[i], nums[j]] = [nums[j], nums[i]];
        }
        nums.forEach(n => keys.insertBefore(n, clearBtn));
    };

    const hideAllNumbers = () => {
        [...keys.querySelectorAll(".number")].forEach(button => {
            button.textContent = "*";
        });
    };

    const restoreAllNumbers = () => {
        [...keys.querySelectorAll(".number")].forEach(button => {
            button.textContent = button.dataset.original;
        });
    };

    keys.addEventListener("mouseover", (e) => {
        if (e.target.classList.contains("number")) {
            hideAllNumbers();
        }
    });

    keys.addEventListener("mouseout", (e) => {
        if (e.target.classList.contains("number")) {
            restoreAllNumbers();
        }
    });

    keys.addEventListener("click", e => {
        const k = e.target;
        if (!k.classList.contains("number")) {
            if (k.id === "clear") {
                real = "";
                input.value = "";
            }
            return;
        }

        real += k.dataset.original;
        input.value = real;
        shuffle();
    });

    
    [...keys.querySelectorAll(".number")].forEach((button) => {
        button.dataset.original = button.textContent.trim();
    });

    shuffle();
});
