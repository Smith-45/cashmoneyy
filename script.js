const ADMIN_EMAIL = "gedeon.yah45@gmail.com";
const LEVEL_CONFIG = {
    1: { nextReq: 5, link: "https://payliv.shop/pay/plv_d0kjvsgn" },
    2: { nextReq: 10, link: "https://payliv.shop/pay/plv_owag0oyg" },
    3: { nextReq: 20, link: "https://payliv.shop/pay/plv_xsly3d8r" },
    // ... Ajoute les autres liens ici
};

let currentUser = { level: 1, referrals: 0, balance: 2500 }; // Test avec solde

// --- EFFETS SPECIAUX ---
window.lancerLaFete = function() {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3');
    audio.play().catch(() => {});
    for (let i = 0; i < 50; i++) {
        const c = document.createElement('div');
        c.className = 'confetti';
        c.style.left = Math.random() * 100 + 'vw';
        c.style.backgroundColor = ['#FFD700','#007bff','#ff4d4d','#28a745'][Math.floor(Math.random()*4)];
        document.body.appendChild(c);
        setTimeout(() => c.remove(), 4000);
    }
};

// --- RETRAIT SÉCURISÉ ---
window.verifierFormatNumero = function() {
    const champ = document.getElementById('retraitPhoneFull');
    const err = document.getElementById('errorFormatPhone');
    const val = champ.value.trim();
    if (val.length > 0 && (!val.startsWith("+") || val.length < 10)) {
        err.style.display = "block";
        champ.style.borderColor = "#dc3545";
    } else {
        err.style.display = "none";
        champ.style.borderColor = "#28a745";
    }
};

window.envoyerDemandeRetrait = function() {
    const montant = parseInt(document.getElementById('retraitMontant').value);
    const numero = document.getElementById('retraitPhoneFull').value.trim();

    if (!numero.startsWith("+") || numero.length < 10) {
        alert("❌ Numéro invalide. N'oubliez pas le '+' et l'indicatif.");
        return;
    }
    if (montant < 2000 || montant > currentUser.balance) {
        alert("❌ Montant invalide ou solde insuffisant.");
        return;
    }

    if (confirm(`Confirmer le retrait de ${montant} F vers ${numero} ?`)) {
        alert("✅ Demande envoyée ! Gédéon traitera votre paiement.");
        fermerModalRetrait();
    }
};

// --- AUTH & NAV ---
window.gererAuthentification = function() {
    document.getElementById('authSection').style.display = 'none';
    document.getElementById('mainDashboard').style.display = 'block';
    document.getElementById('burgerBtn').style.display = 'block';
    if (document.getElementById('authEmail').value === ADMIN_EMAIL) document.getElementById('adminLink').style.display = 'block';
    mettreAJourLienRecharge();
};

window.mettreAJourLienRecharge = function() {
    const btn = document.getElementById('btnRechargeMain');
    btn.onclick = () => window.location.href = LEVEL_CONFIG[currentUser.level].link;
};

window.toggleAuthMode = function() {
    const isConn = document.getElementById('authTitle').innerText === "Connexion";
    document.getElementById('authTitle').innerText = isConn ? "Créer un compte" : "Connexion";
    document.getElementById('registerOnlyFields').style.display = isConn ? "block" : "none";
};

window.openNav = () => document.getElementById("mySidebar").style.width = "260px";
window.closeNav = () => document.getElementById("mySidebar").style.width = "0";
window.ouvrirModalRetrait = () => document.getElementById('modalRetrait').style.display = 'flex';
window.fermerModalRetrait = () => document.getElementById('modalRetrait').style.display = 'none';
window.fermerModalLevel = () => document.getElementById('modalLevelUp').style.display = 'none';
