import { sqlSelectAllFromTable, sqlSelectFromTable } from "sqlRequests/basicRequests";
import { User } from "../../../common/types/users";

export const getUser = async (
  id_user: number,
  type_user: number,
  useBaseLocale: boolean,
): Promise<User | null> => {
  // console.log(`getConseillerByUserLogin, user_login = ${user_login}`);

  const retGetUser = await sqlSelectAllFromTable(
    'user',
    [{ column: 'id', value: id_user }],
    useBaseLocale,
  );

  if (!retGetUser || retGetUser.length !== 1) {
    return null;
  }

  const user: User = {
    ...retGetUser[0],
    id_user,
    type_user,
  } as User;
  // conseiller.id = conseiller.id_user;
  // delete conseiller.id_user;
  return user;
}
