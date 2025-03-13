import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendClothingItem } from '../api';
import './AddItem.css';
import Header from './Header';

const AddItem = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    wardrobeName: '',
    name: '',
    description: '',
    category: '',
    mainmaterial: '',
    maincolor: '',
    usage: '',
    photo: ''
  });
  const [previewSrc, setPreviewSrc] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewSrc(reader.result);
        const base64String = reader.result.split(',')[1];
        setFormData({ ...formData, photo: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      username: formData.username,
      wardrobeName: formData.wardrobeName,
      articleData: {
        name: formData.name,
        description: formData.description,
        category: formData.category.toLowerCase(),
        mainmaterial: formData.mainmaterial,
        maincolor: formData.maincolor,
        usage: parseInt(formData.usage, 10),
        photo: formData.photo
      }
    };
  
    try {
      await sendClothingItem(payload);
      navigate('/clothing');
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };
  

  return (
    <>
      <Header />
      <div className="add-item-wrapper">
        <div className="add-item-container">
          <h2>Add New Clothing Item</h2>
          <form onSubmit={handleSubmit} className="add-item-form">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="wardrobeName"
              placeholder="Wardrobe Name"
              value={formData.wardrobeName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="name"
              placeholder="Item Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="category"
              placeholder="Category"
              value={formData.category}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="mainmaterial"
              placeholder="Main Material"
              value={formData.mainmaterial}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="maincolor"
              placeholder="Main Color"
              value={formData.maincolor}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="usage"
              placeholder="Enter number of times worn"
              value={formData.usage}
              onChange={handleChange}
              required
            />
            <input
              type="file"
              name="photo"
              accept="image/*"
              onChange={handleFileChange}
              required
            />
            <button type="submit">Add Item</button>
          </form>
        </div>
        {previewSrc && (
          <div className="preview-container">
            <img src={previewSrc} alt="Preview" className="preview-image" />
          </div>
        )}
      </div>
    </>
  );
};

export default AddItem;
