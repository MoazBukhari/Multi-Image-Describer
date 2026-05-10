const toggle = document.getElementById('darkModeToggle');
    const savedTheme = localStorage.getItem('theme') || 'light';

    // Apply saved theme on page load
    document.documentElement.setAttribute('data-bs-theme', savedTheme);
    toggle.checked = savedTheme === 'dark';

    // Save new choice when user toggles
    toggle.addEventListener('change', () => {
        const theme = toggle.checked ? 'dark' : 'light';
        document.documentElement.setAttribute('data-bs-theme', theme);
        localStorage.setItem('theme', theme);
    });


//  Sign-in via Clerk
// main.js

async function initClerk() 
{
   const publishableKey = "pk_test_ZGVlcC1zdGFnLTkuY2xlcmsuYWNjb3VudHMuZGV2JA"; // Get from image_cd3f9a.jpg
    
    // 1. Safety check: avoid 'undefined' error
    if (!window.Clerk) {
        console.warn("Clerk not found, retrying...");
        setTimeout(initClerk, 100);
        return;
    }

    try {
        const clerk = window.Clerk;
        
        // Manual UI Loader (from your dashboard instructions)
        const clerkDomain = atob(publishableKey.split('_')[2]).slice(0, -1);
        await new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = `https://${clerkDomain}/npm/@clerk/ui@1/dist/ui.browser.js`;
            script.onload = resolve;
            document.head.appendChild(script);
        });

        await clerk.load({
            ui: { ClerkUI: window.__internal_ClerkUICtor },
        });
        console.log("Clerk UI is now fully loaded!");

        const signInBtn = document.getElementById('signin-btn');
        const userButtonDiv = document.getElementById('user-button');
        const userCreditDisplay = document.getElementById('userCreditDisplay');

        // 2. Logic to swap buttons based on login status
        if (clerk.user) {
            // User is LOGGED IN
            if (signInBtn) signInBtn.style.display = 'none';
            if (userButtonDiv) {
                userButtonDiv.style.display = 'block';
                clerk.mountUserButton(userButtonDiv);
            }
            if (userCreditDisplay) {
                userCreditDisplay.style.display = 'block';
            }
        } else {
            // User is NOT LOGGED IN
            if (userButtonDiv) userButtonDiv.style.display = 'none';
            if (signInBtn) {
                signInBtn.style.display = 'block';
                signInBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    clerk.openSignIn();
                });
            }
        }
    } catch (err) {
        console.error("Clerk initialization failed:", err);
    }
}
initClerk();


const slider = document.getElementById('creditSlider');
const s_creditDisplay = document.getElementById('s_creditCount');
const priceDisplay = document.getElementById('totalPrice');
const discountBadge = document.getElementById('badgeDiscount');
const byokToggle = document.getElementById('byokToggle');
const byokDiscountBadge = document.getElementById('byokBadgeDiscount');

slider.oninput = function() {
    const val = parseInt(this.value);
    let rate = 0.030; // Base price $0.030 per credit

    // Simple discount logic: cheaper rates for more credits
    if (val >= 4000) {
        rate = 0.009;
        discountBadge.innerText = "70% Bulk Discount!";
        discountBadge.className = "badge bg-success";
    }  else if (val >= 3000) {
        rate = 0.015;
        discountBadge.innerText = "50% Bulk Discount!";
        discountBadge.className = "badge bg-info";
    } else if (val >= 1000) {
        rate = 0.024;
        discountBadge.innerText = "20% Bulk Discount!";
        discountBadge.className = "badge bg-primary";
    } else {
        discountBadge.innerText = "Standard Rate";
        discountBadge.className = "badge bg-secondary";
    }

    s_creditDisplay.innerText = val.toLocaleString();
    let price = (val * rate).toFixed(2);

    // Apply BYOK discount if checked
    if (byokToggle.checked) {
        price = (price * 0.70).toFixed(2);
    }
    priceDisplay.innerText = price;
    };

byokToggle.onchange = function() {
    const val = parseInt(slider.value);
    if (this.checked) {
        // Handle BYOK toggle on
        byokDiscountBadge.innerText = "-30% BYOK Discount!";
        byokDiscountBadge.className = "badge bg-dark";
        const currentPrice = parseFloat(priceDisplay.innerText);
        priceDisplay.innerText = (currentPrice * 0.70).toFixed(2);  // 30% discount
    } else {
        // Handle BYOK toggle off
        byokDiscountBadge.innerText = "";
        byokDiscountBadge.className = "";
        // Recalculate at normal rate
        slider.oninput();
    }
    };    