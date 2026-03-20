import { formaterDate, LEVEL_CONFIG } from './script.js';

// --- VALIDATION MANUELLE ---
window.validerManuellement = async function(requestId, userId, niveauVise, parrainId) {
    const input = document.getElementById(`montant_${requestId}`);
    const montant = parseFloat(input.value);

    if(!montant) return alert("Saisissez un montant.");

    if(confirm(`Créditer ${montant} FCFA ?`)) {
        // 1. Créditer Utilisateur (Simulation DB)
        console.log(`Crédit de ${montant} à ${userId}`);

        // 2. Verser Bonus au Parrain
        if(parrainId) {
            const bonusDirect = 1100;
            const bonusUpgrade = LEVEL_CONFIG[niveauVise].bonusTeamUpgrade;
            console.log(`Parrain ${parrainId} reçoit ${bonusDirect + bonusUpgrade}`);
        }
        
        alert("Paiement validé !");
        location.reload();
    }
};

// --- REJET ---
window.rejeterDemande = (id) => {
    const motif = prompt("Motif du rejet :");
    if(motif) {
        console.log(`Demande ${id} rejetée pour : ${motif}`);
        alert("Rejeté.");
        location.reload();
    }
};
