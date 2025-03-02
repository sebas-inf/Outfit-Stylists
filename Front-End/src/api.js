const API_BASE_URL = 'http://localhost:3000';

export async function fetchClothingItems() {
  const response = await fetch(`${API_BASE_URL}/user/wardrobe`);
  if (!response.ok) throw new Error('Failed to fetch clothing items');
  return response.json();
}

export async function fetchClothingItemByName(name) {
  const items = await fetchClothingItems();
  return items.find(item => item.name === name);
}
