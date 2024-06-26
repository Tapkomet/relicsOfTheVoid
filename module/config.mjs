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
 * The set of Ability Scores used within the system.
 * @enum {string}
 */
ROTV.abilities = {
  str: "ROTV.AbilityStr",
  dex: "ROTV.AbilityDex",
  con: "ROTV.AbilityCon",
  int: "ROTV.AbilityInt",
  wis: "ROTV.AbilityWis",
  cha: "ROTV.AbilityCha"
};
preLocalize("abilities");

/**
 * Localized abbreviations for Ability Scores.
 * @enum {string}
 */
ROTV.abilityAbbreviations = {
  str: "ROTV.AbilityStrAbbr",
  dex: "ROTV.AbilityDexAbbr",
  con: "ROTV.AbilityConAbbr",
  int: "ROTV.AbilityIntAbbr",
  wis: "ROTV.AbilityWisAbbr",
  cha: "ROTV.AbilityChaAbbr"
};
preLocalize("abilityAbbreviations");

/**
 * Configure which ability score is used as the default modifier for initiative rolls.
 * @type {string}
 */
ROTV.initiativeAbility = "dex";

/**
 * Configure which ability score is used when calculating hit points per level.
 * @type {string}
 */
ROTV.hitPointsAbility = "str";

/* -------------------------------------------- */

/**
 * Configuration data for skills.
 *
 * @typedef {object} SkillConfiguration
 * @property {string} label    Localized label.
 * @property {string} ability  Key for the default ability used by this skill.
 */

/**
 * The set of skill which can be trained with their default ability scores.
 * @enum {SkillConfiguration}
 */
ROTV.skills = {
  dec: { label: "ROTV.SkillDec", ability: "cha" },
  env: { label: "ROTV.SkillEnv", ability: "int" },
  han: { label: "ROTV.SkillHan", ability: "dex" },
  ins: { label: "ROTV.SkillIns", ability: "wis" },
  itm: { label: "ROTV.SkillItm", ability: "cha" },
  med: { label: "ROTV.SkillMed", ability: "int" },
  org: { label: "ROTV.SkillOrg", ability: "int" },
  prc: { label: "ROTV.SkillPrc", ability: "wis" },
  per: { label: "ROTV.SkillPer", ability: "cha" },
  php: { label: "ROTV.SkillPhp", ability: "str" },
  ste: { label: "ROTV.SkillSte", ability: "dex" },
  sur: { label: "ROTV.SkillSur", ability: "wis" },
  tch: { label: "ROTV.SkillTch", ability: "int" }
};
preLocalize("skills", { key: "label", sort: true });
patchConfig("skills", "label", { since: 2.0, until: 2.2 });

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
 * @enum {number}
 */
ROTV.attunementTypes = {
  NONE: 0,
  REQUIRED: 1,
  ATTUNED: 2
};

/**
 * An enumeration of item attunement states.
 * @type {{"0": string, "1": string, "2": string}}
 */
