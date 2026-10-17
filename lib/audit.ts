interface AuditEntry {
  at: string;
  who: string;
  action: string;
}

const KEY = "sitr-audit";
const MAX = 200;

let currentUser = "admin";

export function setAuditUser(user: string | null | undefined): void {
  currentUser = user?.trim() || "admin";
}

export function logAudit(action: string): void {
  try {
    const raw = localStorage.getItem(KEY);
    const list: AuditEntry[] = raw ? JSON.parse(raw) : [];
    list.unshift({ at: new Date().toISOString(), who: currentUser, action });
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX)));
  } catch {}
}

export function readAudit(): AuditEntry[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as AuditEntry[]) : [];
  } catch {
    return [];
  }
}

export function clearAudit(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {}
}
