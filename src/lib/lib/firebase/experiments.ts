import { db } from './config';
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
  where,
  deleteDoc,
  doc,
} from 'firebase/firestore';

// ──── Types ────

export interface ExperimentLog {
  id?: string;
  experimentType: string;     // 'bar-pendulum' | 'fiber-aperture' | 'newtons-rings' | 'spectrometer'
  experimentName: string;     // Display name
  sessionId: string;          // Auto-generated VPL-S-XXXX
  data: Record<string, any>[];  // The observation rows
  status: 'COMPLETED' | 'IN_PROGRESS';
  createdAt?: Timestamp;
}

// ──── Helpers ────

let sessionCounter = Math.floor(Math.random() * 9000) + 1000;
export function generateSessionId(): string {
  return `VPL-S-${String(sessionCounter++).padStart(4, '0')}`;
}

// ──── CRUD Operations ────

const COLLECTION = 'experiment_logs';

/**
 * Save a completed experiment's readings to Firestore.
 */
export async function saveExperimentData(
  experimentType: string,
  experimentName: string,
  data: Record<string, any>[]
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, COLLECTION), {
      experimentType,
      experimentName,
      sessionId: generateSessionId(),
      data,
      status: 'COMPLETED',
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Firebase save failed, using local fallback:', error);
    // Fallback: save to localStorage so data is never lost
    const key = `vpl_backup_${Date.now()}`;
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        key,
        JSON.stringify({ experimentType, experimentName, data, savedAt: new Date().toISOString() })
      );
    }
    return key;
  }
}

/**
 * Fetch recent experiment logs, newest first.
 */
export async function getRecentLogs(limit = 20): Promise<ExperimentLog[]> {
  try {
    const q = query(
      collection(db, COLLECTION),
      orderBy('createdAt', 'desc'),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.slice(0, limit).map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ExperimentLog[];
  } catch (error) {
    console.error('Firebase fetch failed:', error);
    return [];
  }
}

/**
 * Delete an experiment log by ID.
 */
export async function deleteExperimentLog(logId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, COLLECTION, logId));
  } catch (error) {
    console.error('Firebase delete failed:', error);
  }
}

/**
 * Export readings to CSV and trigger download.
 */
export function exportToCSV(experimentName: string, data: Record<string, any>[]): void {
  if (!data || data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','),
    ...data.map((row) =>
      headers.map((h) => {
        const val = row[h];
        return typeof val === 'string' ? `"${val}"` : val;
      }).join(',')
    ),
  ];

  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${experimentName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
