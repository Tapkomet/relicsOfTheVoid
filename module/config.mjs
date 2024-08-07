import MapLocationControlIcon from "./canvas/map-location-control-icon.mjs";
import * as advancement from "./documents/advancement/_module.mjs";
import { preLocalize } from "./utils.mjs";

// Namespace Configuration Values
const ROTV = {};

// ASCII Artwork
ROTV.ASCII = `_______________________________
______      ______ _____ _____
|  _  \\___  |  _  \\  ___|  ___|
| | | ( _ ) | | | |___ \\| |__
| | | / _ \\/\\ | | |   \\ \\  __|
| |/ / (_>  < |/ //\\__/ / |___
|___/ \\___/\\/___/ \\____/\\____/
_______________________________`;

/**
 * Configuration data for abilities.
 *
 * @typedef {object} AbilityConfiguration
 * @property {string} label                               Localized label.
 * @property {string} abbreviation                        Localized abbreviation.
 * @property {string} fullKey                             Fully written key used as alternate for enrichers.
 * @property {string} [reference]                         Reference to a rule page describing this ability.
 * @property {string} [type]                              Whether this is a "physical" or "mental" ability.
 * @property {Object<string, number|string>}  [defaults]  Default values for this ability based on actor type.
 *                                                        If a string is used, the system will attempt to fetch.
 *                                                        the value of the specified ability.
 * @property {string} [icon]                              An SVG icon that represents the ability.
 */

/**
 * The set of Ability Scores used within the system.
 * @enum {AbilityConfiguration}
 */
ROTV.abilities = {
  str: {
    label: "ROTV.AbilityStr",
    abbreviation: "ROTV.AbilityStrAbbr",
    type: "physical",
    fullKey: "strength",
    reference: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.nUPv6C66Ur64BIUH",
    icon: "systems/rotv/icons/svg/abilities/strength.svg"
  },
  dex: {
    label: "ROTV.AbilityDex",
    abbreviation: "ROTV.AbilityDexAbbr",
    type: "physical",
    fullKey: "dexterity",
    reference: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.ER8CKDUWLsFXuARJ",
    icon: "systems/rotv/icons/svg/abilities/dexterity.svg"
  },
  con: {
    label: "ROTV.AbilityCon",
    abbreviation: "ROTV.AbilityConAbbr",
    type: "physical",
    fullKey: "constitution",
    reference: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.MpA4jnwD17Q0RPg7",
    icon: "systems/rotv/icons/svg/abilities/constitution.svg"
  },
  int: {
    label: "ROTV.AbilityInt",
    abbreviation: "ROTV.AbilityIntAbbr",
    type: "mental",
    fullKey: "intelligence",
    reference: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.WzWWcTIppki35YvF",
    icon: "systems/rotv/icons/svg/abilities/intelligence.svg",
    defaults: { vehicle: 0 }
  },
  wis: {
    label: "ROTV.AbilityWis",
    abbreviation: "ROTV.AbilityWisAbbr",
    type: "mental",
    fullKey: "wisdom",
    reference: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.v3IPyTtqvXqN934s",
    icon: "systems/rotv/icons/svg/abilities/wisdom.svg",
    defaults: { vehicle: 0 }
  },
  cha: {
    label: "ROTV.AbilityCha",
    abbreviation: "ROTV.AbilityChaAbbr",
    type: "mental",
    fullKey: "charisma",
    reference: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.9FyghudYFV5QJOuG",
    icon: "systems/rotv/icons/svg/abilities/charisma.svg",
    defaults: { vehicle: 0 }
  }
};
preLocalize("abilities", { keys: ["label", "abbreviation"] });

/**
 * Configure which ability score is used as the default modifier for initiative rolls,
 * when calculating hit points per level and hit dice, and as the default modifier for
 * saving throws to maintain concentration.
 * @enum {string}
 */
ROTV.defaultAbilities = {
  initiative: "dex",
  hitPoints: "str",
  concentration: "con"
};

Object.defineProperties(ROTV, {
  hitPointsAbility: {
    get: function() {
      foundry.utils.logCompatibilityWarning(
        "ROTV.hitPointsAbility has been deprecated and is now accessible through ROTV.defaultAbilities.hitPoints.",
        { since: "RotV 3.1", until: "RotV 3.3" }
      );
      return ROTV.defaultAbilities.hitPoints;
    },
    set: function(value) {
      foundry.utils.logCompatibilityWarning(
        "ROTV.hitPointsAbility has been deprecated and is now accessible through ROTV.defaultAbilities.hitPoints.",
        { since: "RotV 3.1", until: "RotV 3.3" }
      );
      ROTV.defaultAbilities.hitPoints = value;
    }
  },
  initiativeAbility: {
    get: function() {
      foundry.utils.logCompatibilityWarning(
        "ROTV.initiativeAbility has been deprecated and is now accessible through ROTV.defaultAbilities.initiative.",
        { since: "RotV 3.1", until: "RotV 3.3" }
      );
      return ROTV.defaultAbilities.initiative;
    },
    set: function(value) {
      foundry.utils.logCompatibilityWarning(
        "ROTV.initiativeAbility has been deprecated and is now accessible through ROTV.defaultAbilities.initiative.",
        { since: "RotV 3.1", until: "RotV 3.3" }
      );
      ROTV.defaultAbilities.initiative = value;
    }
  }
});

/* -------------------------------------------- */

/**
 * Configuration data for skills.
 *
 * @typedef {object} SkillConfiguration
 * @property {string} label        Localized label.
 * @property {string} ability      Key for the default ability used by this skill.
 * @property {string} fullKey      Fully written key used as alternate for enrichers.
 * @property {string} [reference]  Reference to a rule page describing this skill.
 */

/**
 * The set of skill which can be trained with their default ability scores.
 * @enum {SkillConfiguration}
 */
ROTV.skills = {
  dec: {
    label: "ROTV.SkillDec",
    ability: "cha",
    fullKey: "deception",
    reference: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.mqVZ2fz0L7a9VeKJ",
    icon: "icons/magic/control/mouth-smile-deception-purple.webp"
  },
  env: {
    label: "ROTV.SkillEnv",
    ability: "int",
    fullKey: "environment",
    reference: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.ueMx3uF2PQlcye31",
    icon: "icons/magic/nature/plant-sprout-snow-green.webp"
  },
  han: {
    label: "ROTV.SkillHan",
    ability: "dex",
    fullKey: "handiness",
    reference: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.yg6SRpGNVz9nDW0A",
    icon: "icons/sundries/gaming/playing-cards.webp"
  },
  ins: {
    label: "ROTV.SkillIns",
    ability: "wis",
    fullKey: "insight",
    reference: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.8R5SMbAGbECNgO8z",
    icon: "icons/magic/perception/orb-crystal-ball-scrying-blue.webp"
  },
  itm: {
    label: "ROTV.SkillItm",
    ability: "cha",
    fullKey: "intimidation",
    reference: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.4VHHI2gJ1jEsppfg",
    icon: "icons/skills/social/intimidation-impressing.webp"
  },
  med: {
    label: "ROTV.SkillMed",
    ability: "int",
    fullKey: "medicine",
    reference: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.GeYmM7BVfSCAga4o",
    icon: "icons/tools/cooking/mortar-herbs-yellow.webp"
  },
  org: {
    label: "ROTV.SkillOrg",
    ability: "int",
    fullKey: "organization",
    reference: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.4R5H8iIsdFQTsj3X",
    icon: "icons/skills/social/diplomacy-handshake.webp"
  },
  prc: {
    label: "ROTV.SkillPrc",
    ability: "wis",
    fullKey: "perception",
    reference: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.zjEeHCUqfuprfzhY",
    icon: "icons/magic/perception/eye-ringed-green.webp"
  },
  per: {
    label: "ROTV.SkillPer",
    ability: "cha",
    fullKey: "persuasion",
    reference: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.4R5H8iIsdFQTsj3X",
    icon: "icons/skills/social/diplomacy-handshake.webp"
  },
  php: {
    label: "ROTV.SkillPhp",
    ability: "str",
    fullKey: "physicalprowess",
    reference: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.rIR7ttYDUpH3tMzv",
    icon: "icons/magic/control/buff-strength-muscle-damage-orange.webp"
  },
  ste: {
    label: "ROTV.SkillSte",
    ability: "dex",
    fullKey: "stealth",
    reference: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.4MfrpERNiQXmvgCI",
    icon: "icons/magic/perception/shadow-stealth-eyes-purple.webp"
  },
  sur: {
    label: "ROTV.SkillSur",
    ability: "wis",
    fullKey: "survival",
    reference: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.t3EzDU5b9BVAIEVi",
    icon: "icons/magic/fire/flame-burning-campfire-yellow-blue.webp"
  },
  tch: {
    label: "ROTV.SkillTch",
    ability: "int",
    fullKey: "technology",
    reference: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.h3bYSPge8IOqne1N",
    icon: "icons/sundries/books/book-embossed-jewel-silver-green.webp"
  }
};
preLocalize("skills", { key: "label", sort: true });

/* -------------------------------------------- */

/**
 * Character alignment options.
 * @enum {string}
 */
ROTV.alignments = {
  lg: "ROTV.AlignmentLG",
  ng: "ROTV.AlignmentNG",
  cg: "ROTV.AlignmentCG",
  ln: "ROTV.AlignmentLN",
  tn: "ROTV.AlignmentTN",
  cn: "ROTV.AlignmentCN",
  le: "ROTV.AlignmentLE",
  ne: "ROTV.AlignmentNE",
  ce: "ROTV.AlignmentCE"
};
preLocalize("alignments");

/* -------------------------------------------- */

/**
 * An enumeration of item attunement types.
 * @enum {string}
 */
ROTV.attunementTypes = {
  required: "ROTV.AttunementRequired",
  optional: "ROTV.AttunementOptional"
};
preLocalize("attunementTypes");

/**
 * An enumeration of item attunement states.
 * @type {{"0": string, "1": string, "2": string}}
 * @deprecated since 3.2, available until 3.4
 */
ROTV.attunements = {
  0: "ROTV.AttunementNone",
  1: "ROTV.AttunementRequired",
  2: "ROTV.AttunementAttuned"
};
preLocalize("attunements");

/* -------------------------------------------- */

/**
 * General weapon categories.
 * @enum {string}
 */
ROTV.weaponProficiencies = {
  sim: "ROTV.WeaponSimpleProficiency",
  mar: "ROTV.WeaponMartialProficiency",
  ass: "ROTV.WeaponAssaultProficiency",
  pis: "ROTV.WeaponPistolProficiency",
  sho: "ROTV.WeaponShotgunProficiency",
  smg: "ROTV.WeaponSMGProficiency",
  lmg: "ROTV.WeaponLMGProficiency",
  sni: "ROTV.WeaponSniperProficiency",
  gre: "ROTV.WeaponGrenadeProficiency",
  gla: "ROTV.WeaponGrenadeLauncherProficiency",
  rla: "ROTV.WeaponRocketLauncherProficiency",
  fla: "ROTV.WeaponFlamethrowerProficiency",
  shi: "ROTV.WeaponShieldProficiency",
  lca: "ROTV.WeaponCannonProficiency"
};
preLocalize("weaponProficiencies");

/**
 * A mapping between `ROTV.weaponTypes` and `ROTV.weaponProficiencies` that
 * is used to determine if character has proficiency when adding an item.
 * @enum {(boolean|string)}
 */
ROTV.weaponProficienciesMap = {
    natural: true,
    improvised: true,
    simpleM: "sim",
    martialM: "mar",
    assault: "ass",
    pistol: "pis",
    shotgun: "sho",
    smg: "smg",
    lmg: "lmg",
    sniper: "sni",
    grenade: "gre",
    grenadeL: "gla",
    rocketL: "rla",
    flamethrower: "fla",
    shield: "shi",
    lightC: "lca"
};

/**
 * The basic weapon types in RotV. This enables specific weapon proficiencies or
 * starting equipment provided by classes and backgrounds.
 * @enum {string}
 */
ROTV.weaponIds = {
};

/* -------------------------------------------- */

/**
 * The basic ammunition types.
 * @enum {string}
 */
ROTV.ammoIds = {
};

/* -------------------------------------------- */

/**
 * The categories into which Tool items can be grouped.
 *
 * @enum {string}
 */
ROTV.toolTypes = {
};
preLocalize("toolTypes", { sort: true });

/**
 * The categories of tool proficiencies that a character can gain.
 *
 * @enum {string}
 */
ROTV.toolProficiencies = {
  ...ROTV.toolTypes,
  vehicle: "ROTV.ToolVehicle"
};
preLocalize("toolProficiencies", { sort: true });

/**
 * The basic tool types in RotV. This enables specific tool proficiencies or
 * starting equipment provided by classes and backgrounds.
 * @enum {string}
 */
ROTV.toolIds = {
};

/* -------------------------------------------- */

/**
 * Time periods that accept a numeric value.
 * @enum {string}
 */
ROTV.scalarTimePeriods = {
  turn: "ROTV.TimeTurn",
  round: "ROTV.TimeRound",
  minute: "ROTV.TimeMinute",
  hour: "ROTV.TimeHour",
  day: "ROTV.TimeDay",
  month: "ROTV.TimeMonth",
  year: "ROTV.TimeYear"
};
preLocalize("scalarTimePeriods");

/* -------------------------------------------- */

/**
 * Time periods for spells that don't have a defined ending.
 * @enum {string}
 */
ROTV.permanentTimePeriods = {
  disp: "ROTV.TimeDisp",
  dstr: "ROTV.TimeDispTrig",
  perm: "ROTV.TimePerm"
};
preLocalize("permanentTimePeriods");

/* -------------------------------------------- */

/**
 * Time periods that don't accept a numeric value.
 * @enum {string}
 */
