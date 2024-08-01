import BaseActivityData from "../../data/activity/base-activity.mjs";
import ActivityMixin from "./mixin.mjs";

export default class UtilityActivity extends ActivityMixin(BaseActivityData) {
  static metadata = Object.freeze(
    foundry.utils.mergeObject(super.metadata, {
      type: "utility",
      img: "systems/rotv/icons/svg/activity/utility.svg",
      title: "ROTV.ACTIVITY.Utility.Title"
    }, { inplace: false })
  );
}
