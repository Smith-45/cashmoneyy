// --- CONFIGURATION ---
const ADMIN_EMAIL = "gedeon.yah45@gmail.com";
const LEVEL_CONFIG = {
    1: { nextReq: 5, bonusDirect: 1100, bonusTeam: 0, link: "https://payliv.shop/pay/plv_d0kjvsgn" },
    2: { nextReq: 10, bonusDirect: 1100, bonusTeam: 1000, link: "https://payliv.shop/pay/plv_owag0oyg" },
    3: { nextReq: 20, bonusDirect: 1100, bonusTeam: 2500, link: "https://payliv.shop/pay/plv_xsly3d8r" },
    4: { nextReq: 50, bonusDirect: 1100, bonusTeam: 4000, link: "https://payliv.shop/pay/plv_ud7mm5ed" },
    5: { nextReq: 100, bonusDirect: 1100, bonusTeam: 6500, link: "https://payliv.shop/pay/plv_qgfpdl6x" },
    6: { nextReq: 500, bonusDirect: 1100, bonusTeam: 16000, link: "https://payliv.shop/pay/plv_anwhf24c" },
    7: { nextReq: 1000, bonusDirect: 1100, bonusTeam: 28000, link: "https://payliv.shop/pay/plv_okndi1bp" }
};

// Données fictives pour le test
let user = { solde: 0, level: 1, referralCount: 0, email: "" };

// --- NAVIGATION ---
window.openNav = () => document.getElementById("mySidebar").style.width = "250px";
window.closeNav = () => document.getElementById("mySidebar").style.width = "0";

window.showSection = (id) => {
    ['dashboard', 'referral-section', 'historique'].forEach(s => document.getElementById(s).style.display = 'none');
    document.getElementById(id).style.display = 'block';
    closeNav();
};

// --- AUTHENTIFICATION ---
window.connexionSimulee = function() {
    const email = document.getElementById('authEmail').value.trim().toLowerCase();
    user.email = email;

    document.getElementById('authSection').style.display = 'none';
    document.getElementById('mainDashboard').style.display = 'block';
    document.getElementById('burgerBtn').style.display = 'block';

    if (email === ADMIN_EMAIL) {
        document.getElementById('adminLink').style.display = 'block';
    }
    
    // Configurer le lien de recharge selon le niveau
    document.getElementById('btnRechargeMain').onclick = () => window.location.href = LEVEL_CONFIG[user.level].link;
};

// --- RETRAIT ---
window.ouvrirModalRetrait = function() {
    const requis = LEVEL_CONFIG[user.level].nextReq;
    if (user.referralCount < requis) {
        alert(`❌ Bloqué ! Il vous faut ${requis} filleuls actifs. (Actuel: ${user.referralCount})`);
    } else {
        document.getElementById('modalRetrait').style.display = 'flex';
    }
};

window.fermerModalRetrait = () => document.getElementById('modalRetrait').style.display = 'none';

window.envoyerDemandeRetrait = function() {
    alert("✅ Demande envoyée à Gédéon !");
    fermerModalRetrait();
};