ROTV.specialTimePeriods = {
  inst: "ROTV.TimeInst",
  spec: "ROTV.Special"
};
preLocalize("specialTimePeriods");

/* -------------------------------------------- */

/**
 * The various lengths of time over which effects can occur.
 * @enum {string}
 */
ROTV.timePeriods = {
  ...ROTV.specialTimePeriods,
  ...ROTV.permanentTimePeriods,
  ...ROTV.scalarTimePeriods
};
preLocalize("timePeriods");

/* -------------------------------------------- */

/**
 * Ways in which to activate an item that cannot be labeled with a cost.
 * @enum {string}
 */
ROTV.staticAbilityActivationTypes = {
  none: "ROTV.NoneActionLabel",
  special: ROTV.timePeriods.spec
};

/**
 * Various ways in which an item or ability can be activated.
 * @enum {string}
 */
ROTV.abilityActivationTypes = {
  ...ROTV.staticAbilityActivationTypes,
  action: "ROTV.Action",
  bonus: "ROTV.BonusAction",
  reaction: "ROTV.Reaction",
  minute: ROTV.timePeriods.minute,
  hour: ROTV.timePeriods.hour,
  day: ROTV.timePeriods.day,
  legendary: "ROTV.LegendaryActionLabel",
  mythic: "ROTV.MythicActionLabel",
  lair: "ROTV.LairActionLabel",
  crew: "ROTV.VehicleCrewAction"
};
preLocalize("abilityActivationTypes");

/* -------------------------------------------- */

/**
 * Different things that an ability can consume upon use.
 * @enum {string}
 */
ROTV.abilityConsumptionTypes = {
  ammo: "ROTV.ConsumeAmmunition",
  attribute: "ROTV.ConsumeAttribute",
  hitDice: "ROTV.ConsumeHitDice",
  material: "ROTV.ConsumeMaterial",
  charges: "ROTV.ConsumeCharges"
};
preLocalize("abilityConsumptionTypes", { sort: true });

/* -------------------------------------------- */

/**
 * Configuration data for actor sizes.
 *
 * @typedef {object} ActorSizeConfiguration
 * @property {string} label                   Localized label.
 * @property {string} abbreviation            Localized abbreviation.
 * @property {number} hitDie                  Default hit die denomination for NPCs of this size.
 * @property {number} [token=1]               Default token size.
 * @property {number} [capacityMultiplier=1]  Multiplier used to calculate carrying capacities.
 */

/**
 * Creature sizes ordered from smallest to largest.
 * @enum {ActorSizeConfiguration}
 */
ROTV.actorSizes = {
  tiny: {
    label: "ROTV.SizeTiny",
    abbreviation: "ROTV.SizeTinyAbbr",
    hitDie: 4,
    token: 0.5,
    capacityMultiplier: 0.5
  },
  sm: {
    label: "ROTV.SizeSmall",
    abbreviation: "ROTV.SizeSmallAbbr",
    hitDie: 6,
    dynamicTokenScale: 0.8
  },
  med: {
    label: "ROTV.SizeMedium",
    abbreviation: "ROTV.SizeMediumAbbr",
    hitDie: 8
  },
  lg: {
    label: "ROTV.SizeLarge",
    abbreviation: "ROTV.SizeLargeAbbr",
    hitDie: 10,
    token: 2,
    capacityMultiplier: 2
  },
  huge: {
    label: "ROTV.SizeHuge",
    abbreviation: "ROTV.SizeHugeAbbr",
    hitDie: 12,
    token: 3,
    capacityMultiplier: 4
  },
  grg: {
    label: "ROTV.SizeGargantuan",
    abbreviation: "ROTV.SizeGargantuanAbbr",
    hitDie: 20,
    token: 4,
    capacityMultiplier: 8
  }
};
preLocalize("actorSizes", { keys: ["label", "abbreviation"] });

/* -------------------------------------------- */
/*  Canvas                                      */
/* -------------------------------------------- */

/**
 * Colors used to visualize temporary and temporary maximum HP in token health bars.
 * @enum {number}
 */
ROTV.tokenHPColors = {
  damage: 0xFF0000,
  healing: 0x00FF00,
  temp: 0x66CCFF,
  tempmax: 0x440066,
  negmax: 0x550000
};

/* -------------------------------------------- */

/**
 * Colors used when a dynamic token ring effects.
 * @enum {number}
 */
ROTV.tokenRingColors = {
  damage: 0xFF0000,
  defeated: 0x000000,
  healing: 0x00FF00,
  temp: 0x33AAFF
};

/* -------------------------------------------- */

/**
 * Configuration data for a map marker style. Options not included will fall back to the value set in `default` style.
 * Any additional styling options added will be passed into the custom marker class and be available for rendering.
 *
 * @typedef {object} MapLocationMarkerStyle
 * @property {typeof PIXI.Container} [icon]  Map marker class used to render the icon.
 * @property {number} [backgroundColor]      Color of the background inside the circle.
 * @property {number} [borderColor]          Color of the border in normal state.
 * @property {number} [borderHoverColor]     Color of the border when hovering over the marker.
 * @property {string} [fontFamily]           Font used for rendering the code on the marker.
 * @property {number} [shadowColor]          Color of the shadow under the marker.
 * @property {number} [textColor]            Color of the text on the marker.
 */

/**
 * Settings used to render map location markers on the canvas.
 * @enum {MapLocationMarkerStyle}
 */
ROTV.mapLocationMarker = {
  default: {
    icon: MapLocationControlIcon,
    backgroundColor: 0xFBF8F5,
    borderColor: 0x000000,
    borderHoverColor: 0xFF5500,
    fontFamily: "Roboto Slab",
    shadowColor: 0x000000,
    textColor: 0x000000
  }
};

/* -------------------------------------------- */

/**
 * Configuration data for creature types.
 *
 * @typedef {object} CreatureTypeConfiguration
 * @property {string} label               Localized label.
 * @property {string} plural              Localized plural form used in swarm name.
 * @property {string} [reference]         Reference to a rule page describing this type.
 * @property {boolean} [detectAlignment]  Is this type detectable by spells such as "Detect Evil and Good"?
 */

/**
 * Default types of creatures.
 * @enum {CreatureTypeConfiguration}
 */
ROTV.creatureTypes = {
  aberration: {
    label: "ROTV.CreatureAberration",
    plural: "ROTV.CreatureAberrationPl",
    icon: "icons/creatures/tentacles/tentacle-eyes-yellow-pink.webp",
    reference: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.yy50qVC1JhPHt4LC",
    detectAlignment: true
  },
  beast: {
    label: "ROTV.CreatureBeast",
    plural: "ROTV.CreatureBeastPl",
    icon: "icons/creatures/claws/claw-bear-paw-swipe-red.webp",
    reference: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.6bTHn7pZek9YX2tv"
  },
  celestial: {
    label: "ROTV.CreatureCelestial",
    plural: "ROTV.CreatureCelestialPl",
    icon: "icons/creatures/abilities/wings-birdlike-blue.webp",
    reference: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.T5CJwxjhBbi6oqaM",
    detectAlignment: true
  },
  construct: {
    label: "ROTV.CreatureConstruct",
    plural: "ROTV.CreatureConstructPl",
    icon: "icons/creatures/magical/construct-stone-earth-gray.webp",
    reference: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.jQGAJZBZTqDFod8d"
  },
  dragon: {
    label: "ROTV.CreatureDragon",
    plural: "ROTV.CreatureDragonPl",
    icon: "icons/creatures/abilities/dragon-fire-breath-orange.webp",
    reference: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.k2IRXZwGk9W0PM2S"
  },
  elemental: {
    label: "ROTV.CreatureElemental",
    plural: "ROTV.CreatureElementalPl",
    icon: "icons/creatures/magical/spirit-fire-orange.webp",
    reference: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.7z1LXGGkXpHuzkFh",
    detectAlignment: true
  },
  fey: {
    label: "ROTV.CreatureFey",
    plural: "ROTV.CreatureFeyPl",
    icon: "icons/creatures/magical/fae-fairy-winged-glowing-green.webp",
    reference: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.OFsRUt3pWljgm8VC",
    detectAlignment: true
  },
  fiend: {
    label: "ROTV.CreatureFiend",
    plural: "ROTV.CreatureFiendPl",
    icon: "icons/magic/death/skull-horned-goat-pentagram-red.webp",
    reference: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.ElHKBJeiJPC7gj6k",
    detectAlignment: true
  },
  giant: {
    label: "ROTV.CreatureGiant",
    plural: "ROTV.CreatureGiantPl",
    icon: "icons/creatures/magical/humanoid-giant-forest-blue.webp",
    reference: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.AOXn3Mv5vPZwo0Uf"
  },
  humanoid: {
    label: "ROTV.CreatureHumanoid",
    plural: "ROTV.CreatureHumanoidPl",
    icon: "icons/magic/unholy/strike-body-explode-disintegrate.webp",
    reference: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.iFzQs4AenN8ALRvw"
  },
  monstrosity: {
    label: "ROTV.CreatureMonstrosity",
    plural: "ROTV.CreatureMonstrosityPl",
    icon: "icons/creatures/abilities/mouth-teeth-rows-red.webp",
    reference: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.TX0yPEFTn79AMZ8P"
  },
  ooze: {
    label: "ROTV.CreatureOoze",
    plural: "ROTV.CreatureOozePl",
    icon: "icons/creatures/slimes/slime-movement-pseudopods-green.webp",
    reference: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.cgzIC1ecG03D97Fg"
  },
  plant: {
    label: "ROTV.CreaturePlant",
    plural: "ROTV.CreaturePlantPl",
    icon: "icons/magic/nature/tree-animated-strike.webp",
    reference: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.1oT7t6tHE4kZuSN1"
  },
  undead: {
    label: "ROTV.CreatureUndead",
    plural: "ROTV.CreatureUndeadPl",
    icon: "icons/magic/death/skull-horned-worn-fire-blue.webp",
    reference: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.D2BdqS1GeD5rcZ6q",
    detectAlignment: true
  }
};
preLocalize("creatureTypes", { keys: ["label", "plural"], sort: true });

/* -------------------------------------------- */

/**
 * Classification types for item action types.
 * @enum {string}
 */
ROTV.itemActionTypes = {
  mwak: "ROTV.ActionMWAK",
  rwak: "ROTV.ActionRWAK",
  msak: "ROTV.ActionMSAK",
  rsak: "ROTV.ActionRSAK",
  abil: "ROTV.ActionAbil",
  save: "ROTV.ActionSave",
  ench: "ROTV.ActionEnch",
  summ: "ROTV.ActionSumm",
  heal: "ROTV.ActionHeal",
  util: "ROTV.ActionUtil",
  other: "ROTV.ActionOther"
};
preLocalize("itemActionTypes");

/* -------------------------------------------- */

/**
 * Different ways in which item capacity can be limited.
 * @enum {string}
 */
ROTV.itemCapacityTypes = {
  items: "ROTV.ItemContainerCapacityItems",
  weight: "ROTV.ItemContainerCapacityWeight"
};
preLocalize("itemCapacityTypes", { sort: true });

/* -------------------------------------------- */

/**
 * List of various item rarities.
 * @enum {string}
 */
ROTV.itemRarity = {
  common: "ROTV.ItemRarityCommon",
  uncommon: "ROTV.ItemRarityUncommon",
  rare: "ROTV.ItemRarityRare",
  veryRare: "ROTV.ItemRarityVeryRare",
  legendary: "ROTV.ItemRarityLegendary",
  artifact: "ROTV.ItemRarityArtifact"
};
preLocalize("itemRarity");

/* -------------------------------------------- */

/**
 * The limited use periods that support a recovery formula.
 * @deprecated since RotV 3.1, available until RotV 3.3
 * @enum {string}
 */
ROTV.limitedUseFormulaPeriods = {
  charges: "ROTV.Charges",
  dawn: "ROTV.Dawn",
  dusk: "ROTV.Dusk"
};

/* -------------------------------------------- */

/**
 * Configuration data for limited use periods.
 *
 * @typedef {object} LimitedUsePeriodConfiguration
 * @property {string} label           Localized label.
 * @property {string} abbreviation    Shorthand form of the label.
 * @property {boolean} [formula]      Whether this limited use period restores charges via formula.
 */

/**
 * Enumerate the lengths of time over which an item can have limited use ability.
 * @enum {LimitedUsePeriodConfiguration}
 */
ROTV.limitedUsePeriods = {
  sr: {
    label: "ROTV.UsesPeriods.Sr",
    abbreviation: "ROTV.UsesPeriods.SrAbbreviation"
  },
  lr: {
    label: "ROTV.UsesPeriods.Lr",
    abbreviation: "ROTV.UsesPeriods.LrAbbreviation"
  },
  day: {
    label: "ROTV.UsesPeriods.Day",
    abbreviation: "ROTV.UsesPeriods.DayAbbreviation"
  },
  charges: {
    label: "ROTV.UsesPeriods.Charges",
    abbreviation: "ROTV.UsesPeriods.ChargesAbbreviation",
    formula: true
  },
  dawn: {
    label: "ROTV.UsesPeriods.Dawn",
    abbreviation: "ROTV.UsesPeriods.DawnAbbreviation",
    formula: true
  },
  dusk: {
    label: "ROTV.UsesPeriods.Dusk",
    abbreviation: "ROTV.UsesPeriods.DuskAbbreviation",
    formula: true
  }
};
preLocalize("limitedUsePeriods", { keys: ["label", "abbreviation"] });
patchConfig("limitedUsePeriods", "label", { since: "RotV 3.1", until: "RotV 3.3" });

/* -------------------------------------------- */

/**
 * Periods at which enchantments can be re-bound to new items.
 * @enum {{ label: string }}
 */
