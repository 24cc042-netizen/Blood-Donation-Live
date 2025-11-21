import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function useInstitution(ownerUid: string | null) {
  const [inst, setInst] = useState<any | null>(null);

  useEffect(() => {
    if (!ownerUid) return;
    async function fetchInst() {
      try {
        const q = query(collection(db, 'institutions'), where('ownerUid', '==', ownerUid));
        const snap = await getDocs(q);
        snap.forEach(d => setInst({ id: d.id, ...d.data() }));
      } catch (e) {
        console.warn('Failed to load institution for owner', e);
      }
    }
    fetchInst();
  }, [ownerUid]);

  return inst;
}
