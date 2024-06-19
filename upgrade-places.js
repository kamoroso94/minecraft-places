const PLACES_VERSION = '1.20';

/** Creates a default instance of places data. */
export function createDefaultPlaces() {
  return {places: [], version: PLACES_VERSION};
}

/** Maps pre-1.14 biome indicies to their 1.20 equivalents. */
const upgradeTable = new Map([
  ['127', '0'], // void -> the_void
  ['1', '1'], // plains -> plains
  ['129', '2'], // mutated_plains -> sunflower_plains
  ['12', '3'], // ice_flats -> snowy_tundra -> snowy_plains
  ['13', '3'], // snowy_mountains -> snowy_plains
  ['140', '4'], // mutated_ice_flats -> ice_spikes
  ['2', '5'], // desert -> desert
  ['17', '5'], // desert_hills -> desert
  ['130', '5'], // mutated_desert -> desert_lakes -> desert
  ['6', '6'], // swampland -> swamp
  ['134', '6'], // mutated_swampland -> swamp_hills -> swamp
  ['4', '8'], // forest -> forest
  ['18', '8'], // forest_hills -> wooded_hills -> forest
  ['132', '9'], // mutated_forest -> flower_forest
  ['27', '10'], // birch_forest -> birch_forest
  ['28', '10'], // birch_forest_hills -> birch_forest
  ['29', '11'], // roofed_forest -> dark_forest
  ['157', '11'], // mutated_roofed_forest -> dark_forest_hills -> dark_forest
  ['155', '12'], // mutated_birch_forest -> tall_birch_forest -> old_growth_birch_forest
  ['156', '12'], // mutated_birch_forest_hills -> tall_birch_hills -> old_growth_birch_forest
  ['32', '13'], // redwood_taiga -> giant_tree_taiga -> old_growth_pine_taiga
  ['33', '13'], // redwood_taiga_hills -> giant_tree_taiga_hills -> old_growth_pine_taiga
  ['160', '14'], // mutated_redwood_taiga -> giant_spruce_taiga -> old_growth_spruce_taiga
  ['161', '14'], // mutated_redwood_taiga_hills -> giant_spruce_taiga_hills -> old_growth_spruce_taiga
  ['5', '15'], // taiga -> taiga
  ['19', '15'], // taiga_hills -> taiga
  ['133', '15'], // mutated_taiga -> taiga_mountains -> taiga
  ['30', '16'], // taiga_cold -> snowy_taiga
  ['31', '16'], // taiga_cold_hills -> snowy_taiga_hills -> snowy_taiga
  ['158', '16'], // mutated_taiga_cold -> snowy_taiga_mountains -> snowy_taiga
  ['35', '17'], // savanna -> savanna
  ['36', '18'], // savanna_rock -> savanna_plateau
  ['3', '19'], // extreme_hills -> windswept_hills
  ['20', '19'], // smaller_extreme_hills -> mountain_edge -> windswept_hills
  ['131', '20'], // mutated_extreme_hills -> gravelly_mountains -> windswept_gravelly_hills
  ['162', '20'], // mutated_extreme_hills_with_trees -> modified_gravelly_mountains -> windswept_gravelly_hills
  ['34', '21'], // extreme_hills_with_trees -> wooded_mountains -> windswept_forest
  ['163', '22'], // mutated_savanna -> shattered_savanna -> windswept_savanna
  ['164', '22'], // mutated_savanna_rock -> shattered_savanna_plateau -> windswept_savanna
  ['21', '23'], // jungle -> jungle
  ['22', '23'], // jungle_hills -> jungle
  ['149', '23'], // mutated_jungle -> modified_jungle -> jungle
  ['23', '24'], // jungle_edge -> sparse_jungle
  ['151', '24'], // mutated_jungle_edge -> modified_jungle_edge -> sparse_jungle
  ['168', '25'], // bamboo_jungle -> bamboo_jungle
  ['169', '25'], // bamboo_jungle_hills -> bamboo_jungle
  ['37', '26'], // mesa -> badlands
  ['39', '26'], // mesa_clear_rock -> badlands_plateau -> badlands
  ['167', '26'], // mutated_mesa_clear_rock -> modified_badlands_plateau -> badlands
  ['165', '27'], // mutated_mesa -> eroded_badlands
  ['38', '28'], // mesa_rock -> wooded_badlands_plateau -> wooded_badlands
  ['166', '28'], // mutated_mesa_rock -> modified_wooded_badlands_plateau -> wooded_badlands
  ['7', '36'], // river -> river
  ['11', '37'], // frozen_river -> frozen_river
  ['16', '38'], // beaches -> beach
  ['26', '39'], // cold_beach -> snowy_beach
  ['25', '40'], // stone_beach -> stone_shore -> stony_shore
  ['44', '41'], // warm_ocean -> warm_ocean
  ['47', '41'], // warm_deep_ocean -> deep_warm_ocean -> warm_ocean
  ['45', '42'], // lukewarm_ocean -> lukewarm_ocean
  ['48', '43'], // deep_lukewarm_ocean -> deep_lukewarm_ocean
  ['0', '44'], // ocean -> ocean
  ['24', '45'], // deep_ocean -> deep_ocean
  ['46', '46'], // cold_ocean -> cold_ocean
  ['49', '47'], // cold_deep_ocean -> deep_cold_ocean
  ['10', '48'], // frozen_ocean -> frozen_ocean
  ['50', '49'], // frozen_deep_ocean -> deep_frozen_ocean
  ['14', '50'], // mushroom_island -> mushroom_fields
  ['15', '50'], // mushroom_island_shore -> mushroom_field_shore -> mushroom_fields
  ['8', '54'], // hell -> nether -> nether_wastes
  ['9', '59'], // sky -> the_end
  ['42', '60'], // sky_island_high -> end_highlands
  ['41', '61'], // sky_island_medium -> end_midlands
  ['40', '62'], // sky_island_low -> small_end_islands
  ['43', '63'], // sky_island_barren -> end_barrens
  ['', ''], // unknown -> unknown
]);

/** Upgrades potentially older version of places data. */
export function upgradePlaces({places, version}) {
  if (version === PLACES_VERSION) return {places, version};

  return {
    places: places.map((place) => ({
      ...place,
      biome: upgradeTable.get(place.biome) ?? '',
    })),
    version: PLACES_VERSION,
  };
}