ROTV.enchantmentPeriods = {
  sr: {
    label: "ROTV.UsesPeriods.Sr"
  },
  lr: {
    label: "ROTV.UsesPeriods.Lr"
  },
  atwill: {
    label: "ROTV.UsesPeriods.AtWill"
  }
};
preLocalize("enchantmentPeriods", { key: "label" });

/* -------------------------------------------- */

/**
 * Specific equipment types that modify base AC.
 * @enum {string}
 */
ROTV.armorTypes = {
  light: "ROTV.EquipmentLight",
  medium: "ROTV.EquipmentMedium",
  heavy: "ROTV.EquipmentHeavy",
  natural: "ROTV.EquipmentNatural",
  shield: "ROTV.EquipmentShield"
};
preLocalize("armorTypes");

/* -------------------------------------------- */

/**
 * Equipment types that aren't armor.
 * @enum {string}
 */
ROTV.miscEquipmentTypes = {
  clothing: "ROTV.EquipmentClothing",
  trinket: "ROTV.EquipmentTrinket",
  vehicle: "ROTV.EquipmentVehicle",
  utilityGear: "ROTV.UtilityGear",
  attachment: "ROTV.EquipmentAttachment"
};
preLocalize("miscEquipmentTypes", { sort: true });

/* -------------------------------------------- */

/**
 * The set of equipment types for armor, clothing, and other objects which can be worn by the character.
 * @enum {string}
 */
ROTV.equipmentTypes = {
  ...ROTV.miscEquipmentTypes,
  ...ROTV.armorTypes
};
preLocalize("equipmentTypes", { sort: true });

/* -------------------------------------------- */

/**
 * The various types of vehicles in which characters can be proficient.
 * @enum {string}
 */
ROTV.vehicleTypes = {
  air: "ROTV.VehicleTypeAir",
  land: "ROTV.VehicleTypeLand",
  space: "ROTV.VehicleTypeSpace",
  water: "ROTV.VehicleTypeWater"
};
preLocalize("vehicleTypes", { sort: true });

/* -------------------------------------------- */

/**
 * The set of Armor Proficiencies which a character may have.
 * @type {object}
 */
ROTV.armorProficiencies = {
  lgt: "ROTV.ArmorLightProficiency",
  med: "ROTV.ArmorMediumProficiency",
  hvy: "ROTV.ArmorHeavyProficiency",
  shl: "ROTV.EquipmentShieldProficiency"
};
preLocalize("armorProficiencies");

/**
 * A mapping between `ROTV.equipmentTypes` and `ROTV.armorProficiencies` that
 * is used to determine if character has proficiency when adding an item.
 * @enum {(boolean|string)}
 */
ROTV.armorProficienciesMap = {
  natural: true,
  clothing: true,
  light: "lgt",
  medium: "med",
  heavy: "hvy",
  shield: "shl"
};

/**
 * The basic armor types in RotV. This enables specific armor proficiencies,
 * automated AC calculation in NPCs, and starting equipment.
 * @enum {string}
 */
ROTV.armorIds = {
};

/**
 * The basic shield in RotV.
 * @enum {string}
 */
ROTV.shieldIds = {
};

/**
 * Common armor class calculations.
 * @enum {{ label: string, [formula]: string }}
 */
ROTV.armorClasses = {
  flat: {
    label: "ROTV.ArmorClassFlat",
    formula: "@attributes.ac.flat"
  },
  natural: {
    label: "ROTV.ArmorClassNatural",
    formula: "@attributes.ac.flat"
  },
  default: {
    label: "ROTV.ArmorClassEquipment",
    formula: "@attributes.ac.armor + @attributes.ac.dex"
  },
  mage: {
    label: "ROTV.ArmorClassMage",
    formula: "13 + @abilities.dex.mod"
  },
  draconic: {
    label: "ROTV.ArmorClassDraconic",
    formula: "13 + @abilities.dex.mod"
  },
  unarmoredMonk: {
    label: "ROTV.ArmorClassUnarmoredMonk",
    formula: "10 + @abilities.dex.mod + @abilities.wis.mod"
  },
  unarmoredBarb: {
    label: "ROTV.ArmorClassUnarmoredBarbarian",
    formula: "10 + @abilities.dex.mod + @abilities.con.mod"
  },
  custom: {
    label: "ROTV.ArmorClassCustom"
  }
};
preLocalize("armorClasses", { key: "label" });

/* -------------------------------------------- */

/**
 * Configuration data for an items that have sub-types.
 *
 * @typedef {object} SubtypeTypeConfiguration
 * @property {string} label                       Localized label for this type.
 * @property {Record<string, string>} [subtypes]  Enum containing localized labels for subtypes.
 */

/**
 * Enumerate the valid consumable types which are recognized by the system.
 * @enum {SubtypeTypeConfiguration}
 */
ROTV.consumableTypes = {
  ammo: {
    label: "ROTV.ConsumableAmmo",
    subtypes: {
      arrow: "ROTV.ConsumableAmmoArrow",
      blowgunNeedle: "ROTV.ConsumableAmmoBlowgunNeedle",
      crossbowBolt: "ROTV.ConsumableAmmoCrossbowBolt",
      slingBullet: "ROTV.ConsumableAmmoSlingBullet"
    }
  },
  potion: {
    label: "ROTV.ConsumablePotion"
  },
  food: {
    label: "ROTV.ConsumableFood"
  },
  wand: {
    label: "ROTV.ConsumableWand"
  },
  trinket: {
    label: "ROTV.ConsumableTrinket"
  }
};
preLocalize("consumableTypes", { key: "label", sort: true });
preLocalize("consumableTypes.ammo.subtypes", { sort: true });
preLocalize("consumableTypes.poison.subtypes", { sort: true });

/* -------------------------------------------- */

/**
 * Types of containers.
 * @enum {string}
 */
ROTV.containerTypes = {
  backpack: "H8YCd689ezlD26aT",
  barrel: "7Yqbqg5EtVW16wfT",
  basket: "Wv7HzD6dv1P0q78N",
  boltcase: "eJtPBiZtr2pp6ynt",
  bottle: "HZp69hhyNZUUCipF",
  bucket: "mQVYcHmMSoCUnBnM",
  case: "5mIeX824uMklU3xq",
  chest: "2YbuclKfhDL0bU4u",
  flask: "lHS63sC6bypENNlR",
  jug: "0ZBWwjFz3nIAXMLW",
  pot: "M8xM8BLK4tpUayEE",
  pitcher: "nXWdGtzi8DXDLLsL",
  pouch: "9bWTRRDym06PzSAf",
  quiver: "4MtQKPn9qMWCFjDA",
  sack: "CNdDj8dsXVpRVpXt",
  saddlebags: "TmfaFUSZJAotndn9",
  tankard: "uw6fINSmZ2j2o57A",
  vial: "meJEfX3gZgtMX4x2"
};

/* -------------------------------------------- */

/**
 * Configuration data for spellcasting foci.
 *
 * @typedef {object} SpellcastingFocusConfiguration
 * @property {string} label                    Localized label for this category.
 * @property {Object<string, string>} itemIds  Item IDs or UUIDs.
 */

/**
 * Type of spellcasting foci.
 * @enum {SpellcastingFocusConfiguration}
 */
ROTV.focusTypes = {
  arcane: {
    label: "ROTV.Focus.Arcane",
    itemIds: {
    }
  },
  druidic: {
    label: "ROTV.Focus.Druidic",
    itemIds: {
    }
  },
  holy: {
    label: "ROTV.Focus.Holy",
    itemIds: {
    }
  }
};
preLocalize("focusTypes", { key: "label" });

/* -------------------------------------------- */

/**
 * Types of "features" items.
 * @enum {SubtypeTypeConfiguration}
 */
ROTV.featureTypes = {
  background: {
    label: "ROTV.Feature.Background"
  },
  class: {
    label: "ROTV.Feature.Class.Label",
    subtypes: {
      arcaneShot: "ROTV.Feature.Class.ArcaneShot",
      artificerInfusion: "ROTV.Feature.Class.ArtificerInfusion",
      channelDivinity: "ROTV.Feature.Class.ChannelDivinity",
      defensiveTactic: "ROTV.Feature.Class.DefensiveTactic",
      eldritchInvocation: "ROTV.Feature.Class.EldritchInvocation",
      elementalDiscipline: "ROTV.Feature.Class.ElementalDiscipline",
      fightingStyle: "ROTV.Feature.Class.FightingStyle",
      huntersPrey: "ROTV.Feature.Class.HuntersPrey",
      ki: "ROTV.Feature.Class.Ki",
      maneuver: "ROTV.Feature.Class.Maneuver",
      metamagic: "ROTV.Feature.Class.Metamagic",
      multiattack: "ROTV.Feature.Class.Multiattack",
      pact: "ROTV.Feature.Class.PactBoon",
      psionicPower: "ROTV.Feature.Class.PsionicPower",
      rune: "ROTV.Feature.Class.Rune",
      superiorHuntersDefense: "ROTV.Feature.Class.SuperiorHuntersDefense"
    }
  },
  monster: {
    label: "ROTV.Feature.Monster"
  },
  race: {
    label: "ROTV.Feature.Species"
  },
  enchantment: {
    label: "ROTV.Enchantment.Label",
    subtypes: {
      artificerInfusion: "ROTV.Feature.Class.ArtificerInfusion",
      rune: "ROTV.Feature.Class.Rune"
    }
  },
  feat: {
    label: "ROTV.Feature.Feat"
  },
  supernaturalGift: {
    label: "ROTV.Feature.SupernaturalGift.Label",
    subtypes: {
      blessing: "ROTV.Feature.SupernaturalGift.Blessing",
      charm: "ROTV.Feature.SupernaturalGift.Charm",
      epicBoon: "ROTV.Feature.SupernaturalGift.EpicBoon"
    }
  }
};
preLocalize("featureTypes", { key: "label" });
preLocalize("featureTypes.class.subtypes", { sort: true });
preLocalize("featureTypes.enchantment.subtypes", { sort: true });
preLocalize("featureTypes.supernaturalGift.subtypes", { sort: true });

/* -------------------------------------------- */

/**
 * Configuration data for item properties.
 *
 * @typedef {object} ItemPropertyConfiguration
 * @property {string} label           Localized label.
 * @property {string} [abbreviation]  Localized abbreviation.
 * @property {string} [icon]          Icon that can be used in certain places to represent this property.
 * @property {string} [reference]     Reference to a rule page describing this property.
 * @property {boolean} [isPhysical]   Is this property one that can cause damage resistance bypasses?
 * @property {boolean} [isTag]        Is this spell property a tag, rather than a component?
 */

/**
 * The various properties of all item types.
 * @enum {ItemPropertyConfiguration}
 */
ROTV.itemProperties = {
  asa: {
    label: "ROTV.Item.Property.AreaSup"
  },
  arp: {
    label: "ROTV.Item.Property.AP"
  },
  aut: {
    label: "ROTV.Item.Property.Auto"
  },
  bla: {
    label: "ROTV.Item.Property.Blast"
  },
  blk: {
    label: "ROTV.Item.Property.Bulky"
  },
  bob: {
    label: "ROTV.Item.Property.BothB"
  },
  bon: {
    label: "ROTV.Item.Property.BuckshotOnly"
  },
  buc: {
    label: "ROTV.Item.Property.Buckshot"
  },
  bur: {
    label: "ROTV.Item.Property.Bursting"
  },
  npr: {
    label: "ROTV.Item.Property.NonPiercing"
  },
  csh: {
    label: "ROTV.Item.Property.Cushioned"
  },
  dam: {
    label: "ROTV.Item.Property.Damaged"
  },
  ded: {
    label: "ROTV.Item.Property.Destroyed"
  },
  des: {
    label: "ROTV.Item.Property.Destructive"
  },
  dis: {
    label: "ROTV.Item.Property.Disorienting"
  },
  emp: {
    label: "ROTV.Item.Property.EMP"
  },
  fin: {
    label: "ROTV.Item.Property.Finesse"
  },
  fla: {
    label: "ROTV.Item.Property.Flame"
  },
  frq: {
    label: "ROTV.Item.Property.FitnessRequirement"
  },
  fsf: {
    label: "ROTV.Item.Property.FireSurface"
  },
  grs: {
    label: "ROTV.Item.Property.GyroStab"
  },
  ina: {
    label: "ROTV.Item.Property.Inaccurate"
  },
  lsg: {
    label: "ROTV.Item.Property.Lasgun"
  },
  mlt: {
    label: "ROTV.Item.Property.Melta"
  },
  oha: {
    label: "ROTV.Item.Property.OneHanded"
  },
  ovc: {
    label: "ROTV.Item.Property.Overcharge"
  },
  pon: {
    label: "ROTV.Item.Property.Ponderous"
  },
  pow: {
    label: "ROTV.Item.Property.Powered"
  },
  pun: {
    label: "ROTV.Item.Property.Puncturing"
  },
  rpd: {
    label: "ROTV.Item.Property.Rapid"
  },
  sda: {
    label: "ROTV.Item.Property.Sidearm"
  },
  shd: {
    label: "ROTV.Item.Property.Shield"
  },
  shc: {
    label: "ROTV.Item.Property.Shocking"
  },
  shm: {
    label: "ROTV.Item.Property.ShockMode"
  },
  sld: {
    label: "ROTV.Item.Property.Sealed"
  },
  smk: {
    label: "ROTV.Item.Property.Smoke"
  },
  spc: {
    label: "ROTV.Item.Property.Special"
  },
  stc: {
    label: "ROTV.Item.Property.Sticky"
  },
  sup: {
    label: "ROTV.Item.Property.Suppressive"
  },
  thr: {
    label: "ROTV.Item.Property.Thrown"
  },
  unr: {
    label: "ROTV.Item.Property.Unreliable"
  },
  unw: {
    label: "ROTV.Item.Property.Unwieldy"
  },
  ver: {
    label: "ROTV.Item.Property.Versatile"
  }
};
preLocalize("itemProperties", { key: "label", sort: true });

