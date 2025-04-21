import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import OutfitSuggestion from './OutfitSuggestion';

vi.mock('../api', () => ({
  getOutfitSuggestions: vi.fn(),
}));

vi.mock('./Header', () => ({
  default: () => <div data-testid="mock-header">Mock Header</div>,
}));

import { getOutfitSuggestions } from '../api';

describe('OutfitSuggestion Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders initial form elements correctly', () => {
    render(<OutfitSuggestion />);
    // check form loads

    expect(screen.getByPlaceholderText(/Your Location/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Current Weather/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Owned Clothing Items/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Include Images/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Include Images/i)).toBeChecked();
    expect(screen.getByRole('button', { name: /Suggest Outfit/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Suggest Outfit/i })).not.toBeDisabled();
    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    expect(screen.queryByText(/Loading suggestions/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Error:/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Suggested Outfit:/i)).not.toBeInTheDocument();
  });


  it('updates input fields and checkbox state correctly', async () => {
    const user = userEvent.setup();
    render(<OutfitSuggestion />);
    // type in box

    const locationInput = screen.getByPlaceholderText(/Your Location/i);
    const weatherInput = screen.getByPlaceholderText(/Current Weather/i);
    const itemsTextarea = screen.getByPlaceholderText(/Owned Clothing Items/i);
    const imageCheckbox = screen.getByLabelText(/Include Images/i);

    await user.type(locationInput, 'New York, NY');
    await user.type(weatherInput, '65°F and cloudy');
    await user.type(itemsTextarea, 'black t-shirt, gray jeans');

    expect(locationInput).toHaveValue('New York, NY');
    expect(weatherInput).toHaveValue('65°F and cloudy');
    expect(itemsTextarea).toHaveValue('black t-shirt, gray jeans');

    // click checkbox
    expect(imageCheckbox).toBeChecked();
    await user.click(imageCheckbox);
    expect(imageCheckbox).not.toBeChecked();

    await user.click(imageCheckbox);
    expect(imageCheckbox).toBeChecked();
  });

  it('calls the API with correct parameters on submit', async () => {
    const user = userEvent.setup();
    getOutfitSuggestions.mockResolvedValue({ tops: [], bottoms: [] });

    render(<OutfitSuggestion />);
    // fill form

    const locationInput = screen.getByPlaceholderText(/Your Location/i);
    const weatherInput = screen.getByPlaceholderText(/Current Weather/i);
    const itemsTextarea = screen.getByPlaceholderText(/Owned Clothing Items/i);
    const imageCheckbox = screen.getByLabelText(/Include Images/i);
    const submitButton = screen.getByRole('button', { name: /Suggest Outfit/i });

    await user.type(locationInput, 'Austin, TX');
    await user.type(weatherInput, '90°F and sunny');
    await user.type(itemsTextarea, 'shorts, sandals');

    // click submit
    await user.click(submitButton);

    const expectedPrompt = "I live in Austin, TX, it's 90°F and sunny; I own shorts, sandals.";
    const expectedData = { prompt: expectedPrompt, with_images: true };

    // check api called
    await waitFor(() => {
      expect(getOutfitSuggestions).toHaveBeenCalledTimes(1);
      expect(getOutfitSuggestions).toHaveBeenCalledWith(expectedData);
    });

    vi.clearAllMocks();
    await user.click(imageCheckbox);
    expect(imageCheckbox).not.toBeChecked();

    await user.click(submitButton);

    const expectedDataUnchecked = { prompt: expectedPrompt, with_images: false };

    await waitFor(() => {
      expect(getOutfitSuggestions).toHaveBeenCalledTimes(1);
      expect(getOutfitSuggestions).toHaveBeenCalledWith(expectedDataUnchecked);
    });
  });

  it('displays loading state correctly during API call', async () => {
    const user = userEvent.setup();
    getOutfitSuggestions.mockImplementation(() => new Promise(() => {}));

    render(<OutfitSuggestion />);
    // click submit

    const locationInput = screen.getByPlaceholderText(/Your Location/i);
    const weatherInput = screen.getByPlaceholderText(/Current Weather/i);
    const itemsTextarea = screen.getByPlaceholderText(/Owned Clothing Items/i);
    const submitButton = screen.getByRole('button', { name: /Suggest Outfit/i });

    await user.type(locationInput, 'Miami, FL');
    await user.type(weatherInput, '88°F humid');
    await user.type(itemsTextarea, 'swim trunks');

    await user.click(submitButton);

    // check loading shows
    expect(screen.getByText(/Loading suggestions.../i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Getting Suggestion.../i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Getting Suggestion.../i })).toBeDisabled();
    expect(screen.queryByRole('button', { name: /Suggest Outfit/i })).not.toBeInTheDocument();
  });

  it('displays suggestions with images on successful API response', async () => {
    const user = userEvent.setup();
    // check suggestions show up
    const mockSuggestions = {
      tops: [{ name: 'Blue T-Shirt', image_b64: 'base64_encoded_image_data_tshirt' }],
      bottoms: [{ name: 'Khaki Shorts', image_b64: 'base64_encoded_image_data_shorts' }],
      shoes: [], // Test empty category
    };
    getOutfitSuggestions.mockResolvedValue(mockSuggestions);

    render(<OutfitSuggestion />);

    const locationInput = screen.getByPlaceholderText(/Your Location/i);
    const weatherInput = screen.getByPlaceholderText(/Current Weather/i);
    const itemsTextarea = screen.getByPlaceholderText(/Owned Clothing Items/i);
    const submitButton = screen.getByRole('button', { name: /Suggest Outfit/i });
    const imageCheckbox = screen.getByLabelText(/Include Images/i);

    expect(imageCheckbox).toBeChecked();

    await user.type(locationInput, 'San Diego, CA');
    await user.type(weatherInput, '75°F sunny');
    await user.type(itemsTextarea, 't-shirt, shorts');

    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText(/Loading suggestions.../i)).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Suggest Outfit/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Suggest Outfit/i })).not.toBeDisabled();

      expect(screen.getByText('Suggested Outfit:')).toBeInTheDocument();

      expect(screen.getByText('Tops')).toBeInTheDocument();
      expect(screen.getByText('Blue T-Shirt')).toBeInTheDocument();
      const topImage = screen.getByAltText('Blue T-Shirt'); // check image
      expect(topImage).toBeInTheDocument();
      expect(topImage).toHaveAttribute('src', 'data:image/png;base64,base64_encoded_image_data_tshirt');

      expect(screen.getByText('Bottoms')).toBeInTheDocument();
      expect(screen.getByText('Khaki Shorts')).toBeInTheDocument();
      const bottomImage = screen.getByAltText('Khaki Shorts');
      expect(bottomImage).toBeInTheDocument();
      expect(bottomImage).toHaveAttribute('src', 'data:image/png;base64,base64_encoded_image_data_shorts');

      expect(screen.getByText('Shoes')).toBeInTheDocument();
      expect(screen.getByText('No suggestions for shoes.')).toBeInTheDocument();
    });
  });

  it('displays suggestions without images (placeholders) on successful API response', async () => {
    const user = userEvent.setup();
    // check no image shows
    const mockSuggestions = {
      tops: [{ name: 'Red Hoodie' }], // No image_b64
      bottoms: [{ name: 'Black Jeans' }], // No image_b64
    };
    getOutfitSuggestions.mockResolvedValue(mockSuggestions);

    render(<OutfitSuggestion />);

    const locationInput = screen.getByPlaceholderText(/Your Location/i);
    const weatherInput = screen.getByPlaceholderText(/Current Weather/i);
    const itemsTextarea = screen.getByPlaceholderText(/Owned Clothing Items/i);
    const submitButton = screen.getByRole('button', { name: /Suggest Outfit/i });
    const imageCheckbox = screen.getByLabelText(/Include Images/i);

    await user.type(locationInput, 'Seattle, WA');
    await user.type(weatherInput, '55°F rainy');
    await user.type(itemsTextarea, 'hoodie, jeans');

    await user.click(imageCheckbox);
    expect(imageCheckbox).not.toBeChecked();

    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText(/Loading suggestions.../i)).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Suggest Outfit/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Suggest Outfit/i })).not.toBeDisabled();

      expect(screen.getByText('Suggested Outfit:')).toBeInTheDocument();

      expect(screen.getByText('Tops')).toBeInTheDocument();
      expect(screen.getByText('Red Hoodie')).toBeInTheDocument();
      expect(screen.queryByAltText('Red Hoodie')).not.toBeInTheDocument();
      const topItemDiv = screen.getByText('Red Hoodie').closest('.suggestion-item');
      expect(topItemDiv).toHaveTextContent('No Image');

      expect(screen.getByText('Bottoms')).toBeInTheDocument();
      expect(screen.getByText('Black Jeans')).toBeInTheDocument();
      expect(screen.queryByAltText('Black Jeans')).not.toBeInTheDocument();
      const bottomItemDiv = screen.getByText('Black Jeans').closest('.suggestion-item');
      expect(bottomItemDiv).toHaveTextContent('No Image');

    });

    const expectedPrompt = "I live in Seattle, WA, it's 55°F rainy; I own hoodie, jeans.";
    expect(getOutfitSuggestions).toHaveBeenCalledWith({ prompt: expectedPrompt, with_images: false });
  });

  it('displays error message when API returns an error object', async () => {
    const user = userEvent.setup();
    // check error message
    const mockError = { error: 'Invalid input provided' };
    getOutfitSuggestions.mockResolvedValue(mockError);

    render(<OutfitSuggestion />);

    const locationInput = screen.getByPlaceholderText(/Your Location/i);
    const weatherInput = screen.getByPlaceholderText(/Current Weather/i);
    const itemsTextarea = screen.getByPlaceholderText(/Owned Clothing Items/i);
    const submitButton = screen.getByRole('button', { name: /Suggest Outfit/i });

    await user.type(locationInput, 'Invalid Location');
    await user.type(weatherInput, 'Bad Weather');
    await user.type(itemsTextarea, 'nothing');

    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText(/Loading suggestions.../i)).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Suggest Outfit/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Suggest Outfit/i })).not.toBeDisabled();

      const errorMessage = screen.getByText(/Error: Invalid input provided/i);
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveClass('error-message');

      expect(screen.queryByText('Suggested Outfit:')).not.toBeInTheDocument();
    });
  });

  it('displays error message when API call throws an error', async () => {
    const user = userEvent.setup();
    // check network error message
    const errorMessage = 'Network connection failed';
    getOutfitSuggestions.mockRejectedValue(new Error(errorMessage));

    render(<OutfitSuggestion />);

    const locationInput = screen.getByPlaceholderText(/Your Location/i);
    const weatherInput = screen.getByPlaceholderText(/Current Weather/i);
    const itemsTextarea = screen.getByPlaceholderText(/Owned Clothing Items/i);
    const submitButton = screen.getByRole('button', { name: /Suggest Outfit/i });

    await user.type(locationInput, 'Remote Location');
    await user.type(weatherInput, 'Unknown');
    await user.type(itemsTextarea, 'survival gear');

    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText(/Loading suggestions.../i)).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Suggest Outfit/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Suggest Outfit/i })).not.toBeDisabled();

      const errorElement = screen.getByText(`Error: ${errorMessage}`);
      expect(errorElement).toBeInTheDocument();
      expect(errorElement).toHaveClass('error-message');

      expect(screen.queryByText('Suggested Outfit:')).not.toBeInTheDocument();
    });
  });

  it('displays "No suggestions" message for empty categories', async () => {
    const user = userEvent.setup();
    // check no suggestions text
    const mockEmptySuggestions = {
      tops: [],
      bottoms: [],
      accessories: [],
    };
    getOutfitSuggestions.mockResolvedValue(mockEmptySuggestions);

    render(<OutfitSuggestion />);

    const locationInput = screen.getByPlaceholderText(/Your Location/i);
    const weatherInput = screen.getByPlaceholderText(/Current Weather/i);
    const itemsTextarea = screen.getByPlaceholderText(/Owned Clothing Items/i);
    const submitButton = screen.getByRole('button', { name: /Suggest Outfit/i });

    await user.type(locationInput, 'Anywhere');
    await user.type(weatherInput, 'Perfect');
    await user.type(itemsTextarea, 'anything');

    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText(/Loading suggestions.../i)).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Suggest Outfit/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Suggest Outfit/i })).not.toBeDisabled();

      expect(screen.getByText('Suggested Outfit:')).toBeInTheDocument();

      expect(screen.getByText('Tops')).toBeInTheDocument();
      expect(screen.getByText('No suggestions for tops.')).toBeInTheDocument();

      expect(screen.getByText('Bottoms')).toBeInTheDocument();
      expect(screen.getByText('No suggestions for bottoms.')).toBeInTheDocument();

      expect(screen.getByText('Accessories')).toBeInTheDocument();
      expect(screen.getByText('No suggestions for accessories.')).toBeInTheDocument();
    });
  });

  it('prevents rapid resubmission by calling API only once', async () => {
    const user = userEvent.setup();
    // click fast
    const suggestions = { tops: [{ name: 'Test Top' }] };
    getOutfitSuggestions.mockImplementation(() => {
      return new Promise(resolve => setTimeout(() => resolve(suggestions), 50));
    });

    render(<OutfitSuggestion />);

    const locationInput = screen.getByPlaceholderText(/Your Location/i);
    const weatherInput = screen.getByPlaceholderText(/Current Weather/i);
    const itemsTextarea = screen.getByPlaceholderText(/Owned Clothing Items/i);
    const submitButton = screen.getByRole('button', { name: /Suggest Outfit/i });

    await user.type(locationInput, 'Test Location');
    await user.type(weatherInput, 'Test Weather');
    await user.type(itemsTextarea, 'Test Item');

    await user.click(submitButton);
    await user.click(submitButton, { skipPointerEventsCheck: true });

    await waitFor(() => {
      expect(screen.getByText(/Loading suggestions.../i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Getting Suggestion.../i })).toBeDisabled();
    });

    // check api called once
    await waitFor(() => {
      expect(getOutfitSuggestions).toHaveBeenCalledTimes(1);
    });

     await screen.findByText('Suggested Outfit:');
     expect(screen.getByText('Test Top')).toBeInTheDocument();
     expect(screen.getByRole('button', { name: /Suggest Outfit/i })).not.toBeDisabled();
  });

  it('handles malformed API success (missing item name) gracefully', async () => {
    const user = userEvent.setup();
    // check bad data ok
    const malformedSuggestions = {
      tops: [
        { image_b64: 'base64_image_data_no_name' }, // Missing name
        { name: 'Valid Top', image_b64: 'base64_image_data_valid' }
      ],
      bottoms: [{ name: 'Good Jeans' }], // Fully valid item
    };
    getOutfitSuggestions.mockResolvedValue(malformedSuggestions);

    render(<OutfitSuggestion />);

    const locationInput = screen.getByPlaceholderText(/Your Location/i);
    const weatherInput = screen.getByPlaceholderText(/Current Weather/i);
    const itemsTextarea = screen.getByPlaceholderText(/Owned Clothing Items/i);
    const submitButton = screen.getByRole('button', { name: /Suggest Outfit/i });

    await user.type(locationInput, 'Error Prone City');
    await user.type(weatherInput, 'Unpredictable');
    await user.type(itemsTextarea, 'various items');

    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Suggested Outfit:')).toBeInTheDocument();
    });

    expect(screen.getByText('Tops')).toBeInTheDocument();
    expect(screen.getByText('Valid Top')).toBeInTheDocument();
    const validTopImage = screen.getByAltText('Valid Top');
    expect(validTopImage).toBeInTheDocument();
    expect(validTopImage).toHaveAttribute('src', 'data:image/png;base64,base64_image_data_valid');

    expect(screen.getByText('Bottoms')).toBeInTheDocument();
    expect(screen.getByText('Good Jeans')).toBeInTheDocument();

    const topCategoryDiv = screen.getByText('Tops').closest('.suggestion-category');
    const imagesInTopCategory = topCategoryDiv.querySelectorAll('img');
    expect(imagesInTopCategory).toHaveLength(1);
    expect(imagesInTopCategory[0]).toHaveAttribute('alt', 'Valid Top');

    expect(screen.queryByText('undefined')).not.toBeInTheDocument();
    expect(screen.queryByText('null')).not.toBeInTheDocument();

    expect(screen.queryByText(/Loading suggestions.../i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Error:/i)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Suggest Outfit/i })).not.toBeDisabled();
  });

  it('handles malformed API success (non-array category) gracefully', async () => {
    const user = userEvent.setup();
    // check bad data ok again
    const malformedSuggestions = {
      tops: "this should be an array", // Malformed category
      bottoms: [{ name: 'Valid Jeans', image_b64: 'valid_jeans_img' }], // Valid category
    };
    getOutfitSuggestions.mockResolvedValue(malformedSuggestions);

    render(<OutfitSuggestion />);

    const locationInput = screen.getByPlaceholderText(/Your Location/i);
    const weatherInput = screen.getByPlaceholderText(/Current Weather/i);
    const itemsTextarea = screen.getByPlaceholderText(/Owned Clothing Items/i);
    const submitButton = screen.getByRole('button', { name: /Suggest Outfit/i });

    await user.type(locationInput, 'Data Glitch City');
    await user.type(weatherInput, 'Corrupted');
    await user.type(itemsTextarea, 'mixed data');

    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Suggested Outfit:')).toBeInTheDocument();
    });

    expect(screen.getByText('Bottoms')).toBeInTheDocument();
    expect(screen.getByText('Valid Jeans')).toBeInTheDocument();
    const validBottomImage = screen.getByAltText('Valid Jeans');
    expect(validBottomImage).toBeInTheDocument();
    expect(validBottomImage).toHaveAttribute('src', 'data:image/png;base64,valid_jeans_img');

    expect(screen.getByText('Tops')).toBeInTheDocument();
    const topCategoryDiv = screen.getByText('Tops').closest('.suggestion-category');
    const itemsInTopCategory = topCategoryDiv.querySelectorAll('.suggestion-item');
    expect(itemsInTopCategory).toHaveLength(0);
    expect(screen.getByText('No suggestions for tops.')).toBeInTheDocument();


    expect(screen.queryByText(/Loading suggestions.../i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Error:/i)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Suggest Outfit/i })).not.toBeDisabled();
  });

  it.each([
    { value: null, label: 'null' },
    { value: undefined, label: 'undefined' },
  ])('handles API returning $label gracefully', async ({ value }) => {
    const user = userEvent.setup();
    // check null response ok
    getOutfitSuggestions.mockResolvedValue(value);

    render(<OutfitSuggestion />);

    const locationInput = screen.getByPlaceholderText(/Your Location/i);
    const weatherInput = screen.getByPlaceholderText(/Current Weather/i);
    const itemsTextarea = screen.getByPlaceholderText(/Owned Clothing Items/i);
    const submitButton = screen.getByRole('button', { name: /Suggest Outfit/i });

    await user.type(locationInput, 'Void City');
    await user.type(weatherInput, 'N/A');
    await user.type(itemsTextarea, 'nothingness');

    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText(/Loading suggestions.../i)).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Suggest Outfit/i })).not.toBeDisabled();
    });

    expect(screen.queryByText('Suggested Outfit:')).not.toBeInTheDocument();
    expect(screen.queryByText(/Error:/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Cannot read properties of/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/TypeError/i)).not.toBeInTheDocument();

  });

  it('handles interaction after success: clears old suggestions and shows new ones', async () => {
    const user = userEvent.setup();
    // submit again
    const initialSuggestions = {
      tops: [{ name: 'Initial Top', image_b64: 'initial_top_img' }],
      bottoms: [{ name: 'Initial Bottoms', image_b64: 'initial_bottom_img' }],
    };
    const newSuggestions = {
      tops: [{ name: 'New Top', image_b64: 'new_top_img' }],
      accessories: [{ name: 'New Accessory', image_b64: 'new_acc_img' }],
    };

    // Mock first API call
    getOutfitSuggestions.mockResolvedValueOnce(initialSuggestions);

    render(<OutfitSuggestion />);

    const locationInput = screen.getByPlaceholderText(/Your Location/i);
    const weatherInput = screen.getByPlaceholderText(/Current Weather/i);
    const itemsTextarea = screen.getByPlaceholderText(/Owned Clothing Items/i);
    const submitButton = screen.getByRole('button', { name: /Suggest Outfit/i });

    await user.type(locationInput, 'First City');
    await user.type(weatherInput, 'First Weather');
    await user.type(itemsTextarea, 'first items');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Initial Top')).toBeInTheDocument();
      expect(screen.getByAltText('Initial Top')).toBeInTheDocument();
      expect(screen.getByText('Initial Bottoms')).toBeInTheDocument();
      expect(screen.getByAltText('Initial Bottoms')).toBeInTheDocument();
    });
    expect(getOutfitSuggestions).toHaveBeenCalledTimes(1);

    getOutfitSuggestions.mockImplementationOnce(() => {
      return new Promise(resolve => setTimeout(() => resolve(newSuggestions), 50));
    });

    await user.clear(locationInput);
    await user.type(locationInput, 'Second City');

    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Loading suggestions.../i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Getting Suggestion.../i })).toBeDisabled();
    });

    // check old stuff gone
    expect(screen.queryByText('Initial Top')).not.toBeInTheDocument();
    expect(screen.queryByText('Initial Bottoms')).not.toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText(/Loading suggestions.../i)).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Suggest Outfit/i })).not.toBeDisabled();

      expect(screen.getByText('New Top')).toBeInTheDocument();
      expect(screen.getByAltText('New Top')).toBeInTheDocument();
      expect(screen.getByText('New Accessory')).toBeInTheDocument();
      expect(screen.getByAltText('New Accessory')).toBeInTheDocument();

      expect(screen.queryByText('Bottoms')).not.toBeInTheDocument();
      expect(screen.queryByText('Initial Bottoms')).not.toBeInTheDocument();
    });

    expect(getOutfitSuggestions).toHaveBeenCalledTimes(2);
    const expectedSecondPrompt = "I live in Second City, it's First Weather; I own first items.";
    expect(getOutfitSuggestions).toHaveBeenNthCalledWith(2, { prompt: expectedSecondPrompt, with_images: true });
  });

  it('handles interaction after error: clears error and shows new suggestions', async () => {
    const user = userEvent.setup();
    // submit after error
    const initialErrorMsg = 'Initial API failure';
    const successSuggestions = {
      tops: [{ name: 'Recovery Top', image_b64: 'recovery_top_img' }],
    };

    // Mock first API call to fail
    getOutfitSuggestions.mockRejectedValueOnce(new Error(initialErrorMsg));

    render(<OutfitSuggestion />);

    const locationInput = screen.getByPlaceholderText(/Your Location/i);
    const weatherInput = screen.getByPlaceholderText(/Current Weather/i);
    const itemsTextarea = screen.getByPlaceholderText(/Owned Clothing Items/i);
    const submitButton = screen.getByRole('button', { name: /Suggest Outfit/i });

    await user.type(locationInput, 'Error City');
    await user.type(weatherInput, 'Error Weather');
    await user.type(itemsTextarea, 'error items');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(`Error: ${initialErrorMsg}`)).toBeInTheDocument();
    });
    expect(screen.queryByText('Suggested Outfit:')).not.toBeInTheDocument();
    expect(getOutfitSuggestions).toHaveBeenCalledTimes(1);

    getOutfitSuggestions.mockImplementationOnce(() => {
      return new Promise(resolve => setTimeout(() => resolve(successSuggestions), 50));
    });

    await user.clear(weatherInput);
    await user.type(weatherInput, 'Recovery Weather');

    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Loading suggestions.../i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Getting Suggestion.../i })).toBeDisabled();
    });

    // check error gone
    expect(screen.queryByText(`Error: ${initialErrorMsg}`)).not.toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText(/Loading suggestions.../i)).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Suggest Outfit/i })).not.toBeDisabled();

      expect(screen.getByText('Suggested Outfit:')).toBeInTheDocument();
      expect(screen.getByText('Recovery Top')).toBeInTheDocument();
      expect(screen.getByAltText('Recovery Top')).toBeInTheDocument();

      expect(screen.queryByText(`Error: ${initialErrorMsg}`)).not.toBeInTheDocument();
    });

    expect(getOutfitSuggestions).toHaveBeenCalledTimes(2);
    const expectedSecondPrompt = "I live in Error City, it's Recovery Weather; I own error items.";
    expect(getOutfitSuggestions).toHaveBeenNthCalledWith(2, { prompt: expectedSecondPrompt, with_images: true });
  });
});
