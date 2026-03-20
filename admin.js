window.validerRetraitAdmin = function(id, num, montant) {
    const heure = new Date().toLocaleTimeString('fr-FR');
    if(confirm(`Voulez-vous valider le paiement de ${montant} F au ${num} ?`)) {
        alert(`✅ Retrait validé à ${heure}. Argent décaissé.`);
        location.reload();
    }
};

window.exporterHistoriqueCSV = function() {
    let content = "Date,Type,Nom,Contact,Montant,Statut\n" +
                  "20/03/2026,Retrait,Koffi,+22890123456,15000,Payé\n" +
                  "20/03/2026,Recharge,Moussa,ID-998,5000,Validé";
    const blob = new Blob([content], {type: 'text/csv'});
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'BILAN_CASHMONEY.csv';
    a.click();
};
