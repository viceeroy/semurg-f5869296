export interface SearchPost {
  id: string;
  title: string;
  scientific_name: string;
  description: string;
  image_url: string;
  category: 'birds' | 'mammals' | 'insects' | 'plants' | 'reptiles' | 'fish';
  habitat: string;
  diet: string;
  behavior: string;
  conservation_status: string;
  interesting_facts: string;
  identification_notes: string;
  created_at: string;
  profiles: {
    username: string;
    avatar_url: string;
  };
}

export const mockSearchPosts: SearchPost[] = [
  // Birds
  {
    id: 'search-1',
    title: 'Northern Cardinal',
    scientific_name: 'Cardinalis cardinalis',
    description: 'The Northern Cardinal is a vibrant songbird known for its brilliant red plumage in males and warm brown coloring in females. These medium-sized birds are year-round residents across much of eastern and central North America. Cardinals are non-migratory birds that maintain territories throughout the year, making them a constant presence in backyards and gardens. They are easily recognizable by their distinctive crest, thick orange-red bill, and melodious whistling songs that can be heard throughout the day.',
    image_url: 'https://images.unsplash.com/photo-1518373714866-3f1478910cc0?w=800',
    category: 'birds',
    habitat: 'Cardinals thrive in woodland edges, gardens, shrublands, and suburban areas with dense vegetation. They prefer areas with thick cover for nesting and foraging, including overgrown fields, parks, and residential neighborhoods with mature trees and shrubs.',
    diet: 'Primarily seed-eaters, cardinals feed on sunflower seeds, safflower seeds, and various tree seeds. They also consume insects, especially during breeding season when feeding young, and enjoy fruits and berries in fall and winter.',
    behavior: 'Cardinals are non-territorial during winter, often forming small flocks. Males are highly territorial during breeding season, singing from prominent perches to defend their territory. They are ground feeders, using a distinctive double-scratch technique to uncover food.',
    conservation_status: 'Least Concern - Population stable and expanding northward',
    interesting_facts: 'Male cardinals feed their mates during courtship and nesting. They can live up to 15 years in the wild. Cardinals are the state bird of seven US states. Their red color comes from carotenoid pigments in their diet.',
    identification_notes: 'Males are bright red with black face mask around bill. Females are brown with reddish wings, tail, and crest. Both sexes have thick, orange-red bills and prominent crests.',
    created_at: '2024-01-15T10:30:00Z',
    profiles: { username: 'BirdExpert', avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100' }
  },
  {
    id: 'search-2',
    title: 'Blue Jay',
    scientific_name: 'Cyanocitta cristata',
    description: 'Blue Jays are intelligent and adaptable corvids known for their striking blue, white, and black plumage. These medium-sized birds are highly social and vocal, with a complex system of calls and an ability to mimic other bird sounds. Blue Jays are found throughout eastern and central North America, from southern Canada to the Gulf of Mexico. They are partially migratory, with northern populations moving south in winter while southern birds remain year-round residents.',
    image_url: 'https://images.unsplash.com/photo-1551630026-dac4174a68f5?w=800',
    category: 'birds',
    habitat: 'Blue Jays inhabit deciduous and mixed forests, parks, suburban areas, and woodland edges. They prefer areas with oak trees, as acorns are a primary food source. They adapt well to human-modified landscapes.',
    diet: 'Omnivorous diet including acorns, nuts, seeds, insects, eggs, and nestlings of other birds. They cache thousands of acorns each fall for winter food storage, playing a crucial role in forest regeneration.',
    behavior: 'Highly intelligent birds that use tools, plan for future events, and have complex social structures. They mob predators and give alarm calls to warn other birds. Known for their aggressive behavior at feeders.',
    conservation_status: 'Least Concern - Stable populations throughout range',
    interesting_facts: 'Blue Jays can live over 25 years. They have excellent memories and can remember human faces. Their blue color is due to light refraction, not pigments. A group of jays is called a "band" or "party".',
    identification_notes: 'Bright blue above, white below, with black necklace across throat and around head. White wing bars and white outer tail feathers visible in flight. Prominent blue crest.',
    created_at: '2024-01-14T09:15:00Z',
    profiles: { username: 'NatureWatcher', avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' }
  },
  {
    id: 'search-3',
    title: 'American Robin',
    scientific_name: 'Turdus migratorius',
    description: 'The American Robin is one of North America\'s most familiar birds, known for its distinctive orange-red breast and melodious song. These thrushes are found throughout North America and are often considered harbingers of spring. American Robins are highly adaptable birds that thrive in both urban and rural environments. They are known for their ground-foraging behavior, often seen hopping across lawns in search of earthworms and insects.',
    image_url: 'https://images.unsplash.com/photo-1586654991519-0e63dc1c70ea?w=800',
    category: 'birds',
    habitat: 'Robins inhabit a wide variety of habitats including lawns, parks, golf courses, fields, woodlands, and suburban areas. They prefer areas with short grass for foraging and nearby trees or shrubs for nesting.',
    diet: 'Diet varies seasonally - earthworms and insects in spring and summer, fruits and berries in fall and winter. They are excellent at locating earthworms by sight and sound.',
    behavior: 'Robins are territorial during breeding season but form large roosts in winter. They have a distinctive hopping gait when foraging on the ground. Males sing from prominent perches to establish territory.',
    conservation_status: 'Least Concern - Very stable and widespread population',
    interesting_facts: 'Robins can live up to 12 years in the wild. They build their nests with mud and can have up to three broods per year. Their eggs are the famous "robin\'s egg blue" color due to pigments in the female\'s diet.',
    identification_notes: 'Orange-red breast, dark gray to black head and back, white throat with black streaks, white eye crescents. Juveniles have spotted breasts. Yellow bill with dark tip.',
    created_at: '2024-01-13T14:45:00Z',
    profiles: { username: 'BackyardBirder', avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100' }
  },
  
  // Mammals
  {
    id: 'search-4',
    title: 'White-tailed Deer',
    scientific_name: 'Odocoileus virginianus',
    description: 'White-tailed deer are graceful ungulates native to North America, easily recognized by the distinctive white underside of their tail, which they flash as a warning signal when fleeing from danger. These adaptable mammals have successfully expanded their range and population over the past century. They are medium-sized deer with reddish-brown summer coats that turn grayish-brown in winter. White-tailed deer are found from southern Canada to South America and have adapted to diverse habitats from forests to suburban areas.',
    image_url: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800',
    category: 'mammals',
    habitat: 'White-tailed deer inhabit woodlands, grasslands, agricultural areas, and suburban environments. They prefer edge habitats where forests meet open areas, providing both cover and feeding opportunities.',
    diet: 'Herbivorous browsers feeding on leaves, shoots, twigs, acorns, nuts, and agricultural crops. Their diet changes seasonally, focusing on new growth in spring and summer, nuts and acorns in fall, and woody browse in winter.',
    behavior: 'Primarily crepuscular, most active during dawn and dusk. Live in small family groups led by a dominant female. Males (bucks) grow and shed antlers annually, becoming territorial during breeding season.',
    conservation_status: 'Least Concern - Population has recovered from near extinction in early 1900s',
    interesting_facts: 'Can run up to 30 mph and jump 8 feet high. Excellent swimmers and can rotate their ears 310 degrees. Communicate through scent marking, vocalizations, and body language including tail flagging.',
    identification_notes: 'Reddish-brown in summer, grayish-brown in winter. White throat, belly, and underside of tail. Males have branched antlers from spring to winter. Black nose and large dark eyes.',
    created_at: '2024-01-12T08:30:00Z',
    profiles: { username: 'WildlifeObserver', avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100' }
  },
  {
    id: 'search-5',
    title: 'Eastern Gray Squirrel',
    scientific_name: 'Sciurus carolinensis',
    description: 'Eastern Gray Squirrels are highly adaptable rodents native to eastern North America. These agile mammals are known for their acrobatic abilities, intelligence, and remarkable memory for food caching locations. They have successfully colonized urban and suburban environments, becoming one of the most commonly observed wildlife species in cities. Gray squirrels play important ecological roles as seed dispersers, particularly for oak and other nut-producing trees.',
    image_url: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=800',
    category: 'mammals',
    habitat: 'Eastern Gray Squirrels thrive in mature hardwood and mixed forests, particularly those with nut-producing trees. They have adapted exceptionally well to urban parks, suburban neighborhoods, and college campuses.',
    diet: 'Omnivorous diet consisting primarily of nuts, seeds, acorns, tree buds, flowers, and fungi. They also consume insects, bird eggs, and nestlings. Known for their food caching behavior, burying thousands of nuts each fall.',
    behavior: 'Highly active during daylight hours, especially early morning and late afternoon. Excellent climbers and jumpers, able to leap 10 feet between trees. Build leaf nests (dreys) in tree branches for shelter.',
    conservation_status: 'Least Concern - Abundant throughout range, considered overabundant in some urban areas',
    interesting_facts: 'Can remember the locations of thousands of buried nuts. Their front teeth never stop growing. Can fall from great heights without injury due to their light weight and air resistance.',
    identification_notes: 'Gray fur with brown tinges, white underside, bushy tail with white-tipped hairs. Large dark eyes and prominent ears. Some individuals may appear more brownish or even black (melanistic).',
    created_at: '2024-01-11T11:20:00Z',
    profiles: { username: 'UrbanNaturalist', avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100' }
  },
  {
    id: 'search-6',
    title: 'Red Fox',
    scientific_name: 'Vulpes vulpes',
    description: 'Red foxes are intelligent and adaptable canids with the largest natural distribution of any terrestrial carnivore. These cunning predators are known for their reddish coat, black legs, and distinctive white-tipped tail. Red foxes have successfully adapted to diverse environments from arctic tundra to urban areas. They are solitary hunters with excellent hearing and a keen sense of smell, capable of detecting prey movement under snow or soil.',
    image_url: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=800',
    category: 'mammals',
    habitat: 'Red foxes inhabit diverse environments including forests, grasslands, deserts, mountains, and increasingly urban and suburban areas. They prefer areas with mixed habitats providing both cover and open hunting grounds.',
    diet: 'Omnivorous opportunists eating small mammals, birds, insects, fruits, berries, and carrion. Their diet varies seasonally and geographically. Known for their ability to cache surplus food for later consumption.',
    behavior: 'Primarily nocturnal and crepuscular hunters, though urban foxes may be active during day. Live in family groups during breeding season but are otherwise solitary. Famous for their characteristic pouncing hunting technique.',
    conservation_status: 'Least Concern - Stable populations, expanding into urban areas',
    interesting_facts: 'Can hear low-frequency sounds and rodents digging underground. Have excellent night vision. Can run up to 31 mph. Their tail (brush) helps with balance and communication.',
    identification_notes: 'Reddish-orange coat, black legs and ear tips, white throat and belly, white-tipped tail. Pointed snout, erect triangular ears, and yellow eyes. Size similar to small dog.',
    created_at: '2024-01-10T16:45:00Z',
    profiles: { username: 'PredatorTracker', avatar_url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100' }
  },

  // Plants
  {
    id: 'search-7',
    title: 'Wild Sunflower',
    scientific_name: 'Helianthus annuus',
    description: 'Wild sunflowers are native North American plants that are the ancestors of cultivated sunflowers. These tall, robust annual herbs can grow up to 10 feet tall and are characterized by their large, bright yellow flower heads that track the sun\'s movement across the sky. Wild sunflowers are important native plants that provide food and habitat for numerous wildlife species including birds, bees, and butterflies. They typically bloom from late summer through early fall, creating spectacular displays across prairies and roadsides.',
    image_url: 'https://images.unsplash.com/photo-1470509037663-253afd7f0f51?w=800',
    category: 'plants',
    habitat: 'Wild sunflowers grow in prairies, roadsides, fields, and disturbed soils throughout much of North America. They prefer full sun and well-drained soils, thriving in areas with good air circulation.',
    diet: 'As plants, sunflowers obtain nutrients through photosynthesis and root absorption of minerals from soil. They have deep taproots that can access water and nutrients from lower soil layers.',
    behavior: 'Exhibit heliotropism when young - flower buds track the sun from east to west during the day. Mature flowers typically face east. Self-incompatible, requiring cross-pollination by insects.',
    conservation_status: 'Least Concern - Common throughout natural range, though habitat loss affects some populations',
    interesting_facts: 'Seeds provide high-energy food for over 40 bird species. Each flower head contains up to 2,000 individual flowers. The spiral pattern of seeds follows the Fibonacci sequence. Can remove toxins from soil.',
    identification_notes: 'Large yellow flower heads 3-5 inches across, dark brown center disk, bright yellow petals (ray flowers), rough hairy stems and leaves, heart-shaped leaves with serrated edges.',
    created_at: '2024-01-09T13:15:00Z',
    profiles: { username: 'PrairieExplorer', avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' }
  },
  {
    id: 'search-8',
    title: 'Purple Coneflower',
    scientific_name: 'Echinacea purpurea',
    description: 'Purple Coneflower, commonly known as Echinacea, is a native North American perennial herb renowned for both its ornamental beauty and medicinal properties. These hardy wildflowers feature distinctive purple-pink petals that droop around a prominent spiny orange-brown central cone. Purple coneflowers are keystone prairie species that support diverse wildlife and have been used medicinally by Native Americans for centuries. They bloom from early summer through fall, providing long-lasting color and wildlife value.',
    image_url: 'https://images.unsplash.com/photo-1597848212624-e8ac23eaac80?w=800',
    category: 'plants',
    habitat: 'Native to prairies, open woodlands, and fields throughout eastern and central North America. Thrives in full sun to partial shade with well-drained soils, highly drought tolerant once established.',
    diet: 'Photosynthetic plant that manufactures food from sunlight, carbon dioxide, and water. Has deep taproots that access water and nutrients from deep soil layers, making it drought resistant.',
    behavior: 'Perennial herb that dies back to ground level in winter and regrows from roots in spring. Flowers attract numerous pollinators including bees, butterflies, and birds that feed on seeds.',
    conservation_status: 'Least Concern - Stable populations, widely cultivated, some local populations threatened by habitat loss',
    interesting_facts: 'Contains compounds that boost immune system function. Seeds are favorite food of American Goldfinches. Can live over 40 years. The spiny seed heads provide winter interest and bird food.',
    identification_notes: 'Purple-pink drooping petals around orange-brown spiny central cone, lance-shaped leaves with prominent veins, rough texture, grows 2-4 feet tall, sturdy upright stems.',
    created_at: '2024-01-08T10:30:00Z',
    profiles: { username: 'HerbalHealer', avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100' }
  },
  {
    id: 'search-9',
    title: 'White Oak',
    scientific_name: 'Quercus alba',
    description: 'White Oak is a majestic deciduous tree native to eastern North America, renowned for its longevity, strength, and ecological importance. These impressive trees can live for several centuries and reach heights of 80-100 feet with equally wide crowns. White oaks are keystone species that support over 500 species of butterflies and moths, plus countless other insects, birds, and mammals. Their acorns are sweet and highly prized by wildlife, while their wood has been valued for construction and barrel-making for centuries.',
    image_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
    category: 'plants',
    habitat: 'White oaks grow in mixed hardwood forests, woodlands, and savannas throughout eastern North America. They prefer well-drained soils and full to partial sun, tolerating various soil types.',
    diet: 'Photosynthetic tree that produces food through photosynthesis. Has extensive root system that accesses water and minerals from soil. Forms partnerships with mycorrhizal fungi for enhanced nutrient uptake.',
    behavior: 'Slow-growing but long-lived tree that doesn\'t produce acorns until 20-30 years old. Produces sweet acorns every 3-5 years in mast years. Leaves turn brown in fall and often persist through winter.',
    conservation_status: 'Least Concern overall, but old-growth white oak forests are rare and threatened',
    interesting_facts: 'Can live over 600 years. The Charter Oak in Connecticut was 1,000 years old when it fell in 1856. Acorns can be eaten by humans after processing. Wood is prized for whiskey barrels.',
    identification_notes: 'Rounded lobes on leaves with no bristles, gray scaly bark, sweet acorns without caps in fall, massive trunk and broad crown when mature, leaves turn brown in autumn.',
    created_at: '2024-01-07T15:45:00Z',
    profiles: { username: 'ForestGuardian', avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100' }
  },

  // Insects  
  {
    id: 'search-10',
    title: 'Monarch Butterfly',
    scientific_name: 'Danaus plexippus',
    description: 'Monarch butterflies are iconic insects famous for their incredible multi-generational migration spanning thousands of miles across North America. These large orange and black butterflies are known for their remarkable life cycle, toxic defenses, and navigational abilities. Monarchs undergo complete metamorphosis from egg to caterpillar to chrysalis to adult butterfly. Their migration is one of nature\'s most extraordinary phenomena, with populations overwintering in central Mexico and coastal California.',
    image_url: 'https://images.unsplash.com/photo-1444927714506-8492d94b5ba0?w=800',
    category: 'insects',
    habitat: 'Monarchs inhabit open areas including prairies, fields, roadsides, and gardens throughout North America during breeding season. They require milkweed plants for reproduction and nectar sources for adult feeding.',
    diet: 'Adults feed on nectar from various flowers, with a preference for milkweed, asters, and goldenrod. Caterpillars feed exclusively on milkweed plants, which makes them toxic to predators.',
    behavior: 'Famous for multi-generational migration - it takes 3-4 generations to complete the northward journey, but only one generation makes the entire southward trip back to wintering grounds.',
    conservation_status: 'Endangered - Population has declined by over 80% in recent decades due to habitat loss and pesticide use',
    interesting_facts: 'Can travel up to 3,000 miles during migration. Use the sun and earth\'s magnetic field for navigation. Their orange wings warn predators of their toxicity. Weigh less than a paperclip.',
    identification_notes: 'Bright orange wings with black borders and veins, white spots along black borders, males have distinctive black scent spots on hindwings, females have thicker black wing veins.',
    created_at: '2024-01-06T12:20:00Z',
    profiles: { username: 'MigrationTracker', avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100' }
  },
  {
    id: 'search-11',
    title: 'European Honey Bee',
    scientific_name: 'Apis mellifera',
    description: 'European honey bees are social insects that live in highly organized colonies with complex social structures. These industrious pollinators are crucial for both natural ecosystems and agricultural production, responsible for pollinating about one-third of the food we eat. Honey bees are not native to North America but were introduced by European colonists and have become naturalized. They are known for their sophisticated communication through dance language, efficient foraging behavior, and production of honey and beeswax.',
    image_url: 'https://images.unsplash.com/photo-1558642084-fd678ca8fbfe?w=800',
    category: 'insects',
    habitat: 'Honey bees nest in cavities such as hollow trees, rock crevices, or human-provided hives. They forage in diverse habitats including gardens, agricultural areas, forests, and prairies within 2-3 miles of their nest.',
    diet: 'Adults feed on nectar and pollen from flowers. They convert nectar to honey for long-term storage and feed pollen to developing larvae. A single colony may visit millions of flowers annually.',
    behavior: 'Highly social insects living in colonies of 20,000-80,000 individuals. Perform waggle dances to communicate location of food sources to nestmates. Maintain hive temperature and humidity precisely.',
    conservation_status: 'Not of conservation concern as a species, but colonies face threats from parasites, diseases, pesticides, and habitat loss',
    interesting_facts: 'A bee must visit about 2,000 flowers to make one tablespoon of honey. Can fly up to 15 mph. Wings beat 230 times per second. Can see ultraviolet patterns on flowers invisible to humans.',
    identification_notes: 'Golden-brown and black striped abdomen, fuzzy thorax, amber wings, large compound eyes, branched body hairs for collecting pollen, barbed stinger (females only).',
    created_at: '2024-01-05T09:30:00Z',
    profiles: { username: 'Beekeeper', avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' }
  },

  // Reptiles
  {
    id: 'search-12',
    title: 'Eastern Box Turtle',
    scientific_name: 'Terrapene carolina',
    description: 'Eastern Box Turtles are terrestrial turtles native to eastern North America, known for their distinctive high-domed shells and ability to completely withdraw into their shells for protection. These long-lived reptiles can survive for over 100 years and have complex homing abilities, often returning to the same areas year after year. Box turtles are important seed dispersers in forest ecosystems and are considered indicator species for healthy woodland habitats.',
    image_url: 'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=800',
    category: 'reptiles',
    habitat: 'Eastern Box Turtles inhabit deciduous woodlands, forest edges, fields, and suburban areas with adequate cover and moisture. They prefer areas with leaf litter, fallen logs, and access to shallow water sources.',
    diet: 'Omnivorous diet including earthworms, insects, slugs, snails, mushrooms, berries, and vegetation. Young turtles eat more animal matter while adults consume more plant material.',
    behavior: 'Terrestrial and generally solitary except during mating season. Hibernate underground during winter. Have strong homing instincts and rarely travel far from their established home range.',
    conservation_status: 'Vulnerable - Populations declining due to habitat loss, road mortality, and collection for pet trade',
    interesting_facts: 'Can live over 100 years. Have hinged plastron allowing complete shell closure. Eyes of males are typically red while females have brown eyes. Can go months without food.',
    identification_notes: 'High-domed dark shell with yellow or orange markings, hinged lower shell, yellow and orange skin markings, males have red eyes and concave plastron, females have brown eyes.',
    created_at: '2024-01-04T14:15:00Z',
    profiles: { username: 'ReptileRescuer', avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100' }
  }
];

export const categorizedPosts = {
  all: mockSearchPosts,
  birds: mockSearchPosts.filter(post => post.category === 'birds'),
  mammals: mockSearchPosts.filter(post => post.category === 'mammals'),
  insects: mockSearchPosts.filter(post => post.category === 'insects'),
  plants: mockSearchPosts.filter(post => post.category === 'plants'),
  reptiles: mockSearchPosts.filter(post => post.category === 'reptiles'),
  fish: mockSearchPosts.filter(post => post.category === 'fish')
};