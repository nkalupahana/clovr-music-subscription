/**
 * Run every 24 hours, with basic public key check.
 * This should check all accounts with a subscription to
 * see what channels they have allowlisted, and
 * whether they are paying for them. If they're not (reduced quantity
 * or cancellation), they will be removed from the allowlist.
 * Should also check for webhook failures (look for "cancelled"
 * or "incomplete_expired" state, and void).
 */