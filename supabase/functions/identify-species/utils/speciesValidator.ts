
export function validateSpeciesCategory(category: string): boolean {
  const allowedCategories = ['bird', 'mammal', 'reptile', 'amphibian', 'fish', 'insect', 'plant', 'fungi', 'marine life'];
  const identifiedCategory = category?.toLowerCase().replace('_', ' ') || '';
  
  return allowedCategories.includes(identifiedCategory) && identifiedCategory !== 'not wildlife';
}

export function createNotWildlifeResponse() {
  return { 
    success: false, 
    error: "Please upload a picture of an animal, bird, or plant to analyze and help you discover wildlife species."
  };
}
