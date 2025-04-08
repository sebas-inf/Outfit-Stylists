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

  useEffect(() => {
    if (location.pathname === '/home') {
      setIsCreatingOutfit(false);
      setSelectedOutfitItems([]);
      setIsAddItemOpen(false);
    }
  }, [location.pathname]);

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

  const confirmOutfit = () => {
    if (selectedOutfitItems.length === 0) {
      alert('Select at least one item for the outfit.');
      return;
    }
    const selectedItems = items.filter((item) =>
      selectedOutfitItems.includes(item.id)
    );
    navigate('/create-outfit', { state: { selectedItems } });
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
                style={{
                  position: 'relative',
                  opacity: isCreatingOutfit && selectedOutfitItems.includes(item.id) ? 0.5 : 1,
                  cursor: isCreatingOutfit ? 'pointer' : 'default'
                }}
              >
                <ClothingGridWrapper item={item} isCreatingOutfit={isCreatingOutfit} toggleOutfitSelection={toggleOutfitSelection} />
              </div>
            )}
          />
        </div>
      </PageTransition>
    </>
  );
};

const ClothingGridWrapper = ({ item, isCreatingOutfit, toggleOutfitSelection }) => {
  return (
    <div style={{ position: 'relative' }}>
      <ClothingCard item={item} />
      {isCreatingOutfit && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            toggleOutfitSelection(item.id);
          }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0)',
            zIndex: 10,
            cursor: 'pointer'
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
