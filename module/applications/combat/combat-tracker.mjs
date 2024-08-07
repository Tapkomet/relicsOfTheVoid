/**
 * An extension of the base CombatTracker class to provide some RotV-specific functionality.
 * @extends {CombatTracker}
 */
export default class CombatTrackerRotV extends CombatTracker {
  /** @inheritdoc */
  async _onCombatantControl(event) {
    const btn = event.currentTarget;
    const combatantId = btn.closest(".combatant").dataset.combatantId;
    const combatant = this.viewed.combatants.get(combatantId);
    if ( (btn.dataset.control === "rollInitiative") && combatant?.actor ) return combatant.actor.rollInitiativeDialog();
    return super._onCombatantControl(event);
  }
}
