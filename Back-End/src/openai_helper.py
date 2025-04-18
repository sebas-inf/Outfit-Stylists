import os, openai, base64, requests
from typing import Dict, List
import json

api_key = os.getenv("OPENAI_API_KEY")
openai.api_key = api_key

def _generate_clothes_list (prompt:str) -> Dict[str, List[str]]:
    # Returns a json that looks like {"shirt": [...], "pants": [...], ...}
    system_prompt = "You are a wardrobe assistant. Return *only* JSON keys shirt, pants, shoes, accesory. Each key maps to a list of item names." 
    try: 
        response = openai.ChatCompletion.create(
            model = "gpt-4o-mini", 
            messages = [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt}
            ], 
            temperature = 0.5,
            response_format = {
                "type": "json_object"
            }
        ) 
        content = response.choices[0].message.content
        return json.loads(content)
    except openai.error.AuthenticationError: 
        print("check API Key")
        return {"error": "authentication error"}
    except Exception as e: 
        print(f"Error generating clothes list: {e}")
        return {"error": f"failed to generate suggestions: {e}"}
    
def _image_for_item(item: str) -> str:
    # Return a base64-encoded png for some item.
    try:
        img = openai.Image.create(
            model="dall-e-3",
            prompt=f"Sutdio photo of {item} on white background, clear view, high quality",
            n=1,
            size="256x256",
            response_format="b64_json"
        )
        return img.data[0].b64_json
    except openai.error.AuthenticationError: 
        print("check API Key")
        return {"error": "authentication error"}
    except Exception as e: 
        print(f"Error generating clothes list: {e}")
        return {"error": f"failed to generate suggestions: {e}"}
    
def get_outfit(prompt: str, has_images: bool = False) -> Dict[str, List[str]]:
    items = _generate_clothes_list(prompt)

    if "error" in items:
        return items
    if not has_images:
        return items
    enhanced = {}
    for cat, list in items.items():
        enhanced_items = []
        for item in list:
            image_b64 = _image_for_item(item)

            if image_b64:
                enhanced_items.append({"name": item, "image_b64": image_b64})
            else:
                enhanced_items.append({"name": item, "image_b64": None})
        enhanced[cat] = enhanced_items
    
    return enhanced