ROTV.attunements = {
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
 * The basic weapon types in Relics. This enables specific weapon proficiencies or
 * starting equipment provided by classes and backgrounds.
 * @enum {string}
 */
ROTV.weaponIds = {
};

/* -------------------------------------------- */

/**
 * The categories into which Tool items can be grouped.
 *
 * @enum {string}
 */
ROTV.toolTypes = {
  art: "ROTV.ToolArtisans",
  game: "ROTV.ToolGamingSet",
  music: "ROTV.ToolMusicalInstrument"
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
 * The basic tool types in Relics. This enables specific tool proficiencies or
 * starting equipment provided by classes and backgrounds.
 * @enum {string}
 */
ROTV.toolIds = {
};

/* -------------------------------------------- */

/**
 * The various lengths of time over which effects can occur.
 * @enum {string}
 */
ROTV.timePeriods = {
  inst: "ROTV.TimeInst",
  turn: "ROTV.TimeTurn",
  round: "ROTV.TimeRound",
  minute: "ROTV.TimeMinute",
  hour: "ROTV.TimeHour",
  day: "ROTV.TimeDay",
  month: "ROTV.TimeMonth",
  year: "ROTV.TimeYear",
  perm: "ROTV.TimePerm",
  spec: "ROTV.Special"
};
preLocalize("timePeriods");

/* -------------------------------------------- */

/**
 * Various ways in which an item or ability can be activated.
 * @enum {string}
 */
ROTV.abilityActivationTypes = {
  action: "ROTV.Action",
  bonus: "ROTV.BonusAction",
  reaction: "ROTV.Reaction",
  minute: ROTV.timePeriods.minute,
  hour: ROTV.timePeriods.hour,
  day: ROTV.timePeriods.day,
  special: ROTV.timePeriods.spec,
  legendary: "ROTV.LegendaryActionLabel",
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
 * Creature sizes.
 * @enum {string}
 */
ROTV.actorSizes = {
  tiny: "ROTV.SizeTiny",
  sm: "ROTV.SizeSmall",
  med: "ROTV.SizeMedium",
  lg: "ROTV.SizeLarge",
  huge: "ROTV.SizeHuge",
  grg: "ROTV.SizeGargantuan"
};
preLocalize("actorSizes");

/**
 * Default token image size for the values of `ROTV.actorSizes`.
 * @enum {number}
 */
ROTV.tokenSizes = {
  tiny: 0.5,
  sm: 1,
  med: 1,
  lg: 2,
  huge: 3,
  grg: 4
};

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
 * Default types of creatures.
 * *Note: Not pre-localized to allow for easy fetching of pluralized forms.*
 * @enum {string}
 */
ROTV.creatureTypes = {
  aberration: "ROTV.CreatureAberration",
  beast: "ROTV.CreatureBeast",
  celestial: "ROTV.CreatureCelestial",
  construct: "ROTV.CreatureConstruct",
  dragon: "ROTV.CreatureDragon",
  elemental: "ROTV.CreatureElemental",
  fey: "ROTV.CreatureFey",
  fiend: "ROTV.CreatureFiend",
  giant: "ROTV.CreatureGiant",
  humanoid: "ROTV.CreatureHumanoid",
  monstrosity: "ROTV.CreatureMonstrosity",
  ooze: "ROTV.CreatureOoze",
  plant: "ROTV.CreaturePlant",
  undead: "ROTV.CreatureUndead"
};

/* -------------------------------------------- */

/**
 * Classification types for item action types.
 * @enum {string}
 */
ROTV.itemActionTypes = {
  mwak: "ROTV.ActionMWAK",
  rwak: "ROTV.ActionRWAK",
  save: "ROTV.ActionSave",
  heal: "ROTV.ActionHeal",
  abil: "ROTV.ActionAbil",
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
 * Enumerate the lengths of time over which an item can have limited use ability.
 * @enum {string}
 */
ROTV.limitedUsePeriods = {
  sr: "ROTV.ShortRest",
  lr: "ROTV.LongRest",
  day: "ROTV.Day",
  charges: "ROTV.Charges"
};
preLocalize("limitedUsePeriods");

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
  utilityGear: "ROTV.UtilityGear",
  attachment: "ROTV.EquipmentAttachment",
  vehicle: "ROTV.EquipmentVehicle"
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
  lgt: ROTV.equipmentTypes.light,
  med: ROTV.equipmentTypes.medium,
  hvy: ROTV.equipmentTypes.heavy,
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
 * The basic armor types in Relics. This enables specific armor proficiencies,
 * automated AC calculation in NPCs, and starting equipment.
 * @enum {string}
 */
ROTV.armorIds = {
};

/**
 * The basic shield in Relics.
 * @enum {string}
 */
ROTV.shieldIds = {
  shield: "sSs3hSzkKBMNBgTs"
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
 * Enumerate the valid consumable types which are recognized by the system.
 * @enum {string}
 */
ROTV.consumableTypes = {
  ammo: "ROTV.ConsumableAmmo",
  potion: "ROTV.ConsumablePotion",
  food: "ROTV.ConsumableFood",
  wand: "ROTV.ConsumableWand",
  trinket: "ROTV.ConsumableTrinket"
};
preLocalize("consumableTypes", { sort: true });

/* -------------------------------------------- */

/**
 * Configuration data for an item with the "feature" type.
 *
 * @typedef {object} FeatureTypeConfiguration
 * @property {string} label                       Localized label for this type.
 * @property {Object<string, string>} [subtypes]  Enum containing localized labels for subtypes.
 */

/**
 * Types of "features" items.
 * @enum {FeatureTypeConfiguration}
 */
ROTV.featureTypes = {
  background: {
    label: "ROTV.Feature.Background"
  },
  class: {
    label: "ROTV.Feature.Class",
    subtypes: {
      artificerInfusion: "ROTV.ClassFeature.ArtificerInfusion",
      channelDivinity: "ROTV.ClassFeature.ChannelDivinity",
      defensiveTactic: "ROTV.ClassFeature.DefensiveTactic",
      eldritchInvocation: "ROTV.ClassFeature.EldritchInvocation",
      elementalDiscipline: "ROTV.ClassFeature.ElementalDiscipline",
      fightingStyle: "ROTV.ClassFeature.FightingStyle",
      huntersPrey: "ROTV.ClassFeature.HuntersPrey",
      ki: "ROTV.ClassFeature.Ki",
      maneuver: "ROTV.ClassFeature.Maneuver",
      metamagic: "ROTV.ClassFeature.Metamagic",
      multiattack: "ROTV.ClassFeature.Multiattack",
      pact: "ROTV.ClassFeature.PactBoon",
      psionicPower: "ROTV.ClassFeature.PsionicPower",
      rune: "ROTV.ClassFeature.Rune",
      superiorHuntersDefense: "ROTV.ClassFeature.SuperiorHuntersDefense"
    }
  },
  monster: {
    label: "ROTV.Feature.Monster"
  },
  race: {
    label: "ROTV.Feature.Race"
  },
  feat: {
    label: "ROTV.Feature.Feat"
  }
};
preLocalize("featureTypes", { key: "label" });
preLocalize("featureTypes.class.subtypes", { sort: true });

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
 * Types of damage that are considered physical.
 * @enum {string}
 */
ROTV.physicalDamageTypes = {
  normal: "ROTV.DamageNormal",
};
preLocalize("physicalDamageTypes", { sort: true });

/* -------------------------------------------- */

/**
 * Types of damage the can be caused by abilities.
 * @enum {string}
 */
ROTV.damageTypes = {
  ...ROTV.physicalDamageTypes,
  fire: "ROTV.DamageFire",
  toxic: "ROTV.DamageToxic",
  falling: "ROTV.DamageFalling",
  psychic: "ROTV.DamagePsychic"
};
preLocalize("damageTypes", { sort: true });

/* -------------------------------------------- */

/**
 * Types of damage to which an actor can possess resistance, immunity, or vulnerability.
 * @enum {string}
 * @deprecated
 */
ROTV.damageResistanceTypes = {
  ...ROTV.damageTypes
};
preLocalize("damageResistanceTypes", { sort: true });

/* -------------------------------------------- */
/*  Movement                                    */
/* -------------------------------------------- */

/**
 * Different types of healing that can be applied using abilities.
 * @enum {string}
 */
ROTV.healingTypes = {
  healing: "ROTV.Healing",
  temphp: "ROTV.HealingTemp"
};
preLocalize("healingTypes");

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
 * Configure aspects of encumbrance calculation so that it could be configured by modules.
 * @enum {{ imperial: number, metric: number }}
 */
ROTV.encumbrance = {
  currencyPerWeight: {
    imperial: 10000,
    metric: 10000
  },
  strMultiplier: {
    imperial: 1,
    metric: 1
  },
  vehicleWeightMultiplier: {
    imperial: 2000, // 2000 lbs in an imperial ton
    metric: 1000 // 1000 kg in a metric ton
  }
};

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
  space: "ROTV.TargetSpace"
};
preLocalize("individualTargetTypes");

/* -------------------------------------------- */

/**
 * Information needed to represent different area of effect target types.
 *
 * @typedef {object} AreaTargetDefinition
 * @property {string} label     Localized label for this type.
 * @property {string} template  Type of `MeasuredTemplate` create for this target type.
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
    template: "circle"
  },
  cylinder: {
    label: "ROTV.TargetCylinder",
    template: "circle"
  },
  cone: {
    label: "ROTV.TargetCone",
    template: "cone"
  },
  square: {
    label: "ROTV.TargetSquare",
    template: "rect"
  },
  cube: {
    label: "ROTV.TargetCube",
    template: "rect"
  },
  line: {
    label: "ROTV.TargetLine",
    template: "ray"
  },
  wall: {
    label: "ROTV.TargetWall",
    template: "ray"
  }
};
preLocalize("areaTargetTypes", { key: "label", sort: true });
patchConfig("areaTargetTypes", "template", { since: 2.0, until: 2.2 });

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
 * Various different ways a spell can be prepared.
 */
ROTV.spellPreparationModes = {
  prepared: "ROTV.SpellPrepPrepared",
  pact: "ROTV.PactMagic",
  always: "ROTV.SpellPrepAlways",
  atwill: "ROTV.SpellPrepAtWill",
  innate: "ROTV.SpellPrepInnate"
};
preLocalize("spellPreparationModes");

/* -------------------------------------------- */

/**
 * Subset of `ROTV.spellPreparationModes` that consume spell slots.
 * @type {boolean[]}
 */
ROTV.spellUpcastModes = ["always", "pact", "prepared"];

/* -------------------------------------------- */

/**
 * Configuration data for different types of spellcasting supported.
 *
 * @typedef {object} SpellcastingTypeConfiguration
 * @property {string} label                                                        Localized label.
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
    label: "ROTV.SpellProgPact"
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
 * Types of components that can be required when casting a spell.
 * @enum {object}
 */
ROTV.spellComponents = {
  vocal: {
    label: "ROTV.ComponentVerbal",
    abbr: "ROTV.ComponentVerbalAbbr"
  },
  somatic: {
    label: "ROTV.ComponentSomatic",
    abbr: "ROTV.ComponentSomaticAbbr"
  },
  material: {
    label: "ROTV.ComponentMaterial",
    abbr: "ROTV.ComponentMaterialAbbr"
  }
};
preLocalize("spellComponents", {keys: ["label", "abbr"]});

/* -------------------------------------------- */

/**
 * Supplementary rules keywords that inform a spell's use.
 * @enum {object}
 */
ROTV.spellTags = {
  concentration: {
    label: "ROTV.Concentration",
    abbr: "ROTV.ConcentrationAbbr"
  },
  ritual: {
    label: "ROTV.Ritual",
    abbr: "ROTV.RitualAbbr"
  }
};
preLocalize("spellTags", {keys: ["label", "abbr"]});

/* -------------------------------------------- */

/**
 * Schools to which a spell can belong.
 * @enum {string}
 */
ROTV.spellSchools = {
  abj: "ROTV.SchoolAbj",
  con: "ROTV.SchoolCon",
  div: "ROTV.SchoolDiv",
  enc: "ROTV.SchoolEnc",
  evo: "ROTV.SchoolEvo",
  ill: "ROTV.SchoolIll",
  nec: "ROTV.SchoolNec",
  trs: "ROTV.SchoolTrs"
};
preLocalize("spellSchools", { sort: true });

/* -------------------------------------------- */

/**
 * Spell scroll item ID within the `ROTV.sourcePacks` compendium for each level.
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
 * A subset of weapon properties that determine the physical characteristics of the weapon.
 * These properties are used for determining physical resistance bypasses.
 * @enum {string}
 */
ROTV.physicalWeaponProperties = {
};
preLocalize("physicalWeaponProperties", { sort: true });

/* -------------------------------------------- */

/**
 * The set of weapon property flags which can exist on a weapon.
 * @enum {string}
 */
ROTV.weaponProperties = {
  ...ROTV.physicalWeaponProperties,
    asa: "ROTV.WeaponPropertiesAreaSup",
    arp: "ROTV.WeaponPropertiesAP",
    aut: "ROTV.WeaponPropertiesAuto",
    bla: "ROTV.WeaponPropertiesBlast",
    bob: "ROTV.WeaponPropertiesBothB",
    buc: "ROTV.WeaponPropertiesBuckshot",
    bon: "ROTV.WeaponPropertiesBuckshotOnly",
    bur: "ROTV.WeaponPropertiesBursting",
    dam: "ROTV.WeaponPropertiesDamaged",
    ded: "ROTV.WeaponPropertiesDestroyed",
    des: "ROTV.WeaponPropertiesDestructive",
    dis: "ROTV.WeaponPropertiesDisorienting",
    emp: "ROTV.WeaponPropertiesEMP",
    fin: "ROTV.WeaponPropertiesFin",
    fla: "ROTV.WeaponPropertiesFlame",
    fsf: "ROTV.WeaponPropertiesFireSurface",
    ina: "ROTV.WeaponPropertiesInacc",
    oha: "ROTV.WeaponPropertiesOne",
    ovc: "ROTV.WeaponPropertiesOvercharge",
    pen: "ROTV.WeaponPropertiesPenetration",
    rpd: "ROTV.WeaponPropertiesRapid",
    shd: "ROTV.WeaponPropertiesShield",
    shc: "ROTV.WeaponPropertiesShocking",
    shm: "ROTV.WeaponPropertiesShockMode",
    smk: "ROTV.WeaponPropertiesSmoke",
    sda: "ROTV.WeaponPropertiesSidearm",
    spc: "ROTV.WeaponPropertiesSpc",
    spr: "ROTV.WeaponPropertiesSpray",
    stc: "ROTV.WeaponPropertiesSticky",
    sup: "ROTV.WeaponPropertiesSuppressive",
    unr: "ROTV.WeaponPropertiesUnreliable",
    unw: "ROTV.WeaponPropertiesUnwieldy",
    cha: "ROTV.WeaponPropertiesChain",
    grs: "ROTV.WeaponPropertiesGyroStab",
    lsg: "ROTV.WeaponPropertiesLasgun",
    mlt: "ROTV.WeaponPropertiesMelta",
    thr: "ROTV.WeaponPropertiesThr",
    ver: "ROTV.WeaponPropertiesVer"
};
preLocalize("weaponProperties", { sort: true });



/* -------------------------------------------- */

/**
 * The set of weapon property flags which can exist on a weapon.
 * @enum {string}
 */
ROTV.equipmentProperties = {
  blk: "ROTV.EquipmentPropertiesBulky",
  csh: "ROTV.EquipmentPropertiesCushioned",
  dam: "ROTV.EquipmentPropertiesDamaged",
  ded: "ROTV.EquipmentPropertiesDestroyed",
  frq: "ROTV.EquipmentPropertiesFitnessRequirement",
  pow: "ROTV.EquipmentPropertiesPonderous",
  sld: "ROTV.EquipmentPropertiesSealed",
  spc: "ROTV.EquipmentPropertiesSpc"
};
preLocalize("equipmentProperties", { sort: true });



/* -------------------------------------------- */

/**
 * Compendium packs used for localized items.
 * @enum {string}
 */
ROTV.sourcePacks = {
  ITEMS: "rotv.items"
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
 */
ROTV.trackableAttributes = [
  "attributes.ac.value","attributes.damRed", "attributes.init.bonus", "attributes.movement", "attributes.senses", "attributes.spelldc",
  "attributes.spellLevel", "details.cr", "details.spellLevel", "details.xp.value", "skills.*.passive",
  "abilities.*.value"
];

/* -------------------------------------------- */

/**
 * A selection of actor and item attributes that are valid targets for item resource consumption.
 * @type {string[]}
 */
ROTV.consumableResources = [
  "item.quantity", "item.weight", "item.duration.value", "currency", "details.xp.value", "abilities.*.value",
  "attributes.senses", "attributes.movement", "attributes.ac.flat", "item.armor.value","item.damRed", "item.target", "item.range",
  "item.save.dc"
];

/* -------------------------------------------- */

/**
 * Conditions that can effect an actor.
 * @enum {string}
 */
ROTV.conditionTypes = {
  blinded: "ROTV.ConBlinded",
  charmed: "ROTV.ConCharmed",
  deafened: "ROTV.ConDeafened",
  diseased: "ROTV.ConDiseased",
  engaged: "ROTV.ConEngaged",
  frightened: "ROTV.ConFrightened",
  grappled: "ROTV.ConGrappled",
  invisible: "ROTV.ConInvisible",
  paralyzed: "ROTV.ConParalyzed",
  petrified: "ROTV.ConPetrified",
  poisoned: "ROTV.ConPoisoned",
  prone: "ROTV.ConProne",
  restrained: "ROTV.ConRestrained",
  stunned: "ROTV.ConStunned",
  unconscious: "ROTV.ConUnconscious"
};
preLocalize("conditionTypes", { sort: true });

/**
 * Languages a character can learn.
 * @enum {string}
 */
ROTV.languages = {
  common: "ROTV.LanguagesCommon"
};
preLocalize("languages", { sort: true });

/**
 * Maximum allowed character level.
 * @type {number}
 */
ROTV.maxLevel = 20;

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
 * @property {string} label               Localization key for the trait name.
 * @property {string} [actorKeyPath]      If the trait doesn't directly map to an entry as `traits.[key]`, where is
 *                                        this trait's data stored on the actor?
 * @property {string} [configKey]         If the list of trait options doesn't match the name of the trait, where can
 *                                        the options be found within `CONFIG.ROTV`?
 * @property {string} [labelKey]          If config is an enum of objects, where can the label be found?
 * @property {object} [subtypes]          Configuration for traits that take some sort of base item.
 * @property {string} [subtypes.keyPath]  Path to subtype value on base items, should match a category key.
 * @property {string[]} [subtypes.ids]    Key for base item ID objects within `CONFIG.ROTV`.
 * @property {object} [children]          Mapping of category key to an object defining its children.
 * @property {boolean} [sortCategories]   Whether top-level categories should be sorted.
 */

/**
 * Configurable traits on actors.
 * @enum {TraitConfiguration}
 */
ROTV.traits = {
  saves: {
    label: "ROTV.ClassSaves",
    configKey: "abilities"
  },
  skills: {
    label: "ROTV.TraitSkillProf",
    labelKey: "label"
  },
  languages: {
    label: "ROTV.Languages"
  },
  di: {
    label: "ROTV.DamImm",
    configKey: "damageTypes"
  },
  dr: {
    label: "ROTV.DamRes",
    configKey: "damageTypes"
  },
  dv: {
    label: "ROTV.DamVuln",
    configKey: "damageTypes"
  },
  ci: {
    label: "ROTV.ConImm",
    configKey: "conditionTypes"
  },
  weapon: {
    label: "ROTV.TraitWeaponProf",
    actorKeyPath: "traits.weaponProf",
    configKey: "weaponProficiencies",
    subtypes: { keyPath: "weaponType", ids: ["weaponIds"] }
  },
  armor: {
    label: "ROTV.TraitArmorProf",
    actorKeyPath: "traits.armorProf",
    configKey: "armorProficiencies",
    subtypes: { keyPath: "armor.type", ids: ["armorIds", "shieldIds"] }
  },
  tool: {
    label: "ROTV.TraitToolProf",
    actorKeyPath: "traits.toolProf",
    configKey: "toolProficiencies",
    subtypes: { keyPath: "toolType", ids: ["toolIds"] },
    children: { vehicle: "vehicleTypes" },
    sortCategories: true
  }
};
preLocalize("traits", { key: "label" });

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
 * Advancement types that can be added to items.
 * @enum {*}
 */
ROTV.advancementTypes = {
  HitPoints: advancement.HitPointsAdvancement,
  ItemGrant: advancement.ItemGrantAdvancement,
  ScaleValue: advancement.ScaleValueAdvancement
};

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

  Object.values(ROTV[key]).forEach(o => o.toString = toString);
}

/* -------------------------------------------- */

export default ROTV;
