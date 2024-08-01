import SystemDataModel from "../../abstract.mjs";

const { BooleanField, StringField } = foundry.data.fields;

/**
 * Data model template with information on items that can be attuned and equipped.
 *
 * @property {string} attunement  Attunement information as defined in `ROTV.attunementTypes`.
 * @property {boolean} attuned    Is this item attuned on its owning actor?
 * @property {boolean} equipped   Is this item equipped on its owning actor?
 * @mixin
 */
export default class EquippableItemTemplate extends SystemDataModel {
  /** @inheritdoc */
  static defineSchema() {
    return {
      attunement: new StringField({required: true, label: "ROTV.Attunement"}),
      attuned: new BooleanField({label: "ROTV.Attuned"}),
      equipped: new BooleanField({required: true, label: "ROTV.Equipped"})
    };
  }

  /* -------------------------------------------- */

  /**
   * Create attunement filter configuration.
   * @returns {CompendiumBrowserFilterDefinitionEntry}
   */
  static get compendiumBrowserAttunementFilter() {
    return {
      label: "ROTV.Attunement",
      type: "boolean",
      createFilter: (filters, value, def) => {
        if ( value === 0 ) return;
        const filter = { k: "system.attunement", o: "in", v: ["required", 1] };
        if ( value === 1 ) filters.push(filter);
        else filters.push({ o: "NOT", v: filter });
      }
    };
  }

  /* -------------------------------------------- */
  /*  Data Migrations                             */
  /* -------------------------------------------- */

  /** @inheritdoc */
  static _migrateData(source) {
    super._migrateData(source);
    EquippableItemTemplate.#migrateAttunement(source);
    EquippableItemTemplate.#migrateEquipped(source);
  }

  /* -------------------------------------------- */

  /**
   * Migrate the item's attuned boolean to attunement string.
   * @param {object} source  The candidate source data from which the model will be constructed.
   */
  static #migrateAttunement(source) {
    switch ( source.attunement ) {
      case 2: source.attuned = true;
      case 1: source.attunement = "required"; break;
      case 0: source.attunement = ""; break;
    }
  }

  /* -------------------------------------------- */

  /**
   * Migrate the equipped field.
   * @param {object} source  The candidate source data from which the model will be constructed.
   */
  static #migrateEquipped(source) {
    if ( !("equipped" in source) ) return;
    if ( (source.equipped === null) || (source.equipped === undefined) ) source.equipped = false;
  }

  /* -------------------------------------------- */
  /*  Data Preparation                            */
  /* -------------------------------------------- */

  /**
   * Ensure items that cannot be attuned are not marked as attuned.
   */
  prepareFinalEquippableData() {
    if ( !this.attunement ) this.attuned = false;
  }

  /* -------------------------------------------- */
  /*  Properties                                  */
  /* -------------------------------------------- */

  /**
   * Chat properties for equippable items.
   * @type {string[]}
   */
  get equippableItemCardProperties() {
    return [
      this.attunement === "required" ? CONFIG.ROTV.attunementTypes.required : null,
      game.i18n.localize(this.equipped ? "ROTV.Equipped" : "ROTV.Unequipped"),
      ("proficient" in this) ? CONFIG.ROTV.proficiencyLevels[this.prof?.multiplier || 0] : null
    ];
  }

  /* -------------------------------------------- */

  /**
   * Are the magical properties of this item, such as magical bonuses to armor & damage, available?
   * @type {boolean}
   */
  get magicAvailable() {
    const attunement = this.attuned || (this.attunement !== "required");
    return attunement && this.properties.has("mgc") && this.validProperties.has("mgc");
  }
}
