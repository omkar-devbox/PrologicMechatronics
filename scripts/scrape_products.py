import urllib.request, re, ssl, json, os

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

urls = [
  "https://www.bellatorengineers.in/butterfly-damper-valves/",
  "https://www.bellatorengineers.in/air-seal-damper-valves/",
  "https://www.bellatorengineers.in/double-offset-butterfly-damper-valves/",
  "https://www.bellatorengineers.in/triple-offset-butterfly-damper-valves/",
  "https://www.bellatorengineers.in/double-disc-gate-valves/",
  "https://www.bellatorengineers.in/three-lever-shut-off-damper-valves/",
  "https://www.bellatorengineers.in/three-way-diverter-damper-valves/",
  "https://www.bellatorengineers.in/multi-louver-damper-valves/",
  "https://www.bellatorengineers.in/poppet-damper-valves/",
  "https://www.bellatorengineers.in/guillotine-damper-valves/",
  "https://www.bellatorengineers.in/refractory-lined-damper-valves/",
  "https://www.bellatorengineers.in/double-flap-damper-valves/",
  "https://www.bellatorengineers.in/ventilation-channel-closing-device/",
  "https://www.bellatorengineers.in/back-draft-damper-valves/",
  "https://www.bellatorengineers.in/right-angle-valves/",
  "https://www.bellatorengineers.in/straight-pattern-inline-valves/",
  "https://www.bellatorengineers.in/crystallizer-discharge-gate-valves/",
  "https://www.bellatorengineers.in/fabricated-double-beat-valves/",
  "https://www.bellatorengineers.in/twin-seal-flap-damper-valves/",
  "https://www.bellatorengineers.in/stack-damper-valves/",
  "https://www.bellatorengineers.in/fire-damper-valves/"
]

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": "https://www.bellatorengineers.in/"
}

results = {}

for u in urls:
    slug = u.strip("/").split("/")[-1]
    try:
        req = urllib.request.Request(u, headers=headers)
        with urllib.request.urlopen(req, context=ctx, timeout=15) as resp:
            html = resp.read().decode("utf-8", errors="ignore")
            # extract title
            title_m = re.search(r"<title>(.*?)(?:&#8211;|-|\|).*?</title>", html, re.DOTALL | re.IGNORECASE)
            title = title_m.group(1).strip() if title_m else slug.replace("-", " ").title()
            
            # extract text paragraphs inside entry-content or post content
            p_matches = re.findall(r"<p[^>]*>(.*?)</p>", html, re.DOTALL | re.IGNORECASE)
            cleaned_p = []
            for p in p_matches:
                txt = re.sub(r"<[^>]+>", "", p).strip()
                if len(txt) > 40 and not any(bad in txt.lower() for bad in ["cookie", "rights reserved", "theme", "avada", "elementor", "designed by"]):
                    cleaned_p.append(txt)
            
            # extract list items
            li_matches = re.findall(r"<li[^>]*>(.*?)</li>", html, re.DOTALL | re.IGNORECASE)
            cleaned_li = []
            for li in li_matches:
                txt = re.sub(r"<[^>]+>", "", li).strip()
                if 15 < len(txt) < 250 and not any(bad in txt.lower() for bad in ["home", "menu", "contact", "about", "tel:", "mailto:"]):
                    cleaned_li.append(txt)

            # extract images from upload
            imgs = re.findall(r"https://www\.bellatorengineers\.in/wp-content/uploads/[^\s\"\'\<\>]+?\.(?:png|jpg|jpeg|webp)", html)
            prod_imgs = []
            for img in imgs:
                # filter out thumbnails like -150x150, -300x, icons
                if any(bad in img for bad in ["cropped-fav", "logo", "Untitled-design", "eael-", "fusion-"]):
                    continue
                # strip size suffixes like -360x500.png if full exists
                clean_img = re.sub(r"-\d+x\d+\.", ".", img)
                if clean_img not in prod_imgs:
                    prod_imgs.append(clean_img)
            
            results[slug] = {
                "title": title,
                "url": u,
                "description": cleaned_p[:3],
                "specifications": cleaned_li[:8],
                "images": prod_imgs
            }
            print(f"[OK] {slug}: title='{title}', {len(prod_imgs)} imgs, {len(cleaned_p)} paras")
    except Exception as e:
        print(f"[ERR] {slug}: {e}")

with open("/home/omkar/Documents/My/bella/scripts/products_scraped.json", "w") as f:
    json.dump(results, f, indent=2)

print("Saved scraping data successfully!")
