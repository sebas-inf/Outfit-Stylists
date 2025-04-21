# Test suite for openai_helper.py
import pytest
from unittest.mock import patch, MagicMock
import openai
import json
import os

# Import the module/functions to test
# Assuming openai_helper.py is in the src directory, adjust path if needed
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../src')))
from openai_helper import _generate_clothes_list, _image_for_item, get_outfit


# --- Tests for _generate_clothes_list ---

def test_generate_clothes_list_success(mocker):
    """Test successful generation and parsing of clothes list."""
    
    mock_response = MagicMock()
    mock_response.choices[0].message.content = json.dumps({
        "shirt": ["blue t-shirt", "white polo"],
        "pants": ["khakis"]
    })
    mocker.patch('openai.ChatCompletion.create', return_value=mock_response)

    prompt = "Suggest clothes for a warm day."

    
    result = _generate_clothes_list(prompt)

    
    assert result == {
        "shirt": ["blue t-shirt", "white polo"],
        "pants": ["khakis"]
    }
    openai.ChatCompletion.create.assert_called_once()
    call_args = openai.ChatCompletion.create.call_args[1] # Get keyword arguments
    assert call_args['model'] == "gpt-4o-mini"
    assert call_args['response_format'] == { "type": "json_object" }
    assert any(msg['role'] == 'user' and msg['content'] == prompt for msg in call_args['messages'])


def test_generate_clothes_list_auth_error(mocker):
    """Test handling of AuthenticationError."""
    
    # Raise a generic error, but the except block in the code should catch the real one
    mocker.patch('openai.ChatCompletion.create', side_effect=openai.AuthenticationError(message="Simulated Auth Error", response=MagicMock(), body=None))
    prompt = "Test prompt"

    
    result = _generate_clothes_list(prompt)

    
    assert result == {"error": "OpenAI Authentication Error"}
    openai.ChatCompletion.create.assert_called_once()


def test_generate_clothes_list_generic_error(mocker):
    """Test handling of a generic API error."""
    
    mocker.patch('openai.ChatCompletion.create', side_effect=Exception("API connection failed"))
    prompt = "Test prompt"

    
    result = _generate_clothes_list(prompt)

    
    assert "error" in result
    assert "Failed to generate suggestions: API connection failed" in result["error"]
    openai.ChatCompletion.create.assert_called_once()


def test_generate_clothes_list_malformed_json(mocker):
    """Test handling of malformed JSON response from OpenAI."""
    
    mock_response = MagicMock()
    # Simulate invalid JSON (e.g., missing closing brace)
    mock_response.choices[0].message.content = '{"shirt": ["blue t-shirt"], "pants": ["jeans"'
    mocker.patch('openai.ChatCompletion.create', return_value=mock_response)
    prompt = "Test prompt"

    
    result = _generate_clothes_list(prompt)

    
    assert "error" in result
    # Check that the error message indicates a JSON decoding issue (more robust check)
    assert "Failed to generate suggestions" in result["error"]
    assert "delimiter" in result["error"] or "Extra data" in result["error"] # Check for common JSON decode error messages
    openai.ChatCompletion.create.assert_called_once()


# --- Tests for _image_for_item ---

def test_image_for_item_success(mocker):
    """Test successful image generation."""
    
    mock_image_response = MagicMock()
    mock_image_response.data[0].b64_json = "fake_base64_string"
    mocker.patch('openai.Image.create', return_value=mock_image_response)

    item_name = "red scarf"

    
    result = _image_for_item(item_name)

    
    assert result == "fake_base64_string"
    openai.Image.create.assert_called_once()
    call_args = openai.Image.create.call_args[1]
    assert call_args['model'] == "dall-e-3"
    assert call_args['response_format'] == "b64_json"
    assert item_name in call_args['prompt']


def test_image_for_item_auth_error(mocker):
    """Test handling AuthenticationError during image generation."""
    
    # Raise a generic error, but the except block in the code should catch the real one
    mocker.patch('openai.Image.create', side_effect=openai.AuthenticationError(message="Simulated Auth Error", response=MagicMock(), body=None))
    item_name = "red scarf"

    
    result = _image_for_item(item_name)

    
    assert result == "" # Expect empty string on error
    openai.Image.create.assert_called_once()