/* -------------------------------------------- */

/**
 * The various properties of an item per item type.
 * @enum {object}
 */
ROTV.validProperties = {
  consumable: new Set([
    "arp",
    "bla",
    "npr",
    "dam",
    "des",
    "dis",
    "emp",
    "fla",
    "fsf",
    "ina",
    "pun",
    "shc",
    "smk",
    "spc",
    "stc",
    "unr"
  ]),
  container: new Set([
    "spc"
  ]),
  equipment: new Set([
    "blk",
    "csh",
    "dam",
    "ded",
    "frq",
    "pow",
    "sld",
    "spc",
  ]),
  feat: new Set([
    "spc"
  ]),
  loot: new Set([
    "spc"
  ]),
  weapon: new Set([
    "asa",
    "arp",
    "aut",
    "bla",
    "bob",
    "bon",
    "buc",
    "bur",
    "dam",
    "ded",
    "des",
    "dis",
    "emp",
    "fin",
    "fla",
    "fsf",
    "ina",
    "oha",
    "ovc",
    "pun",
    "rpd",
    "shd",
    "shc",
    "shm",
    "smk",
    "sda",
    "spc",
    "stc",
    "sup",
    "unr",
    "unw",
    "npr",
    "grs",
    "lsg",
    "mlt",
    "thr",
    "ver"
  ]),
  spell: new Set([
    "spc"
  ]),
  tool: new Set([
    "spc"
  ])
};

/* -------------------------------------------- */

/**
 * Configuration data for an item with the "loot" type.
 *
 * @typedef {object} LootTypeConfiguration
 * @property {string} label                       Localized label for this type.
 */

/**
 * Types of "loot" items.
 * @enum {LootTypeConfiguration}
 */
ROTV.lootTypes = {
  art: {
    label: "ROTV.Loot.Art"
  },
  gear: {
    label: "ROTV.Loot.Gear"
  },
  gem: {
    label: "ROTV.Loot.Gem"
  },
  junk: {
    label: "ROTV.Loot.Junk"
  },
  material: {
    label: "ROTV.Loot.Material"
  },
  resource: {
    label: "ROTV.Loot.Resource"
  },
  treasure: {
    label: "ROTV.Loot.Treasure"
  }
};
preLocalize("lootTypes", { key: "label" });

/* -------------------------------------------- */

/**
 * @typedef {object} CurrencyConfiguration
 * @property {string} label         Localized label for the currency.
 * @property {string} abbreviation  Localized abbreviation for the currency.
 * @property {number} conversion    Number by which this currency should be multiplied to arrive at a standard value.
 */

/**
 * The valid currency denominations with localized labels, abbreviations, and conversions.
 * The conversion number defines how many of that currency are equal to one GP.
 * @enum {CurrencyConfiguration}
 */
ROTV.currencies = {
  cr: "ROTV.CurrencyCR"
};
preLocalize("currencies", { keys: ["label", "abbreviation"] });

/* -------------------------------------------- */
/*  Damage Types                                */
/* -------------------------------------------- */

/**
 * Configuration data for damage types.
 *
 * @typedef {object} DamageTypeConfiguration
 * @property {string} label          Localized label.
 * @property {string} icon           Icon representing this type.
 * @property {boolean} [isPhysical]  Is this a type that can be bypassed by magical or silvered weapons?
 * @property {string} [reference]    Reference to a rule page describing this damage type.
 * @property {Color} Color           Visual color of the damage type.
 */

/**
 * Types of damage the can be caused by abilities.
 * @enum {DamageTypeConfiguration}
 */
ROTV.damageTypes = {
  toxic: {
    label: "ROTV.DamageToxic",
    icon: "systems/rotv/icons/svg/damage/acid.svg",
    reference: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.IQhbKRPe1vCPdh8v",
    color: new Color(0x839D50)
  },
  normal: {
    label: "ROTV.DamageNormal",
    icon: "systems/rotv/icons/svg/damage/bludgeoning.svg",
    isPhysical: true,
    reference: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.39LFrlef94JIYO8m",
    color: new Color(0x0000A0)
  },
  fire: {
    label: "ROTV.DamageFire",
    icon: "systems/rotv/icons/svg/damage/fire.svg",
    reference: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.f1S66aQJi4PmOng6",
    color: new Color(0xFF4500)
  },
  falling: {
    label: "ROTV.DamageFalling",
    icon: "systems/rotv/icons/svg/damage/force.svg",
    reference: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.eFTWzngD8dKWQuUR",
    color: new Color(0x800080)
  },
  armorPiercing: {
    label: "ROTV.DamagePiercing",
    icon: "systems/rotv/icons/svg/damage/piercing.svg",
    isPhysical: true,
    reference: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.95agSnEGTdAmKhyC",
    color: new Color(0xC0C0C0)
  },
  psychic: {
    label: "ROTV.DamagePsychic",
    icon: "systems/rotv/icons/svg/damage/psychic.svg",
    reference: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.YIKbDv4zYqbE5teJ",
    color: new Color(0xFF1493)
  },
  puncturing: {
    label: "ROTV.DamagePuncturing",
    icon: "systems/rotv/icons/svg/damage/slashing.svg",
    isPhysical: true,
    reference: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.sz2XKQ5lgsdPEJOa",
    color: new Color(0x8B0000)
  }
};
preLocalize("damageTypes", { keys: ["label"], sort: true });

/* -------------------------------------------- */

/**
 * Display aggregated damage in chat cards.
 * @type {boolean}
 */
ROTV.aggregateDamageDisplay = true;

/* -------------------------------------------- */
/*  Movement                                    */
/* -------------------------------------------- */

/**
 * Different types of healing that can be applied using abilities.
 * @enum {string}
 */
ROTV.healingTypes = {
  healing: {
    label: "ROTV.Healing",
    icon: "systems/rotv/icons/svg/damage/healing.svg",
    color: new Color(0x46C252)
  },
  temphp: {
    label: "ROTV.HealingTemp",
    icon: "systems/rotv/icons/svg/damage/temphp.svg",
    color: new Color(0x4B66DE)
  }
};
preLocalize("healingTypes", { keys: ["label"] });

/* -------------------------------------------- */

/**
 * The valid units of measure for movement distances in the game system.
 * By default this uses the imperial units of feet and miles.
 * @enum {string}
 */
ROTV.movementTypes = {
  burrow: "ROTV.MovementBurrow",
  climb: "ROTV.MovementClimb",
  fly: "ROTV.MovementFly",
  swim: "ROTV.MovementSwim",
  walk: "ROTV.MovementWalk"
};
preLocalize("movementTypes", { sort: true });

/* -------------------------------------------- */
/*  Measurement                                 */
/* -------------------------------------------- */

/**
 * The valid units of measure for movement distances in the game system.
 * By default this uses the imperial units of feet and miles.
 * @enum {string}
 */
ROTV.movementUnits = {
  sq: "ROTV.DistFt",
  mi: "ROTV.DistMi",
  m: "ROTV.DistM",
  km: "ROTV.DistKm"
};
preLocalize("movementUnits");

/* -------------------------------------------- */

/**
 * The types of range that are used for measuring actions and effects.
 * @enum {string}
 */
ROTV.rangeTypes = {
  self: "ROTV.DistSelf",
  touch: "ROTV.DistTouch",
  spec: "ROTV.Special",
  any: "ROTV.DistAny"
};
preLocalize("rangeTypes");

/* -------------------------------------------- */

/**
 * The valid units of measure for the range of an action or effect. A combination of `ROTV.movementUnits` and
 * `ROTV.rangeUnits`.
 * @enum {string}
 */
ROTV.distanceUnits = {
  ...ROTV.movementUnits,
  ...ROTV.rangeTypes
};
preLocalize("distanceUnits");

/* -------------------------------------------- */

/**
 * Configuration data for a weight unit.
 *
 * @typedef {object} WeightUnitConfiguration
 * @property {string} label         Localized label for the unit.
 * @property {string} abbreviation  Localized abbreviation for the unit.
 * @property {number} conversion    Number that by which this unit should be multiplied to arrive at a standard value.
 * @property {string} type          Whether this is an "imperial" or "metric" unit.
 */

/**
 * The valid units for measurement of weight.
 * @enum {WeightUnitConfiguration}
 */
ROTV.weightUnits = {
  lb: {
    label: "ROTV.WeightUnit.Pounds.Label",
    abbreviation: "ROTV.WeightUnit.Pounds.Abbreviation",
    conversion: 1,
    type: "imperial"
  },
  tn: {
    label: "ROTV.WeightUnit.Tons.Label",
    abbreviation: "ROTV.WeightUnit.Tons.Abbreviation",
    conversion: 2000,
    type: "imperial"
  },
  kg: {
    label: "ROTV.WeightUnit.Kilograms.Label",
    abbreviation: "ROTV.WeightUnit.Kilograms.Abbreviation",
    conversion: 2.5,
    type: "metric"
  },
  Mg: {
    label: "ROTV.WeightUnit.Megagrams.Label",
    abbreviation: "ROTV.WeightUnit.Megagrams.Abbreviation",
    conversion: 2500,
    type: "metric"
  }
};
preLocalize("weightUnits", { keys: ["label", "abbreviation"] });

/* -------------------------------------------- */

/**
 * Encumbrance configuration data.
 *
 * @typedef {object} EncumbranceConfiguration
 * @property {Record<string, number>} currencyPerWeight  Pieces of currency that equal a base weight (lbs or kgs).
 * @property {Record<string, object>} effects            Data used to create encumbrance-related Active Effects.
 * @property {object} threshold                          Amount to multiply strength to get given capacity threshold.
 * @property {Record<string, number>} threshold.encumbered
 * @property {Record<string, number>} threshold.heavilyEncumbered
 * @property {Record<string, number>} threshold.maximum
 * @property {Record<string, {sq: number, m: number}>} speedReduction  Speed reduction caused by encumbered status.
 * @property {Record<string, number>} vehicleWeightMultiplier  Multiplier used to determine vehicle carrying capacity.
 * @property {Record<string, Record<string, string>>} baseUnits  Base units used to calculate carrying weight.
 */

/**
 * Configure aspects of encumbrance calculation so that it could be configured by modules.
 * @type {EncumbranceConfiguration}
 */
ROTV.encumbrance = {
  currencyPerWeight: {
    imperial: 10000,
    metric: 10000
  },
  effects: {
    encumbered: {
      name: "EFFECT.ROTV.StatusEncumbered",
      icon: "systems/rotv/icons/svg/statuses/encumbered.svg"
    },
    heavilyEncumbered: {
      name: "EFFECT.ROTV.StatusHeavilyEncumbered",
      icon: "systems/rotv/icons/svg/statuses/heavily-encumbered.svg"
    },
    exceedingCarryingCapacity: {
      name: "EFFECT.ROTV.StatusExceedingCarryingCapacity",
      icon: "systems/rotv/icons/svg/statuses/exceeding-carrying-capacity.svg"
    }
  },
  threshold: {
    encumbered: {
      imperial: 5,
      metric: 2.5
    },
    heavilyEncumbered: {
      imperial: 10,
      metric: 5
    },
    maximum: {
      imperial: 1,
      metric: 1
    }
  },
  speedReduction: {
    encumbered: {
      sq: 1,
      m: 3
    },
    heavilyEncumbered: {
      sq: 2,
      m: 6
    },
    exceedingCarryingCapacity: {
      sq: 1,
      m: 1.5
    }
  },
  baseUnits: {
    default: {
      imperial: "lb",
      metric: "kg"
    },
    vehicle: {
      imperial: "tn",
      metric: "Mg"
    }
  }
};
preLocalize("encumbrance.effects", { key: "name" });

/* -------------------------------------------- */
/*  Targeting                                   */
/* -------------------------------------------- */

/**
 * Targeting types that apply to one or more distinct targets.
 * @enum {string}
 */
ROTV.individualTargetTypes = {
  self: "ROTV.TargetSelf",
  ally: "ROTV.TargetAlly",
  enemy: "ROTV.TargetEnemy",
  creature: "ROTV.TargetCreature",
  object: "ROTV.TargetObject",
  space: "ROTV.TargetSpace",
  creatureOrObject: "ROTV.TargetCreatureOrObject",
  any: "ROTV.TargetAny",
  willing: "ROTV.TargetWilling"
};
preLocalize("individualTargetTypes");

/* -------------------------------------------- */

/**
 * Information needed to represent different area of effect target types.
 *
 * @typedef {object} AreaTargetDefinition
 * @property {string} label        Localized label for this type.
 * @property {string} template     Type of `MeasuredTemplate` create for this target type.
 * @property {string} [reference]  Reference to a rule page describing this area of effect.
 */

/**
 * Targeting types that cover an area.
 * @enum {AreaTargetDefinition}
 */
ROTV.areaTargetTypes = {
  radius: {
    label: "ROTV.TargetRadius",
    template: "circle"
  },
  sphere: {
    label: "ROTV.TargetSphere",
    template: "circle",
    reference: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.npdEWb2egUPnB5Fa"
  },
  cylinder: {
    label: "ROTV.TargetCylinder",
    template: "circle",
    reference: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.jZFp4R7tXsIqkiG3"
  },
  cone: {
    label: "ROTV.TargetCone",
    template: "cone",
    reference: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.DqqAOr5JnX71OCOw"
  },
  square: {
    label: "ROTV.TargetSquare",
    template: "rect"
  },
  cube: {
    label: "ROTV.TargetCube",
    template: "rect",
    reference: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.dRfDIwuaHmUQ06uA"
  },
  line: {
    label: "ROTV.TargetLine",
    template: "ray",
    reference: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.6DOoBgg7okm9gBc6"
  },
  wall: {
    label: "ROTV.TargetWall",
    template: "ray"
  }
};
preLocalize("areaTargetTypes", { key: "label", sort: true });

