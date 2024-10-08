export interface GenesisUser {
  id: number;
  username: string;
  isAdministrator: boolean;
}

export interface NewGenesisUser {
  username: string;
  password: string;
  isAdministrator: boolean;
}

export interface GenesisLoginRequest {
  username: string;
  password: string;
}

export interface GenesisUpdatePasswordRequest {
  newPassword: string;
  currentPassword: string;
}

export interface GenesisStoreOptions {
  baseUrl: string;
  onSessionExpired?: (res: Response) => void;
}

export const createGenesisStore = (opt: GenesisStoreOptions) => {
  const assertOk = (res: Response, ignoreUnauthenticated = false) => {
    if (res.ok) {
      return res.headers.get('content-type')?.includes('json') ? res.json() : undefined;
    } else if (res.status === 401 && !ignoreUnauthenticated) {
      opt.onSessionExpired?.(res);
    } else {
      return Promise.reject(res);
    }
  };

  const getMe = async (): Promise<GenesisUser> => {
    const res = await fetch(`${opt.baseUrl}/api/v1/users/me`);
    return assertOk(res);
  };

  const login = async (request?: GenesisLoginRequest): Promise<GenesisUser> => {
    return assertOk(
      await fetch(`${opt.baseUrl}/api/v1/auth/session`, {
        method: 'POST',
        ...(request && {
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(request)
        })
      }),
      true
    );
  };

  const logout = async () => assertOk(await fetch(`${opt.baseUrl}/api/v1/auth/logout`, { method: 'POST' }));

  const updatePassword = async (request: GenesisUpdatePasswordRequest): Promise<void> =>
    assertOk(
      await fetch(`${opt.baseUrl}/api/v1/users/me/password`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      }),
      true
    );

  const getData = async (collection: string): Promise<object> =>
    assertOk(await fetch(`${opt.baseUrl}/api/v1/${collection}`));

  const getDataByKey = async (collection: string, key: string): Promise<unknown | undefined> =>
    assertOk(await fetch(`${opt.baseUrl}/api/v1/${collection}/${key}`));

  const setDataByKey = async (collection: string, key: string, data: unknown): Promise<void> =>
    assertOk(
      await fetch(`${opt.baseUrl}/api/v1/${collection}/${key}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
    );

  const deleteDataByKey = async (collection: string, key: string): Promise<void> =>
    assertOk(await fetch(`${opt.baseUrl}/api/v1/${key}`, { method: 'DELETE' }));

  const getAllUsers = async (): Promise<GenesisUser[]> =>
    assertOk(await fetch(`${opt.baseUrl}/api/v1/users`, { method: 'GET' }));

  const createUser = async (newUser: NewGenesisUser): Promise<void> =>
    assertOk(
      await fetch(`${opt.baseUrl}/api/v1/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      })
    );

  const updateUser = async (id: number, updatedUser: GenesisUser): Promise<void> =>
    assertOk(
      await fetch(`${opt.baseUrl}/api/v1/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser)
      })
    );

  const deleteUser = async (id: number): Promise<void> =>
    assertOk(await fetch(`${opt.baseUrl}/api/v1/users/${id}`, { method: 'DELETE' }));

  return {
    getMe,
    login,
    logout,
    updatePassword,
    getData,
    getDataByKey,
    setDataByKey,
    deleteDataByKey,
    getAllUsers,
    createUser,
    updateUser,
    deleteUser
  };
};
