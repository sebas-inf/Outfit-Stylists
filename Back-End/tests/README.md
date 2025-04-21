# How to Run Tests for openai_helper

Hey! So you wanna run the tests for the `openai_helper.py` file? Its pretty easy.

These tests check if the code that talks to OpenAI (the AI thingy) is working right. We use something called `pytest` to run them.

## Steps

1.  **Open your terminal:** This is like the command prompt or powershell on windows, or terminal on mac/linux.
2.  **Go to the Back-End folder:** You need to be in the right place. Use the `cd` command. Like this:
    ```bash
    cd path/to/your/project/Outfit-Stylists/Back-End
    ```
    *(Make sure to replace `path/to/your/project` with the actual path on your computer!)*
3.  **Make sure you have pytest:** If you dont have it, you need to install it. You probably need python installed first. Then run:
    ```bash
    pip install pytest pytest-mock openai
    ```
    *(You might need `pip3` instead of `pip` depending on your setup)*. You might also need to install stuff from `requirements.txt` first, using `pip install -r requirements.txt`.
4.  **Set up your OpenAI Key:** The tests need an OpenAI API key to talk to OpenAI (sometimes, even though we try to fake it). Make sure you have an environment variable called `OPENAI_API_KEY` set with your key. How to do this depends on your system (google "set environment variable mac/windows/linux"). If you dont have one, the tests might fail or give errors.
5.  **Run the tests!:** Now just type this command:
    ```bash
    cd Back-End
    ```

    ```bash
    pytest
    ```
    This tells pytest to only run the tests in that specific file.

That's it! You should see some output telling you if the tests passed (dots or "ok") or failed ("F" or "ERROR"). Good luck! 