def test_image_for_item_generic_error(mocker):
    """Test handling generic Exception during image generation."""
    
    mocker.patch('openai.Image.create', side_effect=Exception("Image generation failed"))
    item_name = "red scarf"

    
    result = _image_for_item(item_name)

    
    assert result == "" # Expect empty string on error
    openai.Image.create.assert_called_once()


# --- Tests for get_outfit ---

@pytest.fixture
def mock_generate_clothes_list(mocker):
    """Fixture to mock the internal _generate_clothes_list function."""
    return mocker.patch('openai_helper._generate_clothes_list')

@pytest.fixture
def mock_image_for_item(mocker):
    """Fixture to mock the internal _image_for_item function."""
    return mocker.patch('openai_helper._image_for_item')


def test_get_outfit_without_images_success(mock_generate_clothes_list, mock_image_for_item):
    """Test get_outfit without images, successful list generation."""
    
    prompt = "Test prompt"
    mock_data = {"shirt": ["test shirt"], "pants": ["test pants"]}
    mock_generate_clothes_list.return_value = mock_data

    
    result = get_outfit(prompt, has_images=False)

    
    assert result == mock_data
    mock_generate_clothes_list.assert_called_once_with(prompt)
    mock_image_for_item.assert_not_called() # Ensure image generation wasn't called


def test_get_outfit_without_images_list_error(mock_generate_clothes_list, mock_image_for_item):
    """Test get_outfit without images when list generation fails."""
    
    prompt = "Test prompt"
    error_data = {"error": "List generation failed"}
    mock_generate_clothes_list.return_value = error_data

    
    result = get_outfit(prompt, has_images=False)

    
    assert result == error_data # Error should be propagated
    mock_generate_clothes_list.assert_called_once_with(prompt)
    mock_image_for_item.assert_not_called()


def test_get_outfit_has_images_full_success(mock_generate_clothes_list, mock_image_for_item):
    """Test get_outfit with images, successful list and image generation."""
    
    prompt = "Test prompt"
    mock_list_data = {"shirt": ["blue shirt"], "pants": ["jeans"]}
    mock_generate_clothes_list.return_value = mock_list_data

    # Configure mock_image_for_item to return a fake b64 string for any item
    mock_image_for_item.return_value = "fake_b64_string"

    result = get_outfit(prompt, has_images=True)

    
    expected_result = {
        "shirt": [{"name": "blue shirt", "image_b64": "fake_b64_string"}],
        "pants": [{"name": "jeans", "image_b64": "fake_b64_string"}]
    }
    assert result == expected_result
    mock_generate_clothes_list.assert_called_once_with(prompt)
    # Check that _image_for_item was called for each item
    assert mock_image_for_item.call_count == 2
    mock_image_for_item.assert_any_call("blue shirt")
    mock_image_for_item.assert_any_call("jeans")


def test_get_outfit_has_images_partial_failure(mock_generate_clothes_list, mock_image_for_item):
    """Test get_outfit with images when some image generations fail."""
    
    prompt = "Test prompt"
    mock_list_data = {"shirt": ["blue shirt"], "pants": ["jeans"]}
    mock_generate_clothes_list.return_value = mock_list_data

    # Configure mock_image_for_item to fail for "jeans"
    def image_side_effect(item_name):
        if item_name == "jeans":
            return "" # Simulate failure
        return "fake_b64_string" # Success for others
    mock_image_for_item.side_effect = image_side_effect

    
    result = get_outfit(prompt, has_images=True)

    
    expected_result = {
        "shirt": [{"name": "blue shirt", "image_b64": "fake_b64_string"}],
        "pants": [{"name": "jeans", "image_b64": None}] # Expect None for failed image
    }
    assert result == expected_result
    mock_generate_clothes_list.assert_called_once_with(prompt)
    assert mock_image_for_item.call_count == 2
    mock_image_for_item.assert_any_call("blue shirt")
    mock_image_for_item.assert_any_call("jeans")


def test_get_outfit_has_images_list_error(mock_generate_clothes_list, mock_image_for_item):
    """Test get_outfit with images when list generation fails."""
    
    prompt = "Test prompt"
    error_data = {"error": "List generation failed"}
    mock_generate_clothes_list.return_value = error_data

    
    result = get_outfit(prompt, has_images=True) # has_images is True

    
    assert result == error_data # Error should be propagated
    mock_generate_clothes_list.assert_called_once_with(prompt)
    mock_image_for_item.assert_not_called() # Image generation should not be called
