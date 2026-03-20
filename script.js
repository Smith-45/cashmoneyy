import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, onSnapshot, increment, addDoc, collection, serverTimestamp, query, where, orderBy, deleteDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBCExSHkawIHfsmAvyU_3cAQa2JDfaNMeM",
    authDomain: "cashmoney-94740.firebaseapp.com",
    projectId: "cashmoney-94740",
    storageBucket: "cashmoney-94740.firebasestorage.app",
    messagingSenderId: "545930031325",
    appId: "1:545930031325:web:4915222ad0db491081ab34"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

let isLogin = false;
let iti;

// --- SURVEILLANCE CONNEXION ---
onAuthStateChanged(auth, async (user) => {
    document.getElementById('loadingScreen').style.display = 'none';

    if (user) {
        const userRef = doc(db, "users", user.uid);
        const uSnap = await getDoc(userRef);

        // 1. BLOCAGE BANNI
        if (uSnap.exists() && uSnap.data().statut === "banni") {
            alert("❌ Votre compte a été suspendu par l'administrateur.");
            await signOut(auth);
            return;
        }

        // 2. DETECTION ADMIN GEDEON
        if (user.email === "gedeon.yah45@gmail.com") {
            const admBtn = document.getElementById('adminLink');
            if(admBtn) admBtn.style.display = 'block';
        }

        // 3. AFFICHAGE DASHBOARD
        document.getElementById('authSection').style.display = 'none';
        document.getElementById('mainDashboard').style.display = 'block';
        document.getElementById('burgerBtn').style.display = 'block';

        // 4. SUIVI DU SOLDE EN TEMPS RÉEL
        onSnapshot(userRef, (s) => { 
            if(s.exists()) document.getElementById('userBalance').innerText = s.data().solde + " FCFA"; 
        });

        chargerDonneesClient(user.uid);
    } else {
        document.getElementById('authSection').style.display = 'block';
        document.getElementById('mainDashboard').style.display = 'none';
        document.getElementById('burgerBtn').style.display = 'none';
    }
});

// --- ACTIONS AUTHENTIFICATION ---
window.gererAuth = async () => {
    const email = document.getElementById('authEmail').value;
    const pass = document.getElementById('authPassword').value;
    const refId = new URLSearchParams(window.location.search).get('ref');

    try {
        if (isLogin) {
            await signInWithEmailAndPassword(auth, email, pass);
        } else {
            const nom = document.getElementById('regNom').value;
            if(!nom) return alert("Entrez votre nom");
            const res = await createUserWithEmailAndPassword(auth, email, pass);
            await setDoc(doc(db, "users", res.user.uid), {
                nom, email, solde: 0, statut: "actif", parrainID: refId || null
            });
            if (refId) await updateDoc(doc(db, "users", refId), { solde: increment(1100) });
        }
    } catch (e) { alert("Erreur: " + e.message); }
};

window.toggleAuthMode = () => {
    isLogin = !isLogin;
    document.getElementById('authTitle').innerText = isLogin ? "Connexion" : "Créer un compte";
    document.getElementById('registerFields').style.display = isLogin ? "none" : "block";
    document.getElementById('btnAuthAction').innerText = isLogin ? "Se connecter" : "S'inscrire";
    document.getElementById('toggleLink').innerText = isLogin ? "Pas de compte ? S'inscrire" : "Déjà un compte ? Se connecter";
};

// --- FINANCES & PARRAINAGE ---
window.signalerPaiement = async () => {
    const id = document.getElementById('paylivID').value;
    if(!id) return alert("ID Transaction requis");
    await addDoc(collection(db, "recharges"), { 
        userId: auth.currentUser.uid, transactionID: id, statut: "En attente", date: serverTimestamp() 
    });
    alert("Signalement envoyé. L'administrateur validera sous peu.");
};

window.soumettreRetrait = async () => {
    const montant = parseInt(document.getElementById('retraitMontant').value);
    const tel = document.getElementById('retraitTel').value;
    if(montant < 2000) return alert("Minimum 2000 FCFA");
    
    const snap = await getDoc(doc(db, "users", auth.currentUser.uid));
    if (snap.data().solde < montant) return alert("Solde insuffisant");

    await updateDoc(doc(db, "users", auth.currentUser.uid), { solde: increment(-montant) });
    await addDoc(collection(db, "retraits"), { 
        userId: auth.currentUser.uid, montant, telephone: tel, statut: "En attente", date: serverTimestamp() 
    });
    alert("Demande transmise !");
    window.fermerModalRetrait();
};

window.partagerWhatsApp = () => {
    const link = `https://smith-45.github.io/cashmoneyy/?ref=${auth.currentUser.uid}`;
    window.open(`https://wa.me/?text=Gagne 1100F par ami sur CA$HMONEY ! Rejoins-moi ici : ${link}`, '_blank');
};

function chargerDonneesClient(uid) {
    // Notifications
    onSnapshot(query(collection(db, "notifications"), where("userId", "==", uid)), (snap) => {
        const area = document.getElementById('notificationArea');
        area.innerHTML = "";
        snap.forEach(d => {
            area.innerHTML += `<div class="notif-box"><span>${d.data().message}</span><b onclick="window.effacerNotif('${d.id}')" style="cursor:pointer">×</b></div>`;
        });
    });
    // Historique
    onSnapshot(query(collection(db, "archives_transactions"), where("userId", "==", uid), orderBy("date", "desc")), (snap) => {
        const list = document.getElementById('userHistoryList');
        list.innerHTML = snap.empty ? "Aucune transaction." : "";
        snap.forEach(d => {
            const data = d.data();
            list.innerHTML += `<div class="history-item"><span>${data.type}</span><b>${data.montant} F</b></div>`;
        });
    });
}

// --- UI UTILS ---
window.effacerNotif = async (id) => await deleteDoc(doc(db, "notifications", id));
window.openNav = () => document.getElementById("mySidebar").style.width = "280px";
window.closeNav = () => document.getElementById("mySidebar").style.width = "0";
window.showSection = (id) => { window.closeNav(); document.getElementById(id).scrollIntoView({behavior:'smooth'}); };
window.ouvrirModalRetrait = () => document.getElementById('modalRetrait').style.display = 'block';
window.fermerModalRetrait = () => document.getElementById('modalRetrait').style.display = 'none';
window.deconnexion = () => signOut(auth).then(() => location.reload());

window.addEventListener('DOMContentLoaded', () => {
    iti = window.intlTelInput(document.querySelector("#regTel"), { initialCountry: "tg", separateDialCode: true });
});