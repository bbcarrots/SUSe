import { describe, it, expect, beforeEach, afterEach } from 'vitest';


// usage logs
import { type UsageLogDBObj, type UsageLogFilter, type UsageLogResponse } from '$lib/classes/UsageLog';
import { insertUsageLogDB, deleteUsageLogDB, updateUsageLogDB, selectUsageLogDB } from '$lib/server/UsageLogSB';

describe('sanity/integrity test: it should add properly', () => {
    it('adds 8 + 5 to equal 13', () => {
      expect(8 + 5).toBe(13);
    });
  });