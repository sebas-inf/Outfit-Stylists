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

export async function sendClothingItem(itemData) {
  const response = await fetch('http://localhost:3000/user/sendarticle', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(itemData)
  });
  if (!response.ok) {
    throw new Error('Failed to send article');
  }
  return response.text();
}

export async function fetchOutfits() {
  const response = await fetch("http://localhost:3000/user/wardrobe/outfits");
  if (!response.ok) throw new Error("Failed to fetch outfits");
  return response.json();
}

export async function createOutfit(outfitData) {
  const response = await fetch('http://localhost:3000/user/createoutfit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(outfitData)
  });
  if (!response.ok) throw new Error('Failed to create outfit');
  return response.text();
}
