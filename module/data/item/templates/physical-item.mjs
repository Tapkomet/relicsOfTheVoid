import { convertWeight } from "../../../utils.mjs";
import SystemDataModel from "../../abstract.mjs";

/**
 * Data model template with information on physical items.
 *
 * @property {string} container           Container within which this item is located.
 * @property {number} quantity            Number of items in a stack.
 * @property {object} weight
 * @property {number} weight.value        Item's weight.
 * @property {string} weight.units        Units used to measure the weight.
 * @property {object} price
 * @property {number} price.value         Item's cost in the specified denomination.
 * @property {string} price.denomination  Currency denomination used to determine price.
 * @property {string} rarity              Item rarity as defined in `ROTV.itemRarity`.
 * @mixin
 */
export default class PhysicalItemTemplate extends SystemDataModel {
  /** @inheritdoc */
  static defineSchema() {
    return {
      container: new foundry.data.fields.ForeignDocumentField(foundry.documents.BaseItem, {
        idOnly: true, label: "ROTV.Container"
      }),
      quantity: new foundry.data.fields.NumberField({
        required: true, nullable: false, integer: true, initial: 1, min: 0, label: "ROTV.Quantity"
      }),
      weight: new foundry.data.fields.SchemaField({
        value: new foundry.data.fields.NumberField({
          required: true, nullable: false, initial: 0, min: 0, label: "ROTV.Weight"
        }),
        units: new foundry.data.fields.StringField({
          required: true, label: "ROTV.WeightUnit.Label",
          initial: () => game.settings.get("rotv", "metricWeightUnits") ? "kg" : "lb"
        })
      }, {label: "ROTV.Weight"}),
      price: new foundry.data.fields.SchemaField({
        value: new foundry.data.fields.NumberField({
          required: true, nullable: false, initial: 0, min: 0, label: "ROTV.Price"
        }),
        denomination: new foundry.data.fields.StringField({
          required: true, blank: false, initial: "gp", label: "ROTV.Currency"
        })
      }, {label: "ROTV.Price"}),
      rarity: new foundry.data.fields.StringField({required: true, blank: true, label: "ROTV.Rarity"})
    };
  }

  /* -------------------------------------------- */

  /**
   * Maximum depth items can be nested in containers.
   * @type {number}
   */
  static MAX_DEPTH = 5;

  /* -------------------------------------------- */

  /**
   * Create filter configurations shared by all physical items.
   * @returns {[string, CompendiumBrowserFilterDefinitionEntry][]}
   */
  static get compendiumBrowserPhysicalItemFilters() {
    return [
      ["price", {
        label: "ROTV.Price",
        type: "range",
        config: {
          keyPath: "system.price.value"
        }
      }],
      ["rarity", {
        label: "ROTV.Rarity",
        type: "set",
        config: {
          blank: game.i18n.localize("ROTV.ItemRarityMundane").capitalize(),
          choices: Object.entries(CONFIG.ROTV.itemRarity).reduce((obj, [key, label]) => {
            obj[key] = { label: label.capitalize() };
            return obj;
          }, {}),
          keyPath: "system.rarity"
        }
      }]
    ];
  }

  /* -------------------------------------------- */
  /*  Getters                                     */
  /* -------------------------------------------- */

  /**
   * Get a human-readable label for the price and denomination.
   * @type {string}
   */
  get priceLabel() {
    const { value, denomination } = this.price;
    const hasPrice = value && (denomination in CONFIG.ROTV.currencies);
    return hasPrice ? `${value} ${CONFIG.ROTV.currencies[denomination].label}` : null;
  }

  /* -------------------------------------------- */

  /**
   * The weight of all of the items in an item stack.
   * @type {number}
   */
  get totalWeight() {
    return this.quantity * this.weight.value;
  }

  /* -------------------------------------------- */
  /*  Migrations                                  */
  /* -------------------------------------------- */

  /** @inheritdoc */
  static _migrateData(source) {
    super._migrateData(source);
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
      denomination: "gp"
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
   * Migrate the item's weight from a single field to an object with units & convert null weights to 0.
   * @param {object} source  The candidate source data from which the model will be constructed.
   */
  static #migrateWeight(source) {
    if ( !("weight" in source) || (foundry.utils.getType(source.weight) === "Object") ) return;
    source.weight = {
      value: Number.isNumeric(source.weight) ? Number(source.weight) : 0,
      units: game.settings.get("rotv", "metricWeightUnits") ? "kg" : "lb"
    };
  }

  /* -------------------------------------------- */
  /*  Socket Event Handlers                       */
  /* -------------------------------------------- */

  /**
   * Trigger a render on all sheets for items within which this item is contained.
   * @param {object} [options={}]
   * @param {object} [options.rendering]        Additional rendering options.
   * @param {string} [options.formerContainer]  UUID of the former container if this item was moved.
   * @protected
   */
  async _renderContainers({ formerContainer, ...rendering }={}) {
    // Render this item's container & any containers it is within
    const parentContainers = await this.allContainers();
    parentContainers.forEach(c => c.sheet?.render(false, rendering));

    // Render the actor sheet, compendium, or sidebar
    if ( this.parent.isEmbedded ) this.parent.actor.sheet?.render(false, rendering);
    else if ( this.parent.pack ) game.packs.get(this.parent.pack).apps.forEach(a => a.render(false, rendering));
    else ui.sidebar.tabs.items.render(false, rendering);

    // Render former container if it was moved between containers
    if ( formerContainer ) {
      const former = await fromUuid(formerContainer);
      former.render(false, rendering);
      former.system._renderContainers(rendering);
    }
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  _onCreate(data, options, userId) {
    this._renderContainers();
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  _onUpdate(changed, options, userId) {
    this._renderContainers({ formerContainer: options.formerContainer });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  _onDelete(options, userId) {
    this._renderContainers();
  }

  /* -------------------------------------------- */
  /*  Helper Methods                              */
  /* -------------------------------------------- */

  /**
   * All of the containers this item is within up to the parent actor or collection.
   * @returns {Promise<ItemRotV[]>}
   */
  async allContainers() {
    let item = this.parent;
    let container;
    let depth = 0;
    const containers = [];
    while ( (container = await item.container) && (depth < PhysicalItemTemplate.MAX_DEPTH) ) {
      containers.push(container);
      item = container;
      depth++;
    }
    return containers;
  }

  /* -------------------------------------------- */

  /**
   * Calculate the total weight and return it in specific units.
   * @param {string} units  Units in which the weight should be returned.
   * @returns {number|Promise<number>}
   */
  totalWeightIn(units) {
    const weight = this.totalWeight;
    if ( weight instanceof Promise ) return weight.then(w => convertWeight(w, this.weight.units, units));
    return convertWeight(weight, this.weight.units, units);
  }
}
