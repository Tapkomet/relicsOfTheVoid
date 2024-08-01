import BaseConfigSheet from "./base-config.mjs";

/**
 * A sub-application of the ActorSheet used to configure concentration saving throws.
 * @extends {BaseConfigSheet}
 */
export default class ActorConcentrationConfig extends BaseConfigSheet {
  /** @inheritDoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["rotv"],
      template: "systems/rotv/templates/apps/concentration-config.hbs",
      width: 500,
      height: "auto"
    });
  }

  /* -------------------------------------------- */

  /** @override */
  get title() {
    return `${game.i18n.format("ROTV.AbilityConfigure", {
      ability: game.i18n.localize("ROTV.Concentration") })
    }: ${this.document.name}`;
  }

  /* -------------------------------------------- */

  /** @override */
  getData(options={}) {
    const src = this.document.toObject();
    const { ability, bonuses, limit, roll } = src.system.attributes.concentration;
    return {
      ability, limit,
      abilities: CONFIG.ROTV.abilities,
      bonus: bonuses.save,
      mode: roll.mode,
      modes: {
        "-1": "ROTV.Disadvantage",
        0: "ROTV.Normal",
        1: "ROTV.Advantage"
      },
      bonusGlobalSave: src.system.bonuses?.abilities?.save
    };
  }
}
