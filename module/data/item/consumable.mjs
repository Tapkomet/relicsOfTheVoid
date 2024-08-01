import { filteredKeys } from "../../utils.mjs";
import { ItemDataModel } from "../abstract.mjs";
import UsesField from "../shared/uses-field.mjs";
import ActionTemplate from "./templates/action.mjs";
import ActivatedEffectTemplate from "./templates/activated-effect.mjs";
import ActivitiesTemplate from "./templates/activities.mjs";
import EquippableItemTemplate from "./templates/equippable-item.mjs";
import IdentifiableTemplate from "./templates/identifiable.mjs";
import ItemDescriptionTemplate from "./templates/item-description.mjs";
import ItemTypeTemplate from "./templates/item-type.mjs";
import PhysicalItemTemplate from "./templates/physical-item.mjs";
import ItemTypeField from "./fields/item-type-field.mjs";

const { BooleanField, NumberField, SetField, StringField } = foundry.data.fields;

/**
 * Data definition for Consumable items.
 * @mixes ItemDescriptionTemplate
 * @mixes ItemTypeTemplate
 * @mixes IdentifiableTemplate
 * @mixes PhysicalItemTemplate
 * @mixes EquippableItemTemplate
 * @mixes ActivatedEffectTemplate
 * @mixes ActionTemplate
 * @mixes ActivitiesTemplate
 *
 * @property {number} magicalBonus       Magical bonus added to attack & damage rolls by ammunition.
 * @property {Set<string>} properties    Ammunition properties.
 * @property {object} uses
 * @property {boolean} uses.autoDestroy  Should this item be destroyed when it runs out of uses.
 * @property {number} proficient          Does the owner have proficiency in this piece of equipment?
 */
export default class ConsumableData extends ItemDataModel.mixin(
  ItemDescriptionTemplate, IdentifiableTemplate, ItemTypeTemplate, PhysicalItemTemplate, EquippableItemTemplate,
  ActivatedEffectTemplate, ActionTemplate, ActivitiesTemplate
) {
  /** @inheritdoc */
  static defineSchema() {
    return this.mergeSchema(super.defineSchema(), {
      type: new ItemTypeField({value: "potion", baseItem: false}, {label: "ROTV.ItemConsumableType"}),
      magicalBonus: new NumberField({min: 0, integer: true, label: "ROTV.MagicalBonus"}),
      properties: new SetField(new StringField(), { label: "ROTV.ItemAmmoProperties" }),
      uses: new UsesField({
        autoDestroy: new BooleanField({required: true, label: "ROTV.ItemDestroyEmpty"})
      }),
      proficient: new NumberField({
        required: true, min: 0, max: 1, integer: true, initial: true, label: "ROTV.ProficiencyLevel"
      })
    });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  static metadata = Object.freeze(foundry.utils.mergeObject(super.metadata, {
    enchantable: true,
    inventoryItem: true,
    inventoryOrder: 300
  }, {inplace: false}));

  /* -------------------------------------------- */

  /** @override */
  static get compendiumBrowserFilters() {
    return new Map([
      ["type", {
        label: "ROTV.ItemConsumableType",
        type: "set",
        config: {
          choices: CONFIG.ROTV.consumableTypes,
          keyPath: "system.type.value"
        }
      }],
      ["attunement", this.compendiumBrowserAttunementFilter],
      ...this.compendiumBrowserPhysicalItemFilters,
      ["properties", this.compendiumBrowserPropertiesFilter("consumable")]
    ]);
  }

  /* -------------------------------------------- */
  /*  Data Migrations                             */
  /* -------------------------------------------- */

  /** @inheritdoc */
  static _migrateData(source) {
    super._migrateData(source);
    ActivitiesTemplate.migrateActivities(source);
    ConsumableData.#migratePropertiesData(source);
  }

  /* -------------------------------------------- */

  /**
   * Migrate the properties object into a set.
   * @param {object} source  The candidate source data from which the model will be constructed.
   */
  static #migratePropertiesData(source) {
    if ( foundry.utils.getType(source.properties) !== "Object" ) return;
    source.properties = filteredKeys(source.properties);
  }

  /* -------------------------------------------- */
  /*  Data Preparation                            */
  /* -------------------------------------------- */

  /** @inheritDoc */
  prepareDerivedData() {
    super.prepareDerivedData();
    if ( !this.type.value ) return;
    const config = CONFIG.ROTV.consumableTypes[this.type.value];
    if ( config ) {
      this.type.label = config.subtypes?.[this.type.subtype] ?? config.label;
    } else {
      this.type.label = game.i18n.localize(CONFIG.Item.typeLabels.consumable);
    }
  }

  /* -------------------------------------------- */

  /** @inheritDoc */
  prepareFinalData() {
    this.prepareFinalActivatedEffectData();
    this.prepareFinalActivityData(this.parent.getRollData({ deterministic: true }));
    this.prepareFinalEquippableData();
  }

  /* -------------------------------------------- */

  /** @inheritDoc */
  async getFavoriteData() {
    return foundry.utils.mergeObject(await super.getFavoriteData(), {
      subtitle: [this.type.label, this.parent.labels.activation],
      uses: this.hasLimitedUses ? this.getUsesData() : null,
      quantity: this.quantity
    });
  }

  /* -------------------------------------------- */
  /*  Getters                                     */
  /* -------------------------------------------- */

  /**
   * Properties displayed in chat.
   * @type {string[]}
   */
  get chatProperties() {
    return [
      this.type.label,
      this.hasLimitedUses ? `${this.uses.value}/${this.uses.max} ${game.i18n.localize("ROTV.Charges")}` : null,
      this.priceLabel
    ];
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  get _typeAbilityMod() {
    if ( this.type.value !== "scroll" ) return null;
    return this.parent?.actor?.system.attributes.spellcasting || "int";
  }

  /* -------------------------------------------- */

  /**
   * The proficiency multiplier for this item.
   * @returns {number}
   */
  get proficiencyMultiplier() {
    const isProficient = this.parent?.actor?.getFlag("rotv", "tavernBrawlerFeat");
    return isProficient ? 1 : 0;
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  get validProperties() {
    const valid = super.validProperties;
    if ( this.type.value === "ammo" ) Object.entries(CONFIG.ROTV.itemProperties).forEach(([k, v]) => {
      if ( v.isPhysical ) valid.add(k);
    });
    else if ( this.type.value === "scroll" ) CONFIG.ROTV.validProperties.spell
      .filter(p => p !== "material").forEach(p => valid.add(p));
    return valid;
  }
}
