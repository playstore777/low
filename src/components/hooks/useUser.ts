import { useCallback, useEffect, useState } from "react";

import { getUserById } from "../../server/server";
import { User } from "../../types/types";

export default function useUser(uid: string) {
  const [user, setUser] = useState<Partial<User> | null>(null);

  const getUser = useCallback(async () => {
    // console.log(uid);
    const res = await getUserById(uid);
    setUser(res);
  }, [uid]);

  useEffect(() => {
    getUser();
  }, [uid]);

  return user;
}
