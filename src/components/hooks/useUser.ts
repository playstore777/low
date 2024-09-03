import { useCallback, useEffect, useState } from "react";

import { getUserById } from "../../server/services";
import { User } from "../../types/types";

export default function useUser(uid: string) {
  const [user, setUser] = useState<Partial<User> | null>(null);

  const getUser = useCallback(async () => {
    const res = await getUserById(uid);
    setUser(res);
  }, [uid]);

  useEffect(() => {
    getUser();
  }, []);

  console.log("user: ", user);
  return user;
}