/* -------------------------------------------- */

/**
 * The types of single or area targets which can be applied to abilities.
 * @enum {string}
 */
ROTV.targetTypes = {
  ...ROTV.individualTargetTypes,
  ...Object.fromEntries(Object.entries(ROTV.areaTargetTypes).map(([k, v]) => [k, v.label]))
};
preLocalize("targetTypes", { sort: true });

/* -------------------------------------------- */

/**
 * Denominations of hit dice which can apply to classes.
 * @type {string[]}
 */
ROTV.hitDieTypes = ["d4", "d6", "d8", "d10", "d12"];

/* -------------------------------------------- */

/**
 * Configuration data for rest types.
 *
 * @typedef {object} RestConfiguration
 * @property {Record<string, number>} duration  Duration of different rest variants in minutes.
 */

/**
 * Types of rests.
 * @enum {RestConfiguration}
 */
ROTV.restTypes = {
  short: {
    duration: {
      normal: 60,
      gritty: 480,
      epic: 1
    }
  },
  long: {
    duration: {
      normal: 480,
      gritty: 10080,
      epic: 60
    }
  }
};

/* -------------------------------------------- */

/**
 * The set of possible sensory perception types which an Actor may have.
 * @enum {string}
 */
ROTV.senses = {
  blindsight: "ROTV.SenseBlindsight",
  darkvision: "ROTV.SenseDarkvision",
  tremorsense: "ROTV.SenseTremorsense",
  truesight: "ROTV.SenseTruesight"
};
preLocalize("senses", { sort: true });

/* -------------------------------------------- */
/*  Spellcasting                                */
/* -------------------------------------------- */

/**
 * Define the standard slot progression by character level.
 * The entries of this array represent the spell slot progression for a full spell-caster.
 * @type {number[][]}
 */
ROTV.SPELL_SLOT_TABLE = [
  [2],
  [3],
  [4, 2],
  [4, 3],
  [4, 3, 2],
  [4, 3, 3],
  [4, 3, 3, 1],
  [4, 3, 3, 2],
  [4, 3, 3, 3, 1],
  [4, 3, 3, 3, 2],
  [4, 3, 3, 3, 2, 1],
  [4, 3, 3, 3, 2, 1],
  [4, 3, 3, 3, 2, 1, 1],
  [4, 3, 3, 3, 2, 1, 1],
  [4, 3, 3, 3, 2, 1, 1, 1],
  [4, 3, 3, 3, 2, 1, 1, 1],
  [4, 3, 3, 3, 2, 1, 1, 1, 1],
  [4, 3, 3, 3, 3, 1, 1, 1, 1],
  [4, 3, 3, 3, 3, 2, 1, 1, 1],
  [4, 3, 3, 3, 3, 2, 2, 1, 1]
];

/* -------------------------------------------- */

/**
 * Configuration data for pact casting progression.
 *
 * @typedef {object} PactProgressionConfig
 * @property {number} slots  Number of spell slots granted.
 * @property {number} level  Level of spells that can be cast.
 */

/**
 * Define the pact slot & level progression by pact caster level.
 * @enum {PactProgressionConfig}
 */
ROTV.pactCastingProgression = {
  1: { slots: 1, level: 1 },
  2: { slots: 2, level: 1 },
  3: { slots: 2, level: 2 },
  5: { slots: 2, level: 3 },
  7: { slots: 2, level: 4 },
  9: { slots: 2, level: 5 },
  11: { slots: 3, level: 5 },
  17: { slots: 4, level: 5 }
};

/* -------------------------------------------- */

/**
 * Configuration data for spell preparation modes.
 *
 * @typedef {object} SpellPreparationModeConfiguration
 * @property {string} label           Localized name of this spell preparation type.
 * @property {boolean} [upcast]       Whether this preparation mode allows for upcasting.
 * @property {boolean} [cantrips]     Whether this mode allows for cantrips in a spellbook.
 * @property {number} [order]         The sort order of this mode in a spellbook.
 * @property {boolean} [prepares]     Whether this preparation mode prepares spells.
 */

/**
 * Various different ways a spell can be prepared.
 * @enum {SpellPreparationModeConfiguration}
 */
ROTV.spellPreparationModes = {
  prepared: {
    label: "ROTV.SpellPrepPrepared",
    upcast: true,
    prepares: true
  },
  pact: {
    label: "ROTV.PactMagic",
    upcast: true,
    cantrips: true,
    order: 0.5
  },
  always: {
    label: "ROTV.SpellPrepAlways",
    upcast: true,
    prepares: true
  },
  atwill: {
    label: "ROTV.SpellPrepAtWill",
    order: -30
  },
  innate: {
    label: "ROTV.SpellPrepInnate",
    order: -20
  },
  ritual: {
    label: "ROTV.SpellPrepRitual",
    order: -10
  }
};
preLocalize("spellPreparationModes", { key: "label" });
patchConfig("spellPreparationModes", "label", { since: "RotV 3.1", until: "RotV 3.3" });

/* -------------------------------------------- */

/**
 * Subset of `ROTV.spellPreparationModes` that consume spell slots.
 * @deprecated since RotV 3.1, available until RotV 3.3
 * @type {string[]}
 */
ROTV.spellUpcastModes = ["always", "pact", "prepared"];

/* -------------------------------------------- */

/**
 * Configuration data for different types of spellcasting supported.
 *
 * @typedef {object} SpellcastingTypeConfiguration
 * @property {string} label                               Localized label.
 * @property {string} img                                 Image used when rendered as a favorite on the sheet.
 * @property {boolean} [shortRest]                        Are these spell slots additionally restored on a short rest?
 * @property {Object<string, SpellcastingProgressionConfiguration>} [progression]  Any progression modes for this type.
 */

/**
 * Configuration data for a spellcasting progression mode.
 *
 * @typedef {object} SpellcastingProgressionConfiguration
 * @property {string} label             Localized label.
 * @property {number} [divisor=1]       Value by which the class levels are divided to determine spellcasting level.
 * @property {boolean} [roundUp=false]  Should fractional values should be rounded up by default?
 */

/**
 * Different spellcasting types and their progression.
 * @type {SpellcastingTypeConfiguration}
 */
ROTV.spellcastingTypes = {
  leveled: {
    label: "ROTV.SpellProgLeveled",
    img: "systems/rotv/icons/spell-tiers/{id}.webp",
    progression: {
      full: {
        label: "ROTV.SpellProgFull",
        divisor: 1
      },
      half: {
        label: "ROTV.SpellProgHalf",
        divisor: 2
      },
      third: {
        label: "ROTV.SpellProgThird",
        divisor: 3
      },
      artificer: {
        label: "ROTV.SpellProgArt",
        divisor: 2,
        roundUp: true
      }
    }
  },
  pact: {
    label: "ROTV.SpellProgPact",
    img: "icons/magic/unholy/silhouette-robe-evil-power.webp",
    shortRest: true
  }
};
preLocalize("spellcastingTypes", { key: "label", sort: true });
preLocalize("spellcastingTypes.leveled.progression", { key: "label" });

/* -------------------------------------------- */

/**
 * Ways in which a class can contribute to spellcasting levels.
 * @enum {string}
 */
ROTV.spellProgression = {
  none: "ROTV.SpellNone",
  full: "ROTV.SpellProgFull",
  half: "ROTV.SpellProgHalf",
  third: "ROTV.SpellProgThird",
  pact: "ROTV.SpellProgPact",
  artificer: "ROTV.SpellProgArt"
};
preLocalize("spellProgression", { key: "label" });

/* -------------------------------------------- */

/**
 * Valid spell levels.
 * @enum {string}
 */
ROTV.spellLevels = {
  0: "ROTV.SpellLevel0",
  1: "ROTV.SpellLevel1",
  2: "ROTV.SpellLevel2",
  3: "ROTV.SpellLevel3",
  4: "ROTV.SpellLevel4",
  5: "ROTV.SpellLevel5",
  6: "ROTV.SpellLevel6",
  7: "ROTV.SpellLevel7",
  8: "ROTV.SpellLevel8",
  9: "ROTV.SpellLevel9"
};
preLocalize("spellLevels");

/* -------------------------------------------- */

/**
 * The available choices for how spell damage scaling may be computed.
 * @enum {string}
 */
ROTV.spellScalingModes = {
  none: "ROTV.SpellNone",
  cantrip: "ROTV.SpellCantrip",
  level: "ROTV.SpellLevel"
};
preLocalize("spellScalingModes", { sort: true });

/* -------------------------------------------- */

/**
 * Configuration data for spell components.
 *
 * @typedef {object} SpellComponentConfiguration
 * @property {string} label         Localized label.
 * @property {string} abbr          Localized abbreviation.
 * @property {string} [reference]   Reference to a rule page describing this component.
 */

/**
 * Types of components that can be required when casting a spell.
 * @deprecated since RotV 3.0, available until RotV 3.3
 * @enum {SpellComponentConfiguration}
 */
ROTV.spellComponents = {
  vocal: {
    label: "ROTV.ComponentVerbal",
    abbr: "ROTV.ComponentVerbalAbbr",
    reference: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.6UXTNWMCQ0nSlwwx"
  },
  somatic: {
    label: "ROTV.ComponentSomatic",
    abbr: "ROTV.ComponentSomaticAbbr",
    reference: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.qwUNgUNilEmZkSC9"
  },
  material: {
    label: "ROTV.ComponentMaterial",
    abbr: "ROTV.ComponentMaterialAbbr",
    reference: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.AeH5eDS4YeM9RETC"
  }
};
preLocalize("spellComponents", { keys: ["label", "abbr"] });

/* -------------------------------------------- */

/**
 * Configuration data for spell tags.
 *
 * @typedef {object} SpellTagConfiguration
 * @property {string} label         Localized label.
 * @property {string} abbr          Localized abbreviation.
 * @property {string} icon          Icon representing this tag.
 * @property {string} [reference]   Reference to a rule page describing this tag.
 */

/**
 * Supplementary rules keywords that inform a spell's use.
 * @deprecated since RotV 3.0, available until RotV 3.3
 * @enum {SpellTagConfiguration}
 */
ROTV.spellTags = {
  concentration: {
    label: "ROTV.Concentration",
    abbr: "ROTV.ConcentrationAbbr",
    icon: "systems/rotv/icons/svg/statuses/concentrating.svg",
    reference: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.ow58p27ctAnr4VPH"
  },
  ritual: {
    label: "ROTV.Ritual",
    abbr: "ROTV.RitualAbbr",
    icon: "systems/rotv/icons/svg/items/spell.svg",
    reference: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.FjWqT5iyJ89kohdA"
  }
};
preLocalize("spellTags", { keys: ["label", "abbr"] });

/* -------------------------------------------- */

/**
 * Configuration data for spell schools.
 *
 * @typedef {object} SpellSchoolConfiguration
 * @property {string} label        Localized label.
 * @property {string} icon         Spell school icon.
 * @property {string} fullKey      Fully written key used as alternate for enrichers.
 * @property {string} [reference]  Reference to a rule page describing this school.
 */

/**
 * Schools to which a spell can belong.
 * @enum {SpellSchoolConfiguration}
 */
ROTV.spellSchools = {
  abj: {
    label: "ROTV.SchoolAbj",
    icon: "systems/rotv/icons/svg/schools/abjuration.svg",
    fullKey: "abjuration",
    reference: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.849AYEWw9FHD6JNz"
  },
  con: {
    label: "ROTV.SchoolCon",
    icon: "systems/rotv/icons/svg/schools/conjuration.svg",
    fullKey: "conjuration",
    reference: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.TWyKMhZJZGqQ6uls"
  },
  div: {
    label: "ROTV.SchoolDiv",
    icon: "systems/rotv/icons/svg/schools/divination.svg",
    fullKey: "divination",
    reference: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.HoD2MwzmVbMqj9se"
  },
  enc: {
    label: "ROTV.SchoolEnc",
    icon: "systems/rotv/icons/svg/schools/enchantment.svg",
    fullKey: "enchantment",
    reference: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.SehPXk24ySBVOwCZ"
  },
  evo: {
    label: "ROTV.SchoolEvo",
    icon: "systems/rotv/icons/svg/schools/evocation.svg",
    fullKey: "evocation",
    reference: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.kGp1RNuxL2SELLRC"
  },
  ill: {
    label: "ROTV.SchoolIll",
    icon: "systems/rotv/icons/svg/schools/illusion.svg",
    fullKey: "illusion",
    reference: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.smEk7kvVyslFozrB"
  },
  nec: {
    label: "ROTV.SchoolNec",
    icon: "systems/rotv/icons/svg/schools/necromancy.svg",
    fullKey: "necromancy",
    reference: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.W0eyiV1FBmngb6Qh"
  },
  trs: {
    label: "ROTV.SchoolTrs",
    icon: "systems/rotv/icons/svg/schools/transmutation.svg",
    fullKey: "transmutation",
    reference: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.IYWewSailtmv6qEb"
  }
};
preLocalize("spellSchools", { key: "label", sort: true });

/* -------------------------------------------- */

/**
 * Types of spell lists.
 * @enum {string}
 */
ROTV.spellListTypes = {
  class: "ITEM.TypeClass",
  subclass: "ITEM.TypeSubclass",
  background: "ITEM.TypeBackground",
  race: "ITEM.TypeRace",
  other: "JOURNALENTRYPAGE.ROTV.SpellList.Type.Other"
};
preLocalize("spellListTypes");

/* -------------------------------------------- */

/**
 * Spell scroll item ID within the `ROTV.sourcePacks` compendium or a full UUID for each spell level.
 * @enum {string}
 */
