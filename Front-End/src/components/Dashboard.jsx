import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import ClothingGrid from './ClothingGrid';
import AddItemSidebar from './AddItemSidebar';
import { fetchClothingItems } from '../api';
import PageTransition from './PageTransition';
import ClothingCard from './ClothingCard';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [isCreatingOutfit, setIsCreatingOutfit] = useState(false);
  const [selectedOutfitItems, setSelectedOutfitItems] = useState([]);

  useEffect(() => {
    fetchClothingItems()
      .then((data) => {
        setItems(data);
        setFilteredItems(data);
      })
      .catch((error) => console.error('Error fetching items:', error));
  }, []);

  useEffect(() => {
    if (selectedCategories.length === 0) {
      setFilteredItems(items);
    } else {
      setFilteredItems(
        items.filter((item) => selectedCategories.includes(item.category))
      );
    }
  }, [selectedCategories, items]);

  useEffect(() => {
    if (location.state) {
      if (location.state.startAddItem) {
        setIsAddItemOpen(true);
      }
      if (location.state.startOutfitCreation) {
        setIsCreatingOutfit(true);
      }
    }
  }, [location]);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const toggleAddItem = () => {
    setIsAddItemOpen((prev) => !prev);
  };

  const handleToggleCategory = (category) => {
    if (category === '') {
      setSelectedCategories([]);
    } else {
      setSelectedCategories((prev) =>
        prev.includes(category)
          ? prev.filter((c) => c !== category)
          : [...prev, category]
      );
    }
  };

  const uniqueCategories = Array.from(new Set(items.map((item) => item.category)));

  const toggleOutfitSelection = (itemId) => {
    setSelectedOutfitItems((prevSelected) =>
      prevSelected.includes(itemId)
        ? prevSelected.filter((id) => id !== itemId)
        : [...prevSelected, itemId]
    );
  };

  const cancelOutfitCreation = () => {
    setIsCreatingOutfit(false);
    setSelectedOutfitItems([]);
  };

  const toggleOutfitCreation = () => {
    if (isCreatingOutfit) {
      cancelOutfitCreation();
    } else {
      setIsCreatingOutfit(true);
    }
  };

  const confirmOutfit = async () => {
    const outfitName = window.prompt('Enter outfit name:');
    if (!outfitName) return;
    const outfitDescription = window.prompt('Enter outfit description:');
    const outfitData = {
      data: {
        name: outfitName,
        description: outfitDescription || '',
        required_articles: selectedOutfitItems,
        optional_articles: []
      }
    };
    try {
      cancelOutfitCreation();
      const refreshedItems = await fetchClothingItems();
      setItems(refreshedItems);
      setFilteredItems(refreshedItems);
    } catch (error) {
      console.error('Error creating outfit:', error);
    }
  };

  return (
    <>
      <Header
        toggleSidebar={toggleSidebar}
        toggleAddItem={toggleAddItem}
        isAddingItem={isAddItemOpen}
        isCreatingOutfit={isCreatingOutfit}
        toggleOutfitCreation={toggleOutfitCreation}
        confirmOutfit={confirmOutfit}
      />
      <Sidebar
        isOpen={isSidebarOpen}
        categories={uniqueCategories}
        selectedCategories={selectedCategories}
        onToggleCategory={handleToggleCategory}
        toggleSidebar={toggleSidebar}
      />
      <AddItemSidebar isOpen={isAddItemOpen} toggleAddItemSidebar={toggleAddItem} />
      <PageTransition>
        <div style={{ padding: '20px' }}>
          <h2 style={{ paddingTop: '20px', paddingBottom: '20px' }}>Home</h2>
          <ClothingGrid
            items={filteredItems}
            renderItem={(item) => (
              <div
                key={item.id}
                onClickCapture={(e) => {
                  if (isCreatingOutfit) {
                    e.nativeEvent.stopImmediatePropagation();
                    toggleOutfitSelection(item.id);
                  }
                }}
                onClick={() => {
                  if (!isCreatingOutfit) {
                    navigate(`/clothing/${encodeURIComponent(item.name)}`);
                  }
                }}
                style={{
                  opacity: isCreatingOutfit && selectedOutfitItems.includes(item.id) ? 0.5 : 1,
                  cursor: isCreatingOutfit ? 'pointer' : 'default'
                }}
              >
                <ClothingCard item={item} />
              </div>
            )}
          />
        </div>
      </PageTransition>
    </>
  );
};

export default Dashboard;
