import { describe, it, expect, beforeEach, afterEach } from 'vitest';

// admins
import { type AdminDBObj, type AdminFilter, type AdminResponse } from '$lib/classes/Admin';
import { insertAdminDB, deleteAdminDB, updateAdminDB, selectAdminDB } from '$lib/server/AdminSB';

describe('sanity/integrity test: it should add properly', () => {
    it('adds 9 + 10 to equal 19', () => {
      expect(9 + 10).toBe(19);
    });
  });