ROTV.spellScrollIds = {
};

/* -------------------------------------------- */
/*  Weapon Details                              */
/* -------------------------------------------- */

/**
 * The set of types which a weapon item can take.
 * @enum {string}
 */
ROTV.weaponTypes = {
  simpleM: "ROTV.WeaponSimpleM",
  martialM: "ROTV.WeaponMartialM",
  natural: "ROTV.WeaponNatural",
  improv: "ROTV.WeaponImprov",
  assault: "ROTV.WeaponAssault",
  pistol: "ROTV.WeaponPistol",
  shotgun: "ROTV.WeaponShotgun",
  smg: "ROTV.WeaponSMG",
  lmg: "ROTV.WeaponLMG",
  sniper: "ROTV.WeaponSniper",
  grenade: "ROTV.WeaponGrenade",
  grenadeL: "ROTV.WeaponGrenadeLauncher",
  rocketL: "ROTV.WeaponRocketLauncher",
  flamethrower: "ROTV.WeaponFlamethrower",
  shield: "ROTV.WeaponShield",
  lightC: "ROTV.WeaponCannon"
};
preLocalize("weaponTypes");

/* -------------------------------------------- */

/**
 * Compendium packs used for localized items.
 * @enum {string}
 */
ROTV.sourcePacks = {
  BACKGROUNDS: "rotv.backgrounds",
  CLASSES: "rotv.classes",
  ITEMS: "rotv.items",
  RACES: "rotv.races"
};

/* -------------------------------------------- */

/**
 * Settings to configure how actors are merged when polymorphing is applied.
 * @enum {string}
 */
ROTV.polymorphSettings = {
  keepPhysical: "ROTV.PolymorphKeepPhysical",
  keepMental: "ROTV.PolymorphKeepMental",
  keepSaves: "ROTV.PolymorphKeepSaves",
  keepSkills: "ROTV.PolymorphKeepSkills",
  mergeSaves: "ROTV.PolymorphMergeSaves",
  mergeSkills: "ROTV.PolymorphMergeSkills",
  keepClass: "ROTV.PolymorphKeepClass",
  keepFeats: "ROTV.PolymorphKeepFeats",
  keepSpells: "ROTV.PolymorphKeepSpells",
  keepItems: "ROTV.PolymorphKeepItems",
  keepBio: "ROTV.PolymorphKeepBio",
  keepVision: "ROTV.PolymorphKeepVision",
  keepSelf: "ROTV.PolymorphKeepSelf"
};
preLocalize("polymorphSettings", { sort: true });

/**
 * Settings to configure how actors are effects are merged when polymorphing is applied.
 * @enum {string}
 */
ROTV.polymorphEffectSettings = {
  keepAE: "ROTV.PolymorphKeepAE",
  keepOtherOriginAE: "ROTV.PolymorphKeepOtherOriginAE",
  keepOriginAE: "ROTV.PolymorphKeepOriginAE",
  keepEquipmentAE: "ROTV.PolymorphKeepEquipmentAE",
  keepFeatAE: "ROTV.PolymorphKeepFeatureAE",
  keepSpellAE: "ROTV.PolymorphKeepSpellAE",
  keepClassAE: "ROTV.PolymorphKeepClassAE",
  keepBackgroundAE: "ROTV.PolymorphKeepBackgroundAE"
};
preLocalize("polymorphEffectSettings", { sort: true });

/**
 * Settings to configure how actors are merged when preset polymorphing is applied.
 * @enum {object}
 */
ROTV.transformationPresets = {
  wildshape: {
    icon: '<i class="fas fa-paw"></i>',
    label: "ROTV.PolymorphWildShape",
    options: {
      keepBio: true,
      keepClass: true,
      keepFeats: true,
      keepMental: true,
      mergeSaves: true,
      mergeSkills: true,
      keepEquipmentAE: false
    }
  },
  polymorph: {
    icon: '<i class="fas fa-pastafarianism"></i>',
    label: "ROTV.Polymorph",
    options: {
      keepEquipmentAE: false,
      keepClassAE: false,
      keepFeatAE: false,
      keepBackgroundAE: false
    }
  },
  polymorphSelf: {
    icon: '<i class="fas fa-eye"></i>',
    label: "ROTV.PolymorphSelf",
    options: {
      keepSelf: true
    }
  }
};
preLocalize("transformationPresets", { sort: true, keys: ["label"] });

/* -------------------------------------------- */

/**
 * Skill, ability, and tool proficiency levels.
 * The key for each level represents its proficiency multiplier.
 * @enum {string}
 */
ROTV.proficiencyLevels = {
  0: "ROTV.NotProficient",
  1: "ROTV.Proficient",
  0.5: "ROTV.HalfProficient",
  2: "ROTV.Expertise"
};
preLocalize("proficiencyLevels");

/* -------------------------------------------- */

/**
 * Weapon and armor item proficiency levels.
 * @enum {string}
 */
ROTV.weaponAndArmorProficiencyLevels = {
  0: "ROTV.NotProficient",
  1: "ROTV.Proficient"
};
preLocalize("weaponAndArmorProficiencyLevels");

/* -------------------------------------------- */

/**
 * The amount of cover provided by an object. In cases where multiple pieces
 * of cover are in play, we take the highest value.
 * @enum {string}
 */
ROTV.cover = {
  0: "ROTV.None",
  .5: "ROTV.CoverHalf",
  .75: "ROTV.CoverThreeQuarters",
  1: "ROTV.CoverTotal"
};
preLocalize("cover");

/* -------------------------------------------- */

/**
 * A selection of actor attributes that can be tracked on token resource bars.
 * @type {string[]}
 * @deprecated since v10
 */
ROTV.trackableAttributes = [
  "attributes.ac.value", "attributes.damRed", "attributes.init.bonus", "attributes.movement", "attributes.senses", "attributes.spelldc",
  "attributes.spellLevel", "details.cr", "details.spellLevel", "details.xp.value", "skills.*.passive",
  "abilities.*.value"
];

/* -------------------------------------------- */

/**
 * A selection of actor and item attributes that are valid targets for item resource consumption.
 * @type {string[]}
 */
ROTV.consumableResources = [
  // Configured during init.
];

/* -------------------------------------------- */

/**
 * @typedef {object} _StatusEffectConfigRotV
 * @property {string} icon            Icon used to represent the condition on the token.
 * @property {string} [reference]     UUID of a journal entry with details on this condition.
 * @property {string} [special]       Set this condition as a special status effect under this name.
 * @property {string[]} [riders]      Additional conditions, by id, to apply as part of this condition.
 */

/**
 * Configuration data for system status effects.
 * @typedef {Omit<StatusEffectConfig, "img"> & _StatusEffectConfigRotV} StatusEffectConfigRotV
 */

/**
 * @typedef {object} _ConditionConfiguration
 * @property {string} label        Localized label for the condition.
 * @property {boolean} [pseudo]    Is this a pseudo-condition, i.e. one that does not appear in the conditions appendix
 *                                 but acts as a status effect?
 * @property {number} [levels]     The number of levels of exhaustion an actor can obtain.
 */

/**
 * Configuration data for system conditions.
 * @typedef {Omit<StatusEffectConfigRotV, "name"> & _ConditionConfiguration} ConditionConfiguration
 */

/**
 * Conditions that can affect an actor.
 * @enum {ConditionConfiguration}
 */
ROTV.conditionTypes = {
  bleeding: {
    label: "EFFECT.ROTV.StatusBleeding",
    icon: "systems/rotv/icons/svg/statuses/bleeding.svg",
    pseudo: true
  },
  blinded: {
    label: "ROTV.ConBlinded",
    icon: "systems/rotv/icons/svg/statuses/blinded.svg",
    reference: "Compendium.rotv.rules.JournalEntry.w7eitkpD7QQTB6j0.JournalEntryPage.0b8N4FymGGfbZGpJ",
    special: "BLIND"
  },
  charmed: {
    label: "ROTV.ConCharmed",
    icon: "systems/rotv/icons/svg/statuses/charmed.svg",
    reference: "Compendium.rotv.rules.JournalEntry.w7eitkpD7QQTB6j0.JournalEntryPage.zZaEBrKkr66OWJvD"
  },
  cursed: {
    label: "EFFECT.ROTV.StatusCursed",
    icon: "systems/rotv/icons/svg/statuses/cursed.svg",
    pseudo: true
  },
  deafened: {
    label: "ROTV.ConDeafened",
    icon: "systems/rotv/icons/svg/statuses/deafened.svg",
    reference: "Compendium.rotv.rules.JournalEntry.w7eitkpD7QQTB6j0.JournalEntryPage.6G8JSjhn701cBITY"
  },
  diseased: {
    label: "ROTV.ConDiseased",
    icon: "systems/rotv/icons/svg/statuses/diseased.svg",
    pseudo: true,
    reference: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.oNQWvyRZkTOJ8PBq"
  },
  exhaustion: {
    label: "ROTV.ConExhaustion",
    icon: "systems/rotv/icons/svg/statuses/exhaustion.svg",
    reference: "Compendium.rotv.rules.JournalEntry.w7eitkpD7QQTB6j0.JournalEntryPage.cspWveykstnu3Zcv",
    levels: 6
  },
  frightened: {
    label: "ROTV.ConFrightened",
    icon: "systems/rotv/icons/svg/statuses/frightened.svg",
    reference: "Compendium.rotv.rules.JournalEntry.w7eitkpD7QQTB6j0.JournalEntryPage.oreoyaFKnvZCrgij"
  },
  grappled: {
    label: "ROTV.ConGrappled",
    icon: "systems/rotv/icons/svg/statuses/grappled.svg",
    reference: "Compendium.rotv.rules.JournalEntry.w7eitkpD7QQTB6j0.JournalEntryPage.gYDAhd02ryUmtwZn"
  },
  incapacitated: {
    label: "ROTV.ConIncapacitated",
    icon: "systems/rotv/icons/svg/statuses/incapacitated.svg",
    reference: "Compendium.rotv.rules.JournalEntry.w7eitkpD7QQTB6j0.JournalEntryPage.TpkZgLfxCmSndmpb"
  },
  invisible: {
    label: "ROTV.ConInvisible",
    icon: "systems/rotv/icons/svg/statuses/invisible.svg",
    reference: "Compendium.rotv.rules.JournalEntry.w7eitkpD7QQTB6j0.JournalEntryPage.3UU5GCTVeRDbZy9u"
  },
  paralyzed: {
    label: "ROTV.ConParalyzed",
    icon: "systems/rotv/icons/svg/statuses/paralyzed.svg",
    reference: "Compendium.rotv.rules.JournalEntry.w7eitkpD7QQTB6j0.JournalEntryPage.xnSV5hLJIMaTABXP",
    statuses: ["incapacitated"]
  },
  petrified: {
    label: "ROTV.ConPetrified",
    icon: "systems/rotv/icons/svg/statuses/petrified.svg",
    reference: "Compendium.rotv.rules.JournalEntry.w7eitkpD7QQTB6j0.JournalEntryPage.xaNDaW6NwQTgHSmi",
    statuses: ["incapacitated"]
  },
  poisoned: {
    label: "ROTV.ConPoisoned",
    icon: "systems/rotv/icons/svg/statuses/poisoned.svg",
    reference: "Compendium.rotv.rules.JournalEntry.w7eitkpD7QQTB6j0.JournalEntryPage.lq3TRI6ZlED8ABMx"
  },
  prone: {
    label: "ROTV.ConProne",
    icon: "systems/rotv/icons/svg/statuses/prone.svg",
    reference: "Compendium.rotv.rules.JournalEntry.w7eitkpD7QQTB6j0.JournalEntryPage.y0TkcdyoZlOTmAFT"
  },
  restrained: {
    label: "ROTV.ConRestrained",
    icon: "systems/rotv/icons/svg/statuses/restrained.svg",
    reference: "Compendium.rotv.rules.JournalEntry.w7eitkpD7QQTB6j0.JournalEntryPage.cSVcyZyNe2iG1fIc"
  },
  silenced: {
    label: "EFFECT.ROTV.StatusSilenced",
    icon: "systems/rotv/icons/svg/statuses/silenced.svg",
    pseudo: true
  },
  stunned: {
    label: "ROTV.ConStunned",
    icon: "systems/rotv/icons/svg/statuses/stunned.svg",
    reference: "Compendium.rotv.rules.JournalEntry.w7eitkpD7QQTB6j0.JournalEntryPage.ZyZMUwA2rboh4ObS",
    statuses: ["incapacitated"]
  },
  surprised: {
    label: "EFFECT.ROTV.StatusSurprised",
    icon: "systems/rotv/icons/svg/statuses/surprised.svg",
    pseudo: true
  },
  transformed: {
    label: "EFFECT.ROTV.StatusTransformed",
    icon: "systems/rotv/icons/svg/statuses/transformed.svg",
    pseudo: true
  },
  unconscious: {
    label: "ROTV.ConUnconscious",
    icon: "systems/rotv/icons/svg/statuses/unconscious.svg",
    reference: "Compendium.rotv.rules.JournalEntry.w7eitkpD7QQTB6j0.JournalEntryPage.UWw13ISmMxDzmwbd",
    statuses: ["incapacitated"],
    riders: ["prone"]
  }
};
preLocalize("conditionTypes", { key: "label", sort: true });

/* -------------------------------------------- */

/**
 * Various effects of conditions and which conditions apply it. Either keys for the conditions,
 * and with a number appended for a level of exhaustion.
 * @enum {object}
 */
ROTV.conditionEffects = {
  noMovement: new Set(["exhaustion-5", "grappled", "paralyzed", "petrified", "restrained", "stunned", "unconscious"]),
  halfMovement: new Set(["exhaustion-2"]),
  crawl: new Set(["prone", "exceedingCarryingCapacity"]),
  petrification: new Set(["petrified"]),
  halfHealth: new Set(["exhaustion-4"])
};

