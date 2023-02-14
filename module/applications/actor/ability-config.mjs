import BaseConfigSheet from "./base-config.mjs";

/**
 * A simple form to set save throw configuration for a given ability score.
 *
 * @param {ActorRelics} actor               The Actor instance being displayed within the sheet.
 * @param {ApplicationOptions} options  Additional application configuration options.
 * @param {string} abilityId            The ability key as defined in CONFIG.ROTV.abilities.
 */
export default class ActorAbilityConfig extends BaseConfigSheet {
  constructor(actor, options, abilityId) {
    super(actor, options);
    this._abilityId = abilityId;
  }

  /* -------------------------------------------- */

  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["rotv"],
      template: "systems/rotv/templates/apps/ability-config.hbs",
      width: 500,
      height: "auto"
    });
  }

  /* -------------------------------------------- */

  /** @override */
  get title() {
    return `${game.i18n.format("ROTV.AbilityConfigureTitle", {ability: CONFIG.ROTV.abilities[this._abilityId]})}: ${this.document.name}`;
  }

  /* -------------------------------------------- */

  /** @override */
  getData(options) {
    const src = this.document.toObject();
    return {
      ability: src.system.abilities[this._abilityId] ?? this.document.system.abilities[this._abilityId] ?? {},
      labelSaves: game.i18n.format("ROTV.AbilitySaveConfigure", {ability: CONFIG.ROTV.abilities[this._abilityId]}),
      labelChecks: game.i18n.format("ROTV.AbilityCheckConfigure", {ability: CONFIG.ROTV.abilities[this._abilityId]}),
      abilityId: this._abilityId,
      proficiencyLevels: {
        0: CONFIG.ROTV.proficiencyLevels[0],
        1: CONFIG.ROTV.proficiencyLevels[1]
      },
      bonusGlobalSave: src.system.bonuses?.abilities?.save,
      bonusGlobalCheck: src.system.bonuses?.abilities?.check
    };
  }
}
