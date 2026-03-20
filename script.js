import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, onSnapshot, increment, addDoc, collection, serverTimestamp, query, where, orderBy, limit, deleteDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
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

let iti, itiRetrait;
let isLoginMode = false;

// --- INITIALISATION ---
window.addEventListener('DOMContentLoaded', () => {
    iti = window.intlTelInput(document.querySelector("#regTel"), {
        initialCountry: "tg", preferredCountries: ["tg", "bj", "ci"], separateDialCode: true,
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
    });
});

// --- SURVEILLANCE AUTHENTIFICATION ---
onAuthStateChanged(auth, async (user) => {
    document.getElementById('loadingScreen').style.display = 'none';
    if (user) {
        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);
        
        // 🚫 Vérification Bannissement
        if (snap.exists() && snap.data().statut === "banni") {
            alert("Compte banni pour fraude.");
            await signOut(auth);
            return;
        }

        // 🛠 Détection Admin Gedeon
        if (user.email === "gedeon.yah45@gmail.com") {
            document.getElementById('adminLink').style.display = 'block';
        }

        document.getElementById('authSection').style.display = 'none';
        document.getElementById('mainDashboard').style.display = 'block';
        document.getElementById('burgerBtn').style.display = 'block';

        onSnapshot(userRef, (s) => { if(s.exists()) document.getElementById('userBalance').innerText = s.data().solde + " FCFA"; });
        chargerNotifications(user.uid);
        chargerHistorique(user.uid);
    } else {
        document.getElementById('authSection').style.display = 'block';
        document.getElementById('mainDashboard').style.display = 'none';
        document.getElementById('burgerBtn').style.display = 'none';
    }
});

// --- ACTIONS AUTH ---
window.gererAuth = async () => {
    const email = document.getElementById('authEmail').value;
    const pass = document.getElementById('authPassword').value;
    const refId = new URLSearchParams(window.location.search).get('ref');

    try {
        if (isLoginMode) {
            await signInWithEmailAndPassword(auth, email, pass);
        } else {
            const nom = document.getElementById('regNom').value;
            if (!nom || !iti.isValidNumber()) return alert("Infos invalides");
            const res = await createUserWithEmailAndPassword(auth, email, pass);
            await setDoc(doc(db, "users", res.user.uid), {
                nom, telephone: iti.getNumber(), email, solde: 0, statut: "actif", parrainID: refId || null
            });
            if (refId) await updateDoc(doc(db, "users", refId), { solde: increment(1100) });
        }
    } catch (e) { alert(e.message); }
};

// --- NAVIGATION ---
window.toggleAuthMode = () => {
    isLoginMode = !isLoginMode;
    document.getElementById('authTitle').innerText = isLoginMode ? "Connexion" : "Créer un compte";
    document.getElementById('registerFields').style.display = isLoginMode ? "none" : "block";
    document.getElementById('btnAuthAction').innerText = isLoginMode ? "Se connecter" : "S'inscrire";
};
window.openNav = () => document.getElementById("mySidebar").style.width = "280px";
window.closeNav = () => document.getElementById("mySidebar").style.width = "0";
window.showSection = (id) => { window.closeNav(); document.getElementById(id).scrollIntoView({ behavior: 'smooth' }); };

// --- FONCTIONS GAIN ---
window.partagerWhatsApp = () => {
    const link = `https://${window.location.hostname}/?ref=${auth.currentUser.uid}`;
    window.open(`https://wa.me/?text=Gagne 1100 F par ami sur CA$HMONEY. Inscris-toi ici : ${link}`, '_blank');
};

window.missionTikTok = () => {
    window.open("https://www.tiktok.com/@1privateside", "_blank");
    setTimeout(async () => {
        await updateDoc(doc(db, "users", auth.currentUser.uid), { solde: increment(50) });
        alert("+50 F ajoutés !");
    }, 10000);
};

// --- FINANCES ---
window.signalerPaiement = async () => {
    const id = document.getElementById('paylivID').value;
    if(!id) return alert("ID manquant");
    await addDoc(collection(db, "recharges"), { userId: auth.currentUser.uid, transactionID: id, statut: "En attente", date: serverTimestamp() });
    alert("Vérification en cours par l'admin.");
};

window.ouvrirModalRetrait = () => {
    document.getElementById('modalRetrait').style.display = 'block';
    if(!itiRetrait) itiRetrait = window.intlTelInput(document.querySelector("#retraitTel"), { initialCountry: "tg", separateDialCode: true });
};
window.fermerModalRetrait = () => document.getElementById('modalRetrait').style.display = 'none';

window.soumettreRetrait = async () => {
    const montant = parseInt(document.getElementById('retraitMontant').value);
    if (montant < 2000) return alert("Minimum 2000 F");
    const userRef = doc(db, "users", auth.currentUser.uid);
    const snap = await getDoc(userRef);
    if (snap.data().solde < montant) return alert("Solde insuffisant");

    await updateDoc(userRef, { solde: increment(-montant) });
    await addDoc(collection(db, "retraits"), { userId: auth.currentUser.uid, montant, telephone: itiRetrait.getNumber(), statut: "En attente", date: serverTimestamp() });
    alert("Demande transmise.");
    window.fermerModalRetrait();
};

// --- HISTORIQUE & NOTIFS ---
function chargerNotifications(uid) {
    const q = query(collection(db, "notifications"), where("userId", "==", uid), orderBy("date", "desc"), limit(3));
    onSnapshot(q, (snap) => {
        const area = document.getElementById('notificationArea');
        area.innerHTML = "";
        snap.forEach(d => area.innerHTML += `<div class="notif-box"><span>${d.data().message}</span><b onclick="window.supprimerNotif('${d.id}')" style="cursor:pointer">×</b></div>`);
    });
}
window.supprimerNotif = async (id) => await deleteDoc(doc(db, "notifications", id));

function chargerHistorique(uid) {
    const q = query(collection(db, "archives_transactions"), where("userId", "==", uid), orderBy("date", "desc"));
    onSnapshot(q, (snap) => {
        const list = document.getElementById('userHistoryList');
        document.getElementById('countTransac').innerText = snap.size;
        list.innerHTML = "";
        snap.forEach(d => {
            const data = d.data();
            list.innerHTML += `<div class="history-item"><span>${data.type}</span><span style="color:${data.type==='retrait'?'red':'green'}">${data.montant} F</span></div>`;
        });
    });
}
window.deconnexion = () => signOut(auth).then(() => window.location.reload());