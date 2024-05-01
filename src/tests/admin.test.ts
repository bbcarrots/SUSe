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

    await expect(deleteAdminDB(newAdminNumber + 1)).resolves.toStrictEqual(expectedState);
  });
});
  
describe('selectAdminDB()', async () => {
  const newAdminNumber = 202100004;
  const newRFID = 700004;

  const adminInstanceOne: AdminDBObj = {
    admin_id: newAdminNumber,
    rfid: newRFID,
    pw: 'password',
    nickname: 'Spongebob',
    is_active: true
  };

  const adminInstanceTwo: AdminDBObj = {
    admin_id: newAdminNumber + 1,
    rfid: newRFID + 1,
    pw: 'password',
    nickname: 'Squidward',
    is_active: true
  };

  const adminInstanceThree: AdminDBObj = {
    admin_id: newAdminNumber + 2,
    rfid: newRFID + 2,
    pw: 'password',
    nickname: 'Mr. Krabs',
    is_active: false
  };
  const adminList: AdminDBObj[] = [adminInstanceOne, adminInstanceTwo, adminInstanceThree];

  beforeEach(async () => {
    for(const admin in adminList){
      await insertAdminDB(admin);
    }
  });

  afterEach(async () => {
    for(const admin in adminList){
      await deleteAdminDB(admin.admin_id);
    }
  });

  it('success: select single admin with adminID', async () => {
    const oneAdminFilter: AdminFilter = {
      adminID: newAdminNumber,
      nickname: "",
      isActive: null
		};
    const selectOutput = await selectAdminDB(oneAdminFilter);

		if (selectOutput.adminRaws !== null) {
			const selectOutputID = selectOutput.adminRaws[0].nickname; // extract admin nickname from selected admin
			// compare selected admin id with inserted admin id 
			expect(selectOutputID).toStrictEqual('Spongebob');
		}
  });

  it('success: select single admin with nickname', async () => {
    const oneAdminFilter: AdminFilter = {
      adminID: 0,
      nickname: "Squidward",
      isActive: null
		};
    const selectOutput = await selectAdminDB(oneAdminFilter);

		if (selectOutput.adminRaws !== null) {
			const selectOutputID = selectOutput.adminRaws[0].admin_id; // extract admin nickname from selected admin
			// compare selected admin id with inserted admin id 
			expect(selectOutputID).toStrictEqual(newAdminNumber + 1);
		}
  });

  it.skip('success: select range from isActive', async () => {
    const activeAdminFilter: AdminFilter = {
      adminID: 0,
      nickname: "",
      isActive: true
		};

    const selectOutput = await selectAdminDB(activeAdminFilter);
    const expectedAdmins = ['Spongebob', 'Squidward'];

		if (selectOutput.adminRaws !== null) {
      const selectOutputNames = selectOutput.adminRaws.map(admin => admin.nickname)
			// compare selected admin id with inserted admin id 
			expect(selectOutputNames).toStrictEqual(expectedAdmins);
		}  });

    it('success: select nonexistent admin', async () => {
      const oneAdminFilter: AdminFilter = {
        adminID: 0,
        nickname: "LeBron James",
        isActive: null
      };
      const selectOutput = await selectAdminDB(oneAdminFilter);
  
      if (selectOutput.adminRaws !== null) {
        const selectOutputID = selectOutput.adminRaws;
        expect(selectOutputID).toStrictEqual([]);
      }
    });
});