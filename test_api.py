import requests
import os
import uuid

url = "http://127.0.0.1:7860/api/v1/run/f711a718-61e2-4a3d-8a8a-6550c004b4f5"  # The complete API endpoint URL for this flow

# Request payload configuration
payload = {
    "output_type": "chat",
    "input_type": "chat",
    "input_value": "I want to learn about flowers"
}
payload["session_id"] = str(uuid.uuid4())

headers = {
    "accept": "application/json",
    "content-type": "application/json",
    "x-api-key": "sk-DJ3QjjLWEYDO2CJwl3f7pcu50l3lfpmdL5Mxw38mLIY"
}

try:
    # Send API request
    response = requests.request("POST", url, json=payload, headers=headers)
    response.raise_for_status()  # Raise exception for bad status codes

    # Print response
    print(response.text)

except requests.exceptions.RequestException as e:
    print(f"Error making API request: {e}")
except ValueError as e:
    print(f"Error parsing response: {e}")