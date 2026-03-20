const ADMIN_EMAIL = "gedeon.yah45@gmail.com";

// --- DETECTION PARRAINAGE ---
window.addEventListener('load', () => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('ref')) {
        toggleAuthMode();
        document.getElementById('authReferrer').value = params.get('ref');
    }
});

// --- MENU ---
window.openNav = () => document.getElementById("mySidebar").style.width = "250px";
window.closeNav = () => document.getElementById("mySidebar").style.width = "0";

window.showSection = (id) => {
    ['dashboard', 'referral-section', 'historique'].forEach(s => document.getElementById(s).style.display='none');
    document.getElementById(id).style.display = 'block';
    closeNav();
};

// --- AUTHENTIFICATION ---
window.toggleAuthMode = function() {
    const isConnexion = document.getElementById('authTitle').innerText === "Connexion";
    document.getElementById('authTitle').innerText = isConnexion ? "Créer un compte" : "Connexion";
    document.getElementById('registerOnlyFields').style.display = isConnexion ? "block" : "none";
    document.getElementById('btnAuthAction').innerText = isConnexion ? "S'inscrire" : "Se connecter";
    document.getElementById('toggleLink').innerText = isConnexion ? "Se connecter" : "S'inscrire";
};

window.gererAuthentification = function() {
    const email = document.getElementById('authEmail').value.trim().toLowerCase();
    const user = document.getElementById('authUsername').value || "Utilisateur";
    const tel = document.getElementById('authCountry').value + document.getElementById('authPhone').value;

    document.getElementById('authSection').style.display = 'none';
    document.getElementById('mainDashboard').style.display = 'block';
    document.getElementById('burgerBtn').style.display = 'block';

    const refLink = `${window.location.origin}${window.location.pathname}?ref=${user}`;
    document.getElementById('referralLink').value = refLink;

    if (email === ADMIN_EMAIL) document.getElementById('adminLink').style.display = 'block';
};

// --- FONCTIONS ACTIONS ---
window.ouvrirModalRetrait = () => document.getElementById('modalRetrait').style.display = 'flex';
window.fermerModalRetrait = () => document.getElementById('modalRetrait').style.display = 'none';
window.copierLien = () => {
    const el = document.getElementById('referralLink');
    el.select(); document.execCommand('copy');
    alert("Lien copié !");
};
