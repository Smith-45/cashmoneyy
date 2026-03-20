// --- CONFIGURATION ---
const LEVEL_CONFIG = {
    1: { nextReq: 5, bonusDirect: 1100, bonusTeamUpgrade: 0, paymentLink: "https://payliv.shop/pay/plv_d0kjvsgn" },
    2: { nextReq: 10, bonusDirect: 1100, bonusTeamUpgrade: 1000, paymentLink: "https://payliv.shop/pay/plv_owag0oyg" },
    3: { nextReq: 20, bonusDirect: 1100, bonusTeamUpgrade: 2500, paymentLink: "https://payliv.shop/pay/plv_xsly3d8r" },
    4: { nextReq: 50, bonusDirect: 1100, bonusTeamUpgrade: 4000, paymentLink: "https://payliv.shop/pay/plv_ud7mm5ed" },
    5: { nextReq: 100, bonusDirect: 1100, bonusTeamUpgrade: 6500, paymentLink: "https://payliv.shop/pay/plv_qgfpdl6x" },
    6: { nextReq: 500, bonusDirect: 1100, bonusTeamUpgrade: 16000, paymentLink: "https://payliv.shop/pay/plv_anwhf24c" },
    7: { nextReq: 1000, bonusDirect: 1100, bonusTeamUpgrade: 28000, paymentLink: "https://payliv.shop/pay/plv_okndi1bp" }
};

// --- FORMATTAGE ---
function formaterDate(timestamp) {
    return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    }).format(new Date(timestamp));
}

// --- GESTION UI ---
function updateDashboard(userData) {
    const level = userData.level || 1;
    const config = LEVEL_CONFIG[level];
    const count = userData.referralCount || 0;

    // Mise à jour Solde et Niveau
    document.getElementById('userBalance').innerText = `${userData.solde || 0} FCFA`;
    document.getElementById('userLevelBadge').innerText = `Niveau ${level}`;
    
    // Bouton Recharge Dynamique
    const btnRecharge = document.getElementById('btnRechargeMain');
    btnRecharge.onclick = () => window.location.href = config.paymentLink;

    // Vérification Retrait
    const btnWithdraw = document.getElementById('btnWithdraw');
    if (count < config.nextReq) {
        btnWithdraw.innerHTML = `📤 Retrait (${count}/${config.nextReq})`;
        btnWithdraw.style.opacity = "0.6";
    } else {
        btnWithdraw.innerHTML = `📤 Retrait (Débloqué)`;
        btnWithdraw.style.background = "#28a745";
    }

    // Progression Parrainage
    document.getElementById('referralCount').innerText = count;
    document.getElementById('nextLevelReq').innerText = config.nextReq;
    const progress = (count / config.nextReq) * 100;
    document.getElementById('levelProgress').style.width = `${Math.min(progress, 100)}%`;
}

// --- NOTIFICATIONS ---
window.envoyerNotifGain = function(montant, type) {
    const container = document.getElementById('notificationArea');
    const notif = document.createElement('div');
    notif.className = 'notif-toast';
    notif.innerHTML = `🎉 <strong>+${montant} FCFA</strong> - Bonus ${type}`;
    container.appendChild(notif);
    setTimeout(() => notif.remove(), 5000);
};

// --- EXPORT DES FONCTIONS ---
window.copierLien = () => {
    const link = `${window.location.origin}?ref=${currentUser.uid}`;
    navigator.clipboard.writeText(link);
    alert("Lien copié !");
};
