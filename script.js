// --- CONFIGURATION ADMIN ---
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

// --- DÉTECTION PARRAINAGE AUTO ---
window.addEventListener('load', () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('ref')) {
        toggleAuthMode(); // Basculer sur Inscription
        document.getElementById('authReferrer').value = urlParams.get('ref');
    }
});

// --- MENU & NAVIGATION ---
window.openNav = () => document.getElementById("mySidebar").style.width = "250px";
window.closeNav = () => document.getElementById("mySidebar").style.width = "0";

window.showSection = (id) => {
    const sections = ['dashboard', 'referral-section', 'historique'];
    sections.forEach(s => document.getElementById(s).style.display = 'none');
    document.getElementById(id).style.display = 'block';
    closeNav();
};

// --- AUTHENTIFICATION ---
window.toggleAuthMode = function() {
    const title = document.getElementById('authTitle');
    const regFields = document.getElementById('registerOnlyFields');
    const btn = document.getElementById('btnAuthAction');
    const tL = document.getElementById('toggleLink');
    const tT = document.getElementById('toggleText');

    if (title.innerText === "Connexion") {
        title.innerText = "Créer un compte";
        regFields.style.display = "block";
        btn.innerText = "S'inscrire";
        tT.innerText = "Déjà un compte ?";
        tL.innerText = "Se connecter";
    } else {
        title.innerText = "Connexion";
        regFields.style.display = "none";
        btn.innerText = "Se connecter";
        tT.innerText = "Pas encore de compte ?";
        tL.innerText = "S'inscrire";
    }
};

window.gererAuthentification = function() {
    const email = document.getElementById('authEmail').value.trim().toLowerCase();
    const username = document.getElementById('authUsername').value || "Utilisateur";

    // Affichage Dashboard
    document.getElementById('authSection').style.display = 'none';
    document.getElementById('mainDashboard').style.display = 'block';
    document.getElementById('burgerBtn').style.display = 'block';

    // Génération Lien Parrainage
    const myRefLink = `${window.location.origin}${window.location.pathname}?ref=${username}`;
    document.getElementById('referralLink').value = myRefLink;

    // Droits Admin Gédéon
    if (email === ADMIN_EMAIL) {
        document.getElementById('adminLink').style.display = 'block';
    }

    // Lien Recharge Dynamique (Niv 1 par défaut)
    document.getElementById('btnRechargeMain').onclick = () => window.location.href = LEVEL_CONFIG[1].link;
};

// --- RETRAIT & MODAL ---
window.ouvrirModalRetrait = function() {
    // Exemple de blocage
    alert("❌ Retrait bloqué ! Atteignez l'objectif de parrainage de votre niveau.");
};

window.fermerModalRetrait = () => document.getElementById('modalRetrait').style.display = 'none';

window.copierLien = () => {
    const el = document.getElementById('referralLink');
    el.select();
    document.execCommand('copy');
    alert("Lien de parrainage copié !");
};
