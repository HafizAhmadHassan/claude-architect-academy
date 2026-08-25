export interface User {
  id: string;
  name: string;
  email: string;
  avatarColor: string;
  createdAt: string;
}

interface StoredUser extends User {
  passwordHash: string;
}

const USERS_KEY = "caa-users-v1";
const SESSION_KEY = "caa-session-v1";

const AVATAR_COLORS = [
  "#7c3aed", "#2563eb", "#059669", "#d97706",
  "#dc2626", "#7c3aed", "#0891b2", "#4f46e5",
];

function hashPassword(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  const salt = "caa-salt-" + password.length;
  let result = 0;
  for (let i = 0; i < salt.length; i++) {
    result = ((result << 5) - result + salt.charCodeAt(i)) | 0;
  }
  return `${Math.abs(hash)}-${Math.abs(result)}`;
}

function getUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]): void {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {}
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function register(
  name: string,
  email: string,
  password: string
): { ok: boolean; error?: string; user?: User } {
  const users = getUsers();
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return { ok: false, error: "An account with this email already exists." };
  }
  if (password.length < 6) {
    return { ok: false, error: "Password must be at least 6 characters." };
  }
  if (name.trim().length < 2) {
    return { ok: false, error: "Name must be at least 2 characters." };
  }
  const user: StoredUser = {
    id: generateId(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    passwordHash: hashPassword(password),
    avatarColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  saveUsers(users);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash: _pw, ...publicUser } = user;
  setSession(publicUser);
  return { ok: true, user: publicUser };
}

export function login(
  email: string,
  password: string
): { ok: boolean; error?: string; user?: User } {
  const users = getUsers();
  const found = users.find(
    (u) => u.email === email.trim().toLowerCase() && u.passwordHash === hashPassword(password)
  );
  if (!found) {
    return { ok: false, error: "Invalid email or password." };
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash: _pw2, ...publicUser } = found;
  setSession(publicUser);
  return { ok: true, user: publicUser };
}

export function logout(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {}
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

function setSession(user: User): void {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } catch {}
}

export function updateProfile(
  updates: Partial<Pick<User, "name" | "avatarColor">>
): User | null {
  const user = getCurrentUser();
  if (!user) return null;
  const updated = { ...user, ...updates };
  setSession(updated);
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === user.id);
  if (idx !== -1) {
    users[idx] = { ...users[idx], ...updates };
    saveUsers(users);
  }
  return updated;
}
