/**
 * DanceOne Admin Authentication & Server-Side Security Simulation
 * Non-negotiable Rule 3: Admin is completely separated from normal user login.
 * Admin authorization must be strictly enforced with session token validation.
 */

const ADMIN_STORAGE_KEY = 'danceone_admin_session_token';
const ADMIN_SESSION_PAYLOAD_KEY = 'danceone_admin_session_info';

export interface AdminSessionInfo {
  adminId: string;
  email: string;
  name: string;
  role: 'admin';
  permissions: string[];
  issuedAt: number;
  expiresAt: number;
  token: string;
}

/**
 * Permanent, constant administrator credentials.
 * These fixed values are the ONLY accepted admin email/passkey/OTP combinations.
 * Keep in sync with the backend controller (`backend/src/controllers/authController.ts`).
 */
export const ADMIN_MASTER_CONFIG = {
  authorizedEmails: ['admin@danceone.in', 'superadmin@danceone.in', 'director@danceone.odisha.gov.in'],
  passkeyRequirement: 'danceone-odisha-secure-2026',
  demoOtp: '918273',
};

/**
 * Validates whether the active browser session holds a valid, unexpired Admin authorization token.
 */
export function validateAdminSession(): { isValid: boolean; session: AdminSessionInfo | null; reason?: string } {
  try {
    const token = sessionStorage.getItem(ADMIN_STORAGE_KEY);
    const rawPayload = sessionStorage.getItem(ADMIN_SESSION_PAYLOAD_KEY);

    if (!token || !rawPayload) {
      return { isValid: false, session: null, reason: 'No active DanceOne Admin session token found in secure storage.' };
    }

    const session = JSON.parse(rawPayload) as AdminSessionInfo;

    // Verify token matches signature pattern
    if (!token.startsWith('d1_sec_adm_') || session.token !== token) {
      clearAdminSession();
      return { isValid: false, session: null, reason: 'Invalid or forged Admin session token signature.' };
    }

    // Verify expiry (4 hour security window)
    if (Date.now() > session.expiresAt) {
      clearAdminSession();
      return { isValid: false, session: null, reason: 'Admin session expired. Please re-authenticate via the Admin Portal.' };
    }

    return { isValid: true, session };
  } catch {
    clearAdminSession();
    return { isValid: false, session: null, reason: 'Session validation error.' };
  }
}

/**
 * Authenticates admin credentials and establishes an authorized session.
 */
export function authenticateAdmin(
  emailInput: string,
  passkeyInput: string,
  otpInput: string
): { success: boolean; session?: AdminSessionInfo; error?: string } {
  const normalizedEmail = emailInput.trim().toLowerCase();

  const isEmailValid = ADMIN_MASTER_CONFIG.authorizedEmails.includes(normalizedEmail);
  const isPasskeyValid = passkeyInput === ADMIN_MASTER_CONFIG.passkeyRequirement;
  const isOtpValid = otpInput.trim() === ADMIN_MASTER_CONFIG.demoOtp;

  if (!isEmailValid) {
    return { success: false, error: 'Unauthorized Email. This portal is restricted to DanceOne platform administrators.' };
  }

  if (!isPasskeyValid) {
    return { success: false, error: 'Invalid Admin Security Key or Passkey.' };
  }

  if (!isOtpValid) {
    return { success: false, error: 'Invalid 2FA Authenticator code. Enter the 6-digit administrative OTP.' };
  }

  const tokenTimestamp = Date.now();
  const tokenRandom = Math.random().toString(36).substring(2, 10);
  const token = `d1_sec_adm_${tokenTimestamp}_${tokenRandom}`;

  const sessionInfo: AdminSessionInfo = {
    adminId: `adm-${normalizedEmail.split('@')[0]}`,
    email: normalizedEmail,
    name: normalizedEmail.includes('superadmin') ? 'SuperAdmin (HQ)' : 'DanceOne Platform Admin',
    role: 'admin',
    permissions: [
      'APPROVE_STUDIOS',
      'IMPORT_LOCAL_STUDIOS',
      'APPROVE_BRANDS',
      'SUSPEND_ACCOUNTS',
      'VIEW_AUDIT_LOGS',
      'MANAGE_COMMISSIONS',
      'RESOLVE_DISPUTES',
    ],
    issuedAt: tokenTimestamp,
    expiresAt: tokenTimestamp + 4 * 60 * 60 * 1000, // 4 hours
    token,
  };

  try {
    sessionStorage.setItem(ADMIN_STORAGE_KEY, token);
    sessionStorage.setItem(ADMIN_SESSION_PAYLOAD_KEY, JSON.stringify(sessionInfo));
  } catch (e) {
    console.error('Failed to write admin session to sessionStorage', e);
  }

  return { success: true, session: sessionInfo };
}

/**
 * Clears the administrative security token.
 */
export function clearAdminSession(): void {
  try {
    sessionStorage.removeItem(ADMIN_STORAGE_KEY);
    sessionStorage.removeItem(ADMIN_SESSION_PAYLOAD_KEY);
  } catch (e) {
    console.error('Failed to clear admin session', e);
  }
}
