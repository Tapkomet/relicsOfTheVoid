/**
 * Data model template with information on physical items.
 *
 * @property {number} quantity            Number of items in a stack.
 * @property {number} weight              Item's weight in pounds or kilograms (depending on system setting).
 * @property {object} price
 * @property {number} price.value         Item's cost in the specified denomination.
 * @property {string} price.denomination  Currency denomination used to determine price.
 * @property {string} rarity              Item rarity as defined in `ROTV.itemRarity`.
 * @property {boolean} identified         Has this item been identified?
 * @mixin
 */
export default class PhysicalItemTemplate extends foundry.abstract.DataModel {
  /** @inheritdoc */
  static defineSchema() {
    return {
      quantity: new foundry.data.fields.NumberField({
        required: true, nullable: false, integer: true, initial: 1, min: 0, label: "ROTV.Quantity"
      }),
      weight: new foundry.data.fields.NumberField({
        required: true, nullable: false, initial: 0, min: 0, label: "ROTV.Weight"
      }),
      price: new foundry.data.fields.SchemaField({
        value: new foundry.data.fields.NumberField({
          required: true, nullable: false, initial: 0, min: 0, label: "ROTV.Price"
        }),
        denomination: new foundry.data.fields.StringField({
          required: true, blank: false, initial: "cr", label: "ROTV.Currency"
        })
      }, {label: "ROTV.Price"}),
      rarity: new foundry.data.fields.StringField({required: true, blank: true, label: "ROTV.Rarity"}),
      identified: new foundry.data.fields.BooleanField({required: true, initial: true, label: "ROTV.Identified"})
    };
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  static migrateData(source) {
    PhysicalItemTemplate.#migratePrice(source);
    PhysicalItemTemplate.#migrateRarity(source);
    PhysicalItemTemplate.#migrateWeight(source);
  }

  /* -------------------------------------------- */

  /**
   * Migrate the item's price from a single field to an object with currency.
   * @param {object} source  The candidate source data from which the model will be constructed.
   */
  static #migratePrice(source) {
    if ( !("price" in source) || foundry.utils.getType(source.price) === "Object" ) return;
    source.price = {
      value: Number.isNumeric(source.price) ? Number(source.price) : 0,
      denomination: "cr"
    };
  }

  /* -------------------------------------------- */

  /**
   * Migrate the item's rarity from freeform string to enum value.
   * @param {object} source  The candidate source data from which the model will be constructed.
   */
  static #migrateRarity(source) {
    if ( !("rarity" in source) || CONFIG.ROTV.itemRarity[source.rarity] ) return;
    source.rarity = Object.keys(CONFIG.ROTV.itemRarity).find(key =>
      CONFIG.ROTV.itemRarity[key].toLowerCase() === source.rarity.toLowerCase()
    ) ?? "";
  }

  /* -------------------------------------------- */

  /**
   * Convert null weights to 0.
   * @param {object} source  The candidate source data from which the model will be constructed.
   */
  static #migrateWeight(source) {
    if ( !("weight" in source) ) return;
    if ( (source.weight === null) || (source.weight === undefined) ) source.weight = 0;
  }
}
