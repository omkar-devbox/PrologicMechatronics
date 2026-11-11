import json, os, urllib.request, ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
    "Referer": "https://www.bellatorengineers.in/"
}

with open("/home/omkar/Documents/My/bella/scripts/products_scraped.json") as f:
    products = json.load(f)

public_files = set(os.listdir("/home/omkar/Documents/My/bella/public"))
downloaded = 0
failed = 0

for slug, data in products.items():
    for img_url in data.get("images", []):
        filename = img_url.split("/")[-1]
        local_path = os.path.join("/home/omkar/Documents/My/bella/public", filename)
        if filename in public_files and os.path.getsize(local_path) > 1000:
            continue
        try:
            print(f"Downloading {filename}...")
            req = urllib.request.Request(img_url, headers=headers)
            with urllib.request.urlopen(req, context=ctx, timeout=15) as resp:
                content = resp.read()
                if len(content) > 500:
                    with open(local_path, "wb") as out:
                        out.write(content)
                    public_files.add(filename)
                    downloaded += 1
                    print(f"[SAVED] {filename} ({len(content)} bytes)")
                else:
                    print(f"[SKIP] {filename} too small ({len(content)} bytes)")
        except Exception as e:
            print(f"[FAIL] {filename}: {e}")
            failed += 1

print(f"Total newly downloaded: {downloaded}, Failed: {failed}")
