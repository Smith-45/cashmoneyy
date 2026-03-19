import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, onSnapshot, increment, addDoc, collection, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
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

let iti;
let isLoginMode = false;

window.addEventListener('DOMContentLoaded', () => {
    const input = document.querySelector("#regTel");
    iti = window.intlTelInput(input, {
        initialCountry: "tg",
        preferredCountries: ["tg", "bj", "ci"],
        separateDialCode: true,
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
    });
});

onAuthStateChanged(auth, async (user) => {
    document.getElementById('loadingScreen').style.display = 'none';
    if (user) {
        document.getElementById('authSection').style.display = 'none';
        document.getElementById('mainDashboard').style.display = 'block';
        document.getElementById('burgerBtn').style.display = 'block';
        onSnapshot(doc(db, "users", user.uid), (snap) => {
            if(snap.exists()) document.getElementById('userBalance').innerText = snap.data().solde + " FCFA";
        });
    } else {
        document.getElementById('authSection').style.display = 'block';
        document.getElementById('mainDashboard').style.display = 'none';
        document.getElementById('burgerBtn').style.display = 'none';
    }
});

window.toggleAuthMode = () => {
    isLoginMode = !isLoginMode;
    document.getElementById('authTitle').innerText = isLoginMode ? "Connexion" : "Créer un compte";
    document.getElementById('btnAuthAction').innerText = isLoginMode ? "Se connecter" : "S'inscrire";
    document.getElementById('registerFields').style.display = isLoginMode ? "none" : "block";
    document.getElementById('toggleText').innerText = isLoginMode ? "Pas de compte ?" : "Déjà un compte ?";
    document.getElementById('toggleLink').innerText = isLoginMode ? "S'inscrire" : "Se connecter";
};

window.gererAuth = async () => {
    const email = document.getElementById('authEmail').value;
    const pass = document.getElementById('authPassword').value;
    const nom = document.getElementById('regNom').value;
    const tel = iti.getNumber();

    if (!email || !pass) return alert("Remplissez les champs");

    try {
        if (isLoginMode) {
            await signInWithEmailAndPassword(auth, email, pass);
        } else {
            if (!nom || !iti.isValidNumber()) return alert("Nom ou numéro invalide");
            const res = await createUserWithEmailAndPassword(auth, email, pass);
            await setDoc(doc(db, "users", res.user.uid), {
                nom: nom, telephone: tel, email: email, solde: 0,
                parrainID: new URLSearchParams(window.location.search).get('ref') || null
            });
        }
    } catch (e) { alert(e.message); }
};

window.deconnexion = () => signOut(auth).then(() => window.location.reload());
window.openNav = () => document.getElementById("mySidebar").style.width = "280px";
window.closeNav = () => document.getElementById("mySidebar").style.width = "0";
window.showSection = (id) => { document.getElementById(id).scrollIntoView({ behavior: 'smooth' }); closeNav(); };

window.partagerWhatsApp = () => {
    const link = `https://smith-45.github.io/cashmoney/?ref=${auth.currentUser.uid}`;
    window.open(`https://wa.me/?text=Gagne 1100 F par ami sur CA$HMONEY. Lien : ${link}`, '_blank');
};

window.missionTikTok = () => {
    window.open("https://www.tiktok.com/@1privateside", "_blank");
    setTimeout(async () => {
        await updateDoc(doc(db, "users", auth.currentUser.uid), { solde: increment(50) });
        alert("+50 F ajoutés !");
    }, 10000);
};

window.signalerPaiement = async () => {
    const id = document.getElementById('paylivID').value;
    if(!id) return alert("Entrez l'ID");
    await addDoc(collection(db, "recharges"), {
        userId: auth.currentUser.uid,
        transactionID: id,
        statut: "En attente",
        date: serverTimestamp()
    });
    alert("Signalé !");
};
