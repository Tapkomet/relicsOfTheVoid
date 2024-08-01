import AdvancementFlow from "./advancement-flow.mjs";

/**
 * Inline application that displays size advancement.
 */
export default class SizeFlow extends AdvancementFlow {

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      template: "systems/rotv/templates/advancement/size-flow.hbs"
    });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  getData() {
    const sizes = this.advancement.configuration.sizes;
    return foundry.utils.mergeObject(super.getData(), {
      singleSize: sizes.size === 1 ? sizes.first() : null,
      hint: this.advancement.hint || this.advancement.automaticHint,
      selectedSize: this.retainedData?.size ?? this.advancement.value.size,
      sizes: Array.from(sizes).reduce((obj, key) => {
        obj[key] = CONFIG.ROTV.actorSizes[key].label;
        return obj;
      }, {})
    });
  }
}