/* -------------------------------------------- */

/**
 * Extra status effects not specified in `conditionTypes`. If the ID matches a core-provided effect, then this
 * data will be merged into the core data.
 * @enum {Omit<StatusEffectConfigRotV, "img"> & {icon: string}}
 */
ROTV.statusEffects = {
  burrowing: {
    name: "EFFECT.ROTV.StatusBurrowing",
    icon: "systems/rotv/icons/svg/statuses/burrowing.svg",
    special: "BURROW"
  },
  concentrating: {
    name: "EFFECT.ROTV.StatusConcentrating",
    icon: "systems/rotv/icons/svg/statuses/concentrating.svg",
    special: "CONCENTRATING"
  },
  dead: {
    name: "EFFECT.ROTV.StatusDead",
    icon: "systems/rotv/icons/svg/statuses/dead.svg",
    special: "DEFEATED"
  },
  dodging: {
    name: "EFFECT.ROTV.StatusDodging",
    icon: "systems/rotv/icons/svg/statuses/dodging.svg"
  },
  ethereal: {
    name: "EFFECT.ROTV.StatusEthereal",
    icon: "systems/rotv/icons/svg/statuses/ethereal.svg"
  },
  flying: {
    name: "EFFECT.ROTV.StatusFlying",
    icon: "systems/rotv/icons/svg/statuses/flying.svg",
    special: "FLY"
  },
  hiding: {
    name: "EFFECT.ROTV.StatusHiding",
    icon: "systems/rotv/icons/svg/statuses/hiding.svg"
  },
  hovering: {
    name: "EFFECT.ROTV.StatusHovering",
    icon: "systems/rotv/icons/svg/statuses/hovering.svg",
    special: "HOVER"
  },
  marked: {
    name: "EFFECT.ROTV.StatusMarked",
    icon: "systems/rotv/icons/svg/statuses/marked.svg"
  },
  sleeping: {
    name: "EFFECT.ROTV.StatusSleeping",
    icon: "systems/rotv/icons/svg/statuses/sleeping.svg",
    statuses: ["incapacitated", "unconscious"]
  },
  stable: {
    name: "EFFECT.ROTV.StatusStable",
    icon: "systems/rotv/icons/svg/statuses/stable.svg"
  }
};

/* -------------------------------------------- */
/*  Languages                                   */
/* -------------------------------------------- */

/**
 * Languages a character can learn.
 * @enum {string}
 */
ROTV.languages = {
  standard: {
    label: "ROTV.LanguagesCommon",
      common: "ROTV.LanguagesCommon"
    }
};

preLocalize("languages", { key: "label", sort: true });

/* -------------------------------------------- */

/**
 * Maximum allowed character level.
 * @type {number}
 */
ROTV.maxLevel = 20;

/**
 * Maximum ability score value allowed by default.
 * @type {number}
 */
ROTV.maxAbilityScore = 20;

/**
 * XP required to achieve each character level.
 * @type {number[]}
 */
ROTV.CHARACTER_EXP_LEVELS = [
  0, 300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000, 85000, 100000,
  120000, 140000, 165000, 195000, 225000, 265000, 305000, 355000
];

/**
 * XP granted for each challenge rating.
 * @type {number[]}
 */
ROTV.CR_EXP_LEVELS = [
  10, 200, 450, 700, 1100, 1800, 2300, 2900, 3900, 5000, 5900, 7200, 8400, 10000, 11500, 13000, 15000, 18000,
  20000, 22000, 25000, 33000, 41000, 50000, 62000, 75000, 90000, 105000, 120000, 135000, 155000
];

/**
 * @typedef {object} CharacterFlagConfig
 * @property {string} name
 * @property {string} hint
 * @property {string} section
 * @property {typeof boolean|string|number} type
 * @property {string} placeholder
 * @property {string[]} [abilities]
 * @property {Object<string, string>} [choices]
 * @property {string[]} [skills]
 */

/* -------------------------------------------- */

/**
 * Trait configuration information.
 *
 * @typedef {object} TraitConfiguration
 * @property {object} labels
 * @property {string} labels.title         Localization key for the trait name.
 * @property {string} labels.localization  Prefix for a localization key that can be used to generate various
 *                                         plural variants of the trait type.
 * @property {string} icon                 Path to the icon used to represent this trait.
 * @property {string} [actorKeyPath]       If the trait doesn't directly map to an entry as `traits.[key]`, where is
 *                                         this trait's data stored on the actor?
 * @property {string} [configKey]          If the list of trait options doesn't match the name of the trait, where can
 *                                         the options be found within `CONFIG.ROTV`?
 * @property {string} [labelKeyPath]       If config is an enum of objects, where can the label be found?
 * @property {object} [subtypes]           Configuration for traits that take some sort of base item.
 * @property {string} [subtypes.keyPath]   Path to subtype value on base items, should match a category key.
 *                                         Deprecated in favor of the standardized `system.type.value`.
 * @property {string[]} [subtypes.ids]     Key for base item ID objects within `CONFIG.ROTV`.
 * @property {object} [children]           Mapping of category key to an object defining its children.
 * @property {boolean} [sortCategories]    Whether top-level categories should be sorted.
 * @property {boolean} [expertise]         Can an actor receive expertise in this trait?
 */

/**
 * Configurable traits on actors.
 * @enum {TraitConfiguration}
 */
ROTV.traits = {
  saves: {
    labels: {
      title: "ROTV.ClassSaves",
      localization: "ROTV.TraitSavesPlural"
    },
    icon: "systems/rotv/icons/svg/trait-saves.svg",
    actorKeyPath: "system.abilities",
    configKey: "abilities",
    labelKeyPath: "label"
  },
  skills: {
    labels: {
      title: "ROTV.Skills",
      localization: "ROTV.TraitSkillsPlural"
    },
    icon: "systems/rotv/icons/svg/trait-skills.svg",
    actorKeyPath: "system.skills",
    labelKeyPath: "label",
    expertise: true
  },
  languages: {
    labels: {
      title: "ROTV.Languages",
      localization: "ROTV.TraitLanguagesPlural"
    },
    icon: "systems/rotv/icons/svg/trait-languages.svg"
  },
  armor: {
    labels: {
      title: "ROTV.TraitArmorProf",
      localization: "ROTV.TraitArmorPlural"
    },
    icon: "systems/rotv/icons/svg/trait-armor-proficiencies.svg",
    actorKeyPath: "system.traits.armorProf",
    configKey: "armorProficiencies",
    subtypes: { keyPath: "armor.type", ids: ["armorIds", "shieldIds"] }
  },
  weapon: {
    labels: {
      title: "ROTV.TraitWeaponProf",
      localization: "ROTV.TraitWeaponPlural"
    },
    icon: "systems/rotv/icons/svg/trait-weapon-proficiencies.svg",
    actorKeyPath: "system.traits.weaponProf",
    configKey: "weaponProficiencies",
    subtypes: { keyPath: "weaponType", ids: ["weaponIds"] }
  },
  tool: {
    labels: {
      title: "ROTV.TraitToolProf",
      localization: "ROTV.TraitToolPlural"
    },
    icon: "systems/rotv/icons/svg/trait-tool-proficiencies.svg",
    actorKeyPath: "system.tools",
    configKey: "toolProficiencies",
    subtypes: { keyPath: "toolType", ids: ["toolIds"] },
    children: { vehicle: "vehicleTypes" },
    sortCategories: true,
    expertise: true
  },
  di: {
    labels: {
      title: "ROTV.DamImm",
      localization: "ROTV.TraitDIPlural"
    },
    icon: "systems/rotv/icons/svg/trait-damage-immunities.svg",
    configKey: "damageTypes"
  },
  dr: {
    labels: {
      title: "ROTV.DamRes",
      localization: "ROTV.TraitDRPlural"
    },
    icon: "systems/rotv/icons/svg/trait-damage-resistances.svg",
    configKey: "damageTypes"
  },
  dv: {
    labels: {
      title: "ROTV.DamVuln",
      localization: "ROTV.TraitDVPlural"
    },
    icon: "systems/rotv/icons/svg/trait-damage-vulnerabilities.svg",
    configKey: "damageTypes"
  },
  ci: {
    labels: {
      title: "ROTV.ConImm",
      localization: "ROTV.TraitCIPlural"
    },
    icon: "systems/rotv/icons/svg/trait-condition-immunities.svg",
    configKey: "conditionTypes"
  }
};
preLocalize("traits", { key: "labels.title" });

/* -------------------------------------------- */

/**
 * Modes used within a trait advancement.
 * @enum {object}
 */
ROTV.traitModes = {
  default: {
    label: "ROTV.AdvancementTraitModeDefaultLabel",
    hint: "ROTV.AdvancementTraitModeDefaultHint"
  },
  expertise: {
    label: "ROTV.AdvancementTraitModeExpertiseLabel",
    hint: "ROTV.AdvancementTraitModeExpertiseHint"
  },
  forcedExpertise: {
    label: "ROTV.AdvancementTraitModeForceLabel",
    hint: "ROTV.AdvancementTraitModeForceHint"
  },
  upgrade: {
    label: "ROTV.AdvancementTraitModeUpgradeLabel",
    hint: "ROTV.AdvancementTraitModeUpgradeHint"
  }
};
preLocalize("traitModes", { keys: ["label", "hint"] });

/* -------------------------------------------- */

/**
 * Special character flags.
 * @enum {CharacterFlagConfig}
 */
ROTV.characterFlags = {
  initiativeAlert: {
    name: "ROTV.FlagsAlert",
    hint: "ROTV.FlagsAlertHint",
    section: "ROTV.Feats",
    type: Boolean
  }
};
preLocalize("characterFlags", { keys: ["name", "hint", "section"] });

/**
 * Flags allowed on actors. Any flags not in the list may be deleted during a migration.
 * @type {string[]}
 */
ROTV.allowedActorFlags = ["isPolymorphed", "originalActor"].concat(Object.keys(ROTV.characterFlags));

/* -------------------------------------------- */

/**
 * Different types of actor structures that groups can represent.
 * @enum {object}
 */
ROTV.groupTypes = {
  party: "ROTV.Group.TypeParty",
  encounter: "ROTV.Group.TypeEncounter"
};
preLocalize("groupTypes");

/* -------------------------------------------- */

/**
 * Configuration information for advancement types.
 *
 * @typedef {object} AdvancementTypeConfiguration
 * @property {typeof Advancement} documentClass  The advancement's document class.
 * @property {Set<string>} validItemTypes        What item types this advancement can be used with.
 * @property {boolean} [hidden]                  Should this advancement type be hidden in the selection dialog?
 */

const _ALL_ITEM_TYPES = ["background", "class", "race", "subclass"];

/**
 * Advancement types that can be added to items.
 * @enum {AdvancementTypeConfiguration}
 */
ROTV.advancementTypes = {
  AbilityScoreImprovement: {
    documentClass: advancement.AbilityScoreImprovementAdvancement,
    validItemTypes: new Set(["background", "class", "race"])
  },
  HitPoints: {
    documentClass: advancement.HitPointsAdvancement,
    validItemTypes: new Set(["class"])
  },
  ItemChoice: {
    documentClass: advancement.ItemChoiceAdvancement,
    validItemTypes: new Set(_ALL_ITEM_TYPES)
  },
  ItemGrant: {
    documentClass: advancement.ItemGrantAdvancement,
    validItemTypes: new Set(_ALL_ITEM_TYPES)
  },
  ScaleValue: {
    documentClass: advancement.ScaleValueAdvancement,
    validItemTypes: new Set(_ALL_ITEM_TYPES)
  },
  Size: {
    documentClass: advancement.SizeAdvancement,
    validItemTypes: new Set(["race"])
  },
  Trait: {
    documentClass: advancement.TraitAdvancement,
    validItemTypes: new Set(_ALL_ITEM_TYPES)
  }
};

/* -------------------------------------------- */

/**
 * Default artwork configuration for each Document type and sub-type.
 * @type {Record<string, Record<string, string>>}
 */
ROTV.defaultArtwork = {
  Item: {
    background: "systems/rotv/icons/svg/items/background.svg",
    class: "systems/rotv/icons/svg/items/class.svg",
    consumable: "systems/rotv/icons/svg/items/consumable.svg",
    container: "systems/rotv/icons/svg/items/container.svg",
    equipment: "systems/rotv/icons/svg/items/equipment.svg",
    feat: "systems/rotv/icons/svg/items/feature.svg",
    loot: "systems/rotv/icons/svg/items/loot.svg",
    race: "systems/rotv/icons/svg/items/race.svg",
    spell: "systems/rotv/icons/svg/items/spell.svg",
    subclass: "systems/rotv/icons/svg/items/subclass.svg",
    tool: "systems/rotv/icons/svg/items/tool.svg",
    weapon: "systems/rotv/icons/svg/items/weapon.svg"
  }
};

/* -------------------------------------------- */
/*  Rules                                       */
/* -------------------------------------------- */

/**
 * Configuration information for rule types.
 *
 * @typedef {object} RuleTypeConfiguration
 * @property {string} label         Localized label for the rule type.
 * @property {string} [references]  Key path for a configuration object that contains reference data.
 */

/**
 * Types of rules that can be used in rule pages and the &Reference enricher.
 * @enum {RuleTypeConfiguration}
 */
