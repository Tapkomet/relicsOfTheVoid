const { HTMLField, StringField } = foundry.data.fields;

/**
 * Data definition for Rule journal entry pages.
 *
 * @property {string} tooltip  Content to display in tooltip in place of page's text content.
 * @property {string} type     Type of rule represented. Should match an entry defined in `CONFIG.ROTV.ruleTypes`.
 */
export default class RuleJournalPageData extends foundry.abstract.DataModel {

  /** @inheritDoc */
  static defineSchema() {
    return {
      tooltip: new HTMLField({label: "ROTV.Rule.Tooltip"}),
      type: new StringField({blank: false, initial: "rule", label: "ROTV.Rule.Type.Label"})
    };
  }

  /* -------------------------------------------- */

  /**
   * Render a rich tooltip for this page.
   * @param {EnrichmentOptions} [enrichmentOptions={}]  Options for text enrichment.
   * @returns {{content: string, classes: string[]}}
   */
  async richTooltip(enrichmentOptions={}) {
    const context = {
      page: this.parent,
      type: CONFIG.ROTV.ruleTypes[this.type].label,
      content: await TextEditor.enrichHTML(this.tooltip || this.parent.text.content, {
        secrets: false, async: true, relativeTo: this.parent, ...enrichmentOptions
      })
    };
    return {
      content: await renderTemplate("systems/rotv/templates/journal/page-rule-tooltip.hbs", context),
      classes: ["rotv-tooltip", "rule-tooltip"]
    };
  }
}
