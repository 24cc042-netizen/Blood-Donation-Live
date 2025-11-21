import { useEffect, useState } from 'react';
import { collectionGroup, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function useInventory(bloodType: string, componentName?: string) {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    let q = query(collectionGroup(db, 'inventory'), where('bloodType', '==', bloodType));
    if (componentName) {
      q = query(collectionGroup(db, 'inventory'), where('bloodType', '==', bloodType), where('component', '==', componentName));
    }
    const unsub = onSnapshot(q, snap => {
      const arr: any[] = [];
      snap.forEach(doc => arr.push({ id: doc.id, ...doc.data() }));
      setItems(arr);
    });
    return () => unsub();
  }, [bloodType, componentName]);

  return items;
}
