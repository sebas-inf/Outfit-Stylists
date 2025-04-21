import os, openai, base64, requests
from typing import Dict, List
import json

api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    print("Warning: OPENAI_API_KEY environment variable not set.")
openai.api_key = api_key


def _generate_clothes_list(prompt: str) -> Dict[str, List[str]]:
    """Return JSON like {"shirt": [...], "pants": [...], ...}."""
    system_msg = (
        "You are a wardrobe assistant. "
        "Return *only* JSON with keys shirt, pants, shoes, accessory. "
        "Each key maps to a list of item names."
    )
    try:
        res = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_msg},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            response_format={ "type": "json_object" }
        )

        content = res.choices[0].message.content
        return json.loads(content)
    except openai.AuthenticationError:
        print("OpenAI Authentication Error: Check your API key.")
        return {"error": "OpenAI Authentication Error"}
    except Exception as e:
        print(f"Error generating clothes list: {e}")

        return {"error": f"Failed to generate suggestions: {e}"}


def _image_for_item(item: str) -> str:
    """Return base64‑encoded PNG for *item*."""
    try:
        img = openai.Image.create(
            model="dall-e-3",
            prompt=f"Studio photo of {item} on white background, clear view, professional quality",
            n=1,
            size="256x256",
            response_format="b64_json"
        )

        return img.data[0].b64_json
    except openai.AuthenticationError:
        print("OpenAI Authentication Error: Check your API key.")
        return ""
    except Exception as e:
        print(f"Error generating image for '{item}': {e}")
        return ""


def get_outfit(prompt: str, has_images: bool = False) -> Dict[str, List[str]]:
    """Return a dict of outfit suggestions. Attach images when *has_images* is True."""
    items = _generate_clothes_list(prompt)


    if "error" in items:
        return items

    if not has_images:
        return items

    enriched = {}
    for cat, lst in items.items():
        enriched_items = []
        for itm in lst:
            image_b64 = _image_for_item(itm)

            if image_b64:
                enriched_items.append({"name": itm, "image_b64": image_b64})
            else:

                 enriched_items.append({"name": itm, "image_b64": None})
        enriched[cat] = enriched_items
    return enriched


if __name__ == '__main__':
    import sys
    if len(sys.argv) > 1:
        input_prompt = sys.argv[1]


        generate_images = "--with-images" in sys.argv
        outfit = get_outfit(input_prompt, has_images=generate_images)
        print(json.dumps(outfit))
    else:

        print("Usage: python openai_helper_broken.py \"<prompt>\" [--with-images]")
