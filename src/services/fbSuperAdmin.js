import {
  collection, doc, getDoc, setDoc, updateDoc,
  getDocs, query, where, orderBy, Timestamp, deleteDoc
} from 'firebase/firestore'
import { db } from '../firebase'

export const SUPERADMIN_EMAIL = 'koresma@mailbox.org'

// ===== VERIFICAR SE É SUPERADMIN =====
export function isSuperAdmin(email) {
  return email === SUPERADMIN_EMAIL
}

// ===== REGISTAR UTILIZADOR (após Google login) =====
export async function registarUtilizador(user) {
  const ref = doc(db, 'registo_utilizadores', user.uid)
  const snap = await getDoc(ref)

  if (!snap.exists()) {
    await setDoc(ref, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || '',
      photoURL: user.photoURL || '',
      status: 'pending',
      requestedAt: Timestamp.now(),
      approvedAt: null,
      approvedBy: null,
      rejectedAt: null,
      rejectedReason: null
    })
    return 'pending'
  }

  return snap.data().status
}

// ===== OBTER STATUS DO UTILIZADOR =====
export async function obterStatusUtilizador(uid) {
  const snap = await getDoc(doc(db, 'registo_utilizadores', uid))
  if (!snap.exists()) return null
  return snap.data()
}

// ===== APROVAR UTILIZADOR =====
export async function aprovarUtilizador(uid, adminEmail) {
  await updateDoc(doc(db, 'registo_utilizadores', uid), {
    status: 'approved',
    approvedAt: Timestamp.now(),
    approvedBy: adminEmail,
    rejectedAt: null,
    rejectedReason: null
  })
}

// ===== REJEITAR UTILIZADOR =====
export async function rejeitarUtilizador(uid, adminEmail, motivo = '') {
  await updateDoc(doc(db, 'registo_utilizadores', uid), {
    status: 'rejected',
    rejectedAt: Timestamp.now(),
    rejectedReason: motivo,
    approvedAt: null,
    approvedBy: null
  })
}

// ===== REVOGAR ACESSO =====
export async function revogarUtilizador(uid) {
  await updateDoc(doc(db, 'registo_utilizadores', uid), {
    status: 'revoked',
    approvedAt: null
  })
}

// ===== LISTAR TODOS OS UTILIZADORES =====
export async function listarUtilizadores(filtro = 'todos') {
  const q = collection(db, 'registo_utilizadores')
  const snap = await getDocs(q)

  let users = snap.docs.map(d => ({ id: d.id, ...d.data() }))
  users.sort((a, b) => (b.requestedAt?.toDate?.() || 0) - (a.requestedAt?.toDate?.() || 0))

  if (filtro !== 'todos') users = users.filter(u => u.status === filtro)
  return users
}

// ===== OBTER CONSUMO API DE UM UTILIZADOR =====
export async function obterConsumoUtilizador(uid) {
  try {
    const snap = await getDocs(collection(db, `users/${uid}/estatisticas_api`))
    return snap.docs[0]?.data() || null
  } catch {
    return null
  }
}

// ===== OBTER CONSUMO TOTAL GLOBAL =====
export async function obterConsumoTotal() {
  const usersSnap = await getDocs(collection(db, 'registo_utilizadores'))
  const aprovados = usersSnap.docs.filter(d => d.data().status === 'approved')

  let totalChamadas = 0
  let totalCusto = 0
  let porUtilizador = []

  for (const u of aprovados) {
    const stats = await obterConsumoUtilizador(u.id)
    if (stats) {
      totalChamadas += stats.chamadas_totais || 0
      totalCusto += stats.custo_estimado || 0
      porUtilizador.push({
        uid: u.id,
        email: u.data().email,
        displayName: u.data().displayName,
        ...stats
      })
    }
  }

  return { totalChamadas, totalCusto, porUtilizador }
}
