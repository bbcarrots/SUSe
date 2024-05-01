import { describe, it, expect, beforeEach, afterEach } from 'vitest';

// admins
import { type AdminDBObj, type AdminFilter, type AdminResponse } from '$lib/classes/Admin';
import { insertAdminDB, deleteAdminDB, updateAdminDB, selectAdminDB } from '$lib/server/AdminSB';

describe('sanity/integrity test: it should add properly', () => {
    it('adds 9 + 10 to equal 19', () => {
      expect(9 + 10).toBe(19);
    });
  });


describe('insertAdminDB()', () => {
  const newAdminNumber = 202100001;
  const newRFID = 700001;
  const newNickname = 'Spongebob';
  const adminInstance: AdminDBObj = {
    admin_id: newAdminNumber,
    rfid: newRFID,
    pw: 'password',
    nickname: newNickname,
    is_active: false
  };

  it('success: inserted admin in database', async () => {
    const expectedState: AdminResponse = {
      success: true,
      adminRaws: null,
      error: null
    };
    await expect(insertAdminDB(adminInstance)).resolves.toStrictEqual(expectedState);
    await deleteAdminDB(newAdminNumber); // clean up dummy entry
  });
});

describe('error: insert with admin number in use', async () => {
  const newAdminNumber = 202100001;
  const newRFID = 700001;
  const newNickname = 'Spongebob';
  const adminInstance: AdminDBObj = {
    admin_id: newAdminNumber,
    rfid: newRFID,
    pw: 'password',
    nickname: newNickname,
    is_active: false
  };
  beforeEach(async () => {
    await insertAdminDB(adminInstance);
  });

  afterEach(async () => {
    await deleteAdminDB(newAdminNumber);
  });

  it('error: insert admin with existing ID', async () => {
    const expectedState: AdminResponse = {
      success: false,
      adminRaws: null,
      error: 'duplicate key value violates unique constraint "admin_admin_id_key"'
    };

    const dupeAdminInstance: AdminDBObj = {
      admin_id: newAdminNumber,
      rfid: newRFID + 1,
      pw: 'password',
      nickname: newNickname,
      is_active: false
    };

    await expect(insertAdminDB(dupeAdminInstance)).resolves.toStrictEqual(expectedState);
  });
});


describe('updateAdminDB()', async () => {
  const newAdminNumber = 202100002;
  const newRFID = 700002;
  const newNickname = 'Spongebob';
  const adminInstance: AdminDBObj = {
    admin_id: newAdminNumber,
    rfid: newRFID,
    pw: 'password',
    nickname: newNickname,
    is_active: false
  };
  beforeEach(async () => {
    await insertAdminDB(adminInstance);
  });

  afterEach(async () => {
    await deleteAdminDB(newAdminNumber);
  });

  it('success: update admin', async () => {
    const expectedState: AdminResponse = {
      success: true,
      adminRaws: null,
      error: null
    };

    const updatedAdminInstance: AdminDBObj = {
      admin_id: newAdminNumber,
      rfid: newRFID,
      pw: 'password',
      nickname: "Patrick",
      is_active: false
    };

    await expect(updateAdminDB(updatedAdminInstance)).resolves.toStrictEqual(expectedState);
  });

  it('error: update non existent admin ID', async () => {
    const expectedState: AdminResponse = {
      success: false,
      adminRaws: null,
      error: 'Error: Admin does not exist'
    };

    const updatedAdminInstance: AdminDBObj = {
      admin_id: newAdminNumber + 1,
      rfid: newRFID,
      pw: 'password',
      nickname: "Patrick",
      is_active: false
    };

    await expect(updateAdminDB(updatedAdminInstance)).resolves.toStrictEqual(expectedState);
  });
});


describe('deleteAdminDB()', async () => {
  const newAdminNumber = 202100003;
  const newRFID = 700003;
  const newNickname = 'Spongebob';
  const adminInstance: AdminDBObj = {
    admin_id: newAdminNumber,
    rfid: newRFID,
    pw: 'password',
    nickname: newNickname,
    is_active: false
  };
  beforeEach(async () => {
    await insertAdminDB(adminInstance);
  });

  afterEach(async () => {
    await deleteAdminDB(newAdminNumber);
  });

  it('success: delete admin', async () => {
    const expectedState: AdminResponse = {
      success: true,
      adminRaws: null,
      error: null
    };

    await expect(deleteAdminDB(newAdminNumber)).resolves.toStrictEqual(expectedState);
  });

  it('error: delete non existent admin ID', async () => {
    const expectedState: AdminResponse = {
      success: false,
      adminRaws: null,
      error: 'Error: Admin does not exist'
    };

    await expect(updateAdminDB(newAdminNumber + 1)).resolves.toStrictEqual(expectedState);
  });
});
  
