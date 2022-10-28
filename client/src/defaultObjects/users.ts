import { User } from "../../../common/types/users";
import { TYPE_USER_PUBLIC } from "../utils/clientCommServerConstants";

export const userDefault: User = {
  id_user: -1,
  login: '',
  email_address: '',

  civilite: 1,
  nom: '',
  prenom: '',
  type_user: TYPE_USER_PUBLIC,
}