ROTV.ruleTypes = {
  rule: {
    label: "ROTV.Rule.Type.Rule",
    references: "rules"
  },
  ability: {
    label: "ROTV.Ability",
    references: "enrichmentLookup.abilities"
  },
  areaOfEffect: {
    label: "ROTV.AreaOfEffect",
    references: "areaTargetTypes"
  },
  condition: {
    label: "ROTV.Rule.Type.Condition",
    references: "conditionTypes"
  },
  creatureType: {
    label: "ROTV.CreatureType",
    references: "creatureTypes"
  },
  damage: {
    label: "ROTV.DamageType",
    references: "damageTypes"
  },
  skill: {
    label: "ROTV.Skill",
    references: "enrichmentLookup.skills"
  },
  spellComponent: {
    label: "ROTV.SpellComponent",
    references: "itemProperties"
  },
  spellSchool: {
    label: "ROTV.SpellSchool",
    references: "enrichmentLookup.spellSchools"
  },
  spellTag: {
    label: "ROTV.SpellTag",
    references: "itemProperties"
  }
};
preLocalize("ruleTypes", { key: "label" });

/* -------------------------------------------- */

/**
 * List of rules that can be referenced from enrichers.
 * @enum {string}
 */
ROTV.rules = {
  inspiration: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.nkEPI89CiQnOaLYh",
  carryingcapacity: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.1PnjDBKbQJIVyc2t",
  push: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.Hni8DjqLzoqsVjb6",
  lift: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.Hni8DjqLzoqsVjb6",
  drag: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.Hni8DjqLzoqsVjb6",
  encumbrance: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.JwqYf9qb6gJAWZKs",
  hiding: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.plHuoNdS0j3umPNS",
  passiveperception: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.988C2hQNyvqkdbND",
  time: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.eihqNjwpZ3HM4IqY",
  speed: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.HhqeIiSj8sE1v1qZ",
  travelpace: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.eFAISahBloR2X8MX",
  forcedmarch: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.uQWQpRKQ1kWhuvjZ",
  difficultterrainpace: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.hFW5BR2yHHwwgurD",
  climbing: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.KxUXbMrUCIAhv4AF",
  swimming: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.KxUXbMrUCIAhv4AF",
  longjump: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.1U0myNrOvIVBUdJV",
  highjump: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.raPwIkqKSv60ELmy",
  falling: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.kREHL5pgNUOhay9f",
  suffocating: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.BIlnr0xYhqt4TGsi",
  vision: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.O6hamUbI9kVASN8b",
  light: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.O6hamUbI9kVASN8b",
  lightlyobscured: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.MAxtfJyvJV7EpzWN",
  heavilyobscured: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.wPFjfRruboxhtL4b",
  brightlight: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.RnMokVPyKGbbL8vi",
  dimlight: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.n1Ocpbyhr6HhgbCG",
  darkness: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.4dfREIDjG5N4fvxd",
  blindsight: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.sacjsfm9ZXnw4Tqc",
  darkvision: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.ldmA1PbnEGVkmE11",
  tremorsense: "Compendium.rotv.rules.JournalEntry.eVtpEGXjA2tamEIJ.JournalEntryPage.8AIlZ95v54mL531X",
  truesight: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.kNa8rJFbtaTM3Rmk",
  food: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.jayo7XVgGnRCpTW0",
  water: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.iIEI87J7lr2sqtb5",
  resting: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.dpHJXYLigIdEseIb",
  shortrest: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.1s2swI3UsjUUgbt2",
  longrest: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.6cLtjbHn4KV2R7G9",
  surprise: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.YmOt8HderKveA19K",
  initiative: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.RcwElV4GAcVXKWxo",
  bonusaction: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.2fu2CXsDg8gQmGGw",
  reaction: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.2VqLyxMyMxgXe2wC",
  difficultterrain: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.6tqz947qO8vPyxvD",
  beingprone: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.bV8akkBdVUUG21CO",
  droppingprone: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.hwTLpAtSS5OqQsI1",
  standingup: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.hwTLpAtSS5OqQsI1",
  crawling: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.VWG9qe8PUNtS28Pw",
  movingaroundothercreatures: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.9ZWCknaXCOdhyOrX",
  flying: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.0B1fxfmw0a48tPsc",
  size: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.HWHRQVBVG7K0RVVW",
  space: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.WIA5bs3P45PmO3OS",
  squeezing: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.wKtOwagDAiNfVoPS",
  attack: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.u4GQCzoBig20yRLj",
  castaspell: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.GLwN36E4WXn3Cp4Z",
  dash: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.Jqn0MEvq6fduYNo6",
  disengage: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.ZOPRfI48NyjoloEF",
  dodge: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.V1BkwK2HQrtEfa4d",
  help: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.KnrD3u2AnQfmtOWj",
  hide: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.BXlHhE4ZoiFwiXLK",
  ready: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.8xJzZVelP2AmQGfU",
  search: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.5cn1ZTLgQq95vfZx",
  useanobject: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.ljqhJx8Qxu2ivo69",
  attackrolls: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.5wkqEqhbBD5kDeE7",
  unseenattackers: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.5ZJNwEPlsGurecg5",
  unseentargets: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.5ZJNwEPlsGurecg5",
  rangedattacks: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.S9aclVOCbusLE3kC",
  range: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.HjKXuB8ndjcqOds7",
  rangedattacksinclosecombat: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.qEZvxW0NM7ixSQP5",
  meleeattacks: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.GTk6emvzNxl8Oosl",
  reach: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.hgZ5ZN4B3y7tmFlt",
  unarmedstrike: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.xJjJ4lhymAYXAOvO",
  opportunityattacks: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.zeU0NyCyP10lkLg3",
  twoweaponfighting: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.FQTS08uH74A6psL2",
  grappling: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.Sl4bniSPSbyrakM2",
  escapingagrapple: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.2TZKy9YbMN3ZY3h8",
  movingagrappledcreature: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.x5bUdhAD7u5Bt2rg",
  shoving: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.hrdqMF8hRXJdNzJx",
  cover: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.W7f7PcRubNUMIq2S",
  halfcover: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.hv0J61IAfofuhy3Q",
  threequarterscover: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.zAMStUjUrPV10dFm",
  totalcover: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.BKUAxXuPEzxiEOeL",
  hitpoints: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.PFbzoMBviI2DD9QP",
  damagerolls: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.hd26AqKrCqtcQBWy",
  criticalhits: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.gFL1VhSEljL1zvje",
  damagetypes: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.jVOgf7DNEhkzYNIe",
  damageresistance: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.v0WE18nT5SJO8Ft7",
  damagevulnerability: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.v0WE18nT5SJO8Ft7",
  healing: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.ICketFqbFslqKiX9",
  instantdeath: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.8BG05mA0mEzwmrHU",
  deathsavingthrows: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.JL8LePEJQYFdNuLL",
  deathsaves: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.JL8LePEJQYFdNuLL",
  stabilizing: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.r1CgZXLcqFop6Dlx",
  knockingacreatureout: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.uEwjgKGuCRTNADYv",
  temporaryhitpoints: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.AW6HpJZHqxfESXaq",
  temphp: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.AW6HpJZHqxfESXaq",
  mounting: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.MFpyvUIdcBpC9kIE",
  dismounting: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.MFpyvUIdcBpC9kIE",
  controllingamount: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.khmR2xFk1NxoQUgZ",
  underwatercombat: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.6zVOeLyq4iMnrQT4",
  spelllevel: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.A6k5fS0kFqPXTW3v",
  knownspells: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.oezg742GlxmEwT85",
  preparedspells: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.oezg742GlxmEwT85",
  spellslots: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.Su6wbb0O9UN4ZDIH",
  castingatahigherlevel: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.4H9SLM95OCLfFizz",
  upcasting: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.4H9SLM95OCLfFizz",
  castinginarmor: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.z4A8vHSK2pb8YA9X",
  cantrips: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.jZD5mCTnMPJ9jW67",
  rituals: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.FjWqT5iyJ89kohdA",
  castingtime: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.zRVW8Tvyk6BECjZD",
  bonusactioncasting: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.RP1WL9FXI3aknlxZ",
  reactioncasting: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.t62lCfinwU9H7Lji",
  longercastingtimes: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.gOAIRFCyPUx42axn",
  spellrange: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.RBYPyE5z5hAZSbH6",
  components: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.xeHthAF9lxfn2tII",
  verbal: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.6UXTNWMCQ0nSlwwx",
  spellduration: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.9mp0SRsptjvJcq1e",
  instantaneous: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.kdlgZOpRMB6bGCod",
  concentrating: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.ow58p27ctAnr4VPH",
  spelltargets: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.G80AIQr04sxdVpw4",
  areaofeffect: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.wvtCeGHgnUmh0cuj",
  pointoforigin: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.8HxbRceQQUAhyWRt",
  spellsavingthrows: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.8DajfNll90eeKcmB",
  spellattackrolls: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.qAFzmGZKhVvAEUF3",
  combiningmagicaleffects: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.TMIN963hG773yZzO",
  schoolsofmagic: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.TeF6CKMDRpYpsLd4",
  detectingtraps: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.DZ7AhdQ94xggG4bj",
  disablingtraps: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.DZ7AhdQ94xggG4bj",
  curingmadness: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.6Icem7G3CICdNOkM",
  damagethreshold: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.9LJZhqvCburpags3",
  poisontypes: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.I6OMMWUaYCWR9xip",
  contactpoison: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.kXnCEqqGUWRZeZDj",
  ingestedpoison: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.Y0vsJYSWeQcFpJ27",
  inhaledpoison: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.KUyN4eK1xTBzXsjP",
  injurypoison: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.LUL48OUq6SJeMGc7",
  attunement: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.UQ65OwIyGK65eiOK",
  wearingitems: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.iPB8mGKuQx3X0Z2J",
  wieldingitems: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.iPB8mGKuQx3X0Z2J",
  multipleitemsofthesamekind: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.rLJdvz4Mde8GkEYQ",
  paireditems: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.rd9pCH8yFraSGN34",
  commandword: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.HiXixxLYesv6Ff3t",
  consumables: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.UEPAcZFzQ5x196zE",
  itemspells: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.DABoaeeF6w31UCsj",
  charges: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.NLRXcgrpRCfsA5mO",
  spellscroll: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.gi8IKhtOlBVhMJrN",
  creaturetags: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.9jV1fFF163dr68vd",
  telepathy: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.geTidcFIYWuUvD2L",
  legendaryactions: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.C1awOyZh78pq1xmY",
  lairactions: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.07PtjpMxiRIhkBEp",
  regionaleffects: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.uj8W27NKFyzygPUd",
  disease: "Compendium.rotv.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.oNQWvyRZkTOJ8PBq"
};

/* -------------------------------------------- */
/*  Token Rings Framework                       */
/* -------------------------------------------- */

/**
 * Token Rings configuration data
 *
 * @typedef {object} TokenRingsConfiguration
 * @property {Record<string, string>} effects        Localized names of the configurable ring effects.
 * @property {string} spriteSheet                    The sprite sheet json source.
 * @property {typeof BaseSamplerShader} shaderClass  The shader class definition associated with the token ring.
 */

/**
 * @type {TokenRingsConfiguration}
 */
ROTV.tokenRings = {
  effects: {
    RING_PULSE: "ROTV.TokenRings.Effects.RingPulse",
    RING_GRADIENT: "ROTV.TokenRings.Effects.RingGradient",
    BKG_WAVE: "ROTV.TokenRings.Effects.BackgroundWave"
  },
  spriteSheet: "systems/rotv/tokens/composite/token-rings.json",
  shaderClass: null
};
preLocalize("tokenRings.effects");

/* -------------------------------------------- */
/*  Sources                                     */
/* -------------------------------------------- */

/**
 * List of books available as sources.
 * @enum {string}
 */
ROTV.sourceBooks = {
  "SRD 5.1": "SOURCE.BOOK.SRD"
};
preLocalize("sourceBooks", { sort: true });

/* -------------------------------------------- */
/*  Themes                                      */
/* -------------------------------------------- */

/**
 * Themes that can be set for the system or on sheets.
 * @enum {string}
 */
ROTV.themes = {
  light: "SHEETS.ROTV.THEME.Light",
  dark: "SHEETS.ROTV.THEME.Dark"
};
preLocalize("themes");

/* -------------------------------------------- */
/*  Enrichment                                  */
/* -------------------------------------------- */

let _enrichmentLookup;
Object.defineProperty(ROTV, "enrichmentLookup", {
  get() {
    const slugify = value => value?.slugify().replaceAll("-", "");
    if ( !_enrichmentLookup ) {
      _enrichmentLookup = {
        abilities: foundry.utils.deepClone(ROTV.abilities),
        skills: foundry.utils.deepClone(ROTV.skills),
        spellSchools: foundry.utils.deepClone(ROTV.spellSchools),
        tools: foundry.utils.deepClone(ROTV.toolIds)
      };
      const addFullKeys = key => Object.entries(ROTV[key]).forEach(([k, v]) =>
        _enrichmentLookup[key][slugify(v.fullKey)] = { ...v, key: k }
      );
      addFullKeys("abilities");
      addFullKeys("skills");
      addFullKeys("spellSchools");
    }
    return _enrichmentLookup;
  },
  enumerable: true
});

/* -------------------------------------------- */

/**
 * Patch an existing config enum to allow conversion from string values to object values without
 * breaking existing modules that are expecting strings.
 * @param {string} key          Key within ROTV that has been replaced with an enum of objects.
 * @param {string} fallbackKey  Key within the new config object from which to get the fallback value.
 * @param {object} [options]    Additional options passed through to logCompatibilityWarning.
 */
function patchConfig(key, fallbackKey, options) {
  /** @override */
  function toString() {
    const message = `The value of CONFIG.ROTV.${key} has been changed to an object.`
      +` The former value can be acccessed from .${fallbackKey}.`;
    foundry.utils.logCompatibilityWarning(message, options);
    return this[fallbackKey];
  }

  Object.values(ROTV[key]).forEach(o => {
    if ( foundry.utils.getType(o) !== "Object" ) return;
    Object.defineProperty(o, "toString", {value: toString});
  });
}

/* -------------------------------------------- */

export default ROTV;
