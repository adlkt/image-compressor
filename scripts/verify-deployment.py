"""Fail CI unless this commit's Cloudflare Pages deployment succeeds."""
import json
import os
import time
import urllib.request

base = (
    "https://api.cloudflare.com/client/v4/accounts/"
    + os.environ["CLOUDFLARE_ACCOUNT_ID"]
    + "/pages/projects/image-compressor/deployments"
)


def get(path):
    request = urllib.request.Request(
        base + path,
        headers={"Authorization": "Bearer " + os.environ["CLOUDFLARE_API_TOKEN"]},
    )
    with urllib.request.urlopen(request, timeout=30) as response:
        payload = json.load(response)
    if not payload["success"]:
        raise RuntimeError("Cloudflare API request failed")
    return payload["result"]


for attempt in range(30):
    deployments = get("")
    deployment = next(
        (item for item in deployments
         if item["deployment_trigger"]["metadata"].get("commit_hash") == os.environ["GITHUB_SHA"]),
        None,
    )
    if deployment:
        stage = deployment["latest_stage"]
        if stage["name"] == "deploy" and stage["status"] == "success":
            print("Cloudflare deployment succeeded: " + deployment["url"])
            break
        if stage["status"] in ("failure", "canceled"):
            logs = get("/" + deployment["id"] + "/history/logs")
            for entry in logs.get("data", []):
                print(entry["line"])
            raise SystemExit("Cloudflare deployment failed")
    time.sleep(10)
else:
    raise SystemExit("Timed out waiting for Cloudflare deployment")
