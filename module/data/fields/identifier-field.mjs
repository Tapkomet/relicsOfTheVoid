/**
 * Special case StringField that includes automatic validation for identifiers.
 */
export default class IdentifierField extends foundry.data.fields.StringField {
  /** @override */
  _validateType(value) {
    if ( !rotv.utils.validators.isValidIdentifier(value) ) {
      throw new Error(game.i18n.localize("ROTV.IdentifierError"));
    }
  }
}