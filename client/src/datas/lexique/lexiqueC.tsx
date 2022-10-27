/* eslint max-len: 0 */
import React from "react";
import { GlossaryWord } from "../../classes/classeLexique";

export const defCitoyenFrancais = new GlossaryWord(
  `Citoyen français`,
  `Détenteur de la nationalité française exerçant ses droits civiques. Ce n’est pas le cas de tous les français (mineurs, personnes sous tutelle, interdiction judiciaire, multinationaux ayant fait le choix de les exercer dans un de leurs autres pays, …).`,
  undefined,
  [`Citoyens français`],
  false,
);
export const defCoercition = new GlossaryWord(
  `Coercition`,
  `Action de contraindre. L’État a cette possibilité de contrainte grâce aux forces de l’ordre armées. L’usage de cette force est dit “légitime” car il est au service d’un état censé représenter loyalement la société parce qu’il a été élu selon les règles établies par la Constitution actuelle.`,
);
export const defConstituant = new GlossaryWord(
  `Constituant(e)`,
  <><p>
      {`Adjectif : caractérise les citoyens qui écrivent la Constitution au nom du peuple par le peuple.`}
  </p><p>
      {`Participe présent du verbe constituer. On résume parfois par “constituante” une assemblée constituante, c'est-à-dire une assemblée de constituants.`}
  </p></>,
  `Constituant`,
  undefined,
  true,
  true,
);
