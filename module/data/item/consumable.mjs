import SystemDataModel from "../abstract.mjs";
import { MappingField } from "../fields.mjs";
import ActionTemplate from "./templates/action.mjs";
import ActivatedEffectTemplate from "./templates/activated-effect.mjs";
import EquippableItemTemplate from "./templates/equippable-item.mjs";
import ItemDescriptionTemplate from "./templates/item-description.mjs";
import PhysicalItemTemplate from "./templates/physical-item.mjs";

/**
 * Data definition for Consumable items.
 * @mixes ItemDescriptionTemplate
 * @mixes PhysicalItemTemplate
 * @mixes EquippableItemTemplate
 * @mixes ActivatedEffectTemplate
 * @mixes ActionTemplate
 *
 * @property {string} consumableType     Type of consumable as defined in `ROTV.consumableTypes`.
 * @property {object} uses
 * @property {object} properties   Mapping of various weapon property booleans.
 * @property {boolean} uses.autoDestroy  Should this item be destroyed when it runs out of uses.
 * @property {boolean} proficient  Does the weapon's owner have proficiency?
 */
export default class ConsumableData extends SystemDataModel.mixin(
  ItemDescriptionTemplate, PhysicalItemTemplate, EquippableItemTemplate, ActivatedEffectTemplate, ActionTemplate
) {
  /** @inheritdoc */
  static defineSchema() {
    return this.mergeSchema(super.defineSchema(), {
      consumableType: new foundry.data.fields.StringField({
        required: true, initial: "potion", label: "ROTV.ItemConsumableType"
      }),
      properties: new MappingField(new foundry.data.fields.BooleanField(), {
        required: true, initialKeys: CONFIG.ROTV.weaponProperties, label: "ROTV.ItemWeaponProperties"
      }),
      uses: new ActivatedEffectTemplate.ItemUsesField({
        autoDestroy: new foundry.data.fields.BooleanField({required: true, label: "ROTV.ItemDestroyEmpty"})
      }, {label: "ROTV.LimitedUses"}),
      proficient: new foundry.data.fields.BooleanField({required: true, initial: true, label: "ROTV.Proficient"})
    });
  }
}
