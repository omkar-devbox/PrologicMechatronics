import os
import re
import urllib.request
from urllib.parse import urljoin, urlparse
from html.parser import HTMLParser

BASE_URL = "https://www.prologicmechatronics.com"
HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"}
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
PUBLIC_DIR = os.path.join(PROJECT_ROOT, "public")

class LinkAndImageParser(HTMLParser):
    def __init__(self, base_page_url):
        super().__init__()
        self.base_page_url = base_page_url
        self.images = set()
        self.links = set()

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        
        # Collect links
        if tag == "a" and "href" in attrs_dict:
            href = attrs_dict["href"]
            if href and not href.startswith("javascript:") and not href.startswith("mailto:") and not href.startswith("tel:"):
                full_url = urljoin(self.base_page_url, href).split("#")[0]
                self.links.add(full_url)
                
        # Collect images & icons
        for attr_name in ["src", "data-src", "srcset", "href"]:
            if attr_name in attrs_dict:
                val = attrs_dict[attr_name]
                if val:
                    for item in val.split(","):
                        u = item.strip().split(" ")[0]
                        if u and not u.startswith("data:"):
                            full_u = urljoin(self.base_page_url, u)
                            path = urlparse(full_u).path
                            ext = os.path.splitext(path)[1].lower()
                            if ext in [".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif", ".ico", ".avif"]:
                                self.images.add(full_u)

def fetch_html(url):
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            return resp.read().decode("utf-8", errors="ignore")
    except Exception as e:
        print(f"Failed to fetch {url}: {e}")
        return ""

def crawl():
    visited_pages = set()
    pages_to_visit = [BASE_URL]
    
    # Try sitemap
    try:
        sitemap_html = fetch_html(f"{BASE_URL}/sitemap.xml")
        if sitemap_html:
            locs = re.findall(r"<loc>(.*?)</loc>", sitemap_html)
            for loc in locs:
                if "prologicmechatronics.com" in loc:
                    ext = os.path.splitext(urlparse(loc).path)[1].lower()
                    if ext not in [".pdf", ".jpg", ".png", ".webp", ".mp4", ".zip"]:
                        pages_to_visit.append(loc)
    except Exception as e:
        print("Sitemap parse error:", e)

    all_images = set()

    while pages_to_visit and len(visited_pages) < 40:
        page = pages_to_visit.pop(0)
        if page in visited_pages:
            continue
        visited_pages.add(page)
        print(f"Crawling: {page}")

        html = fetch_html(page)
        if not html:
            continue

        parser = LinkAndImageParser(page)
        try:
            parser.feed(html)
        except Exception as e:
            print(f"HTML parse error on {page}: {e}")

        all_images.update(parser.images)

        # Regex for background images
        bg_matches = re.findall(r'url\([\'"]?([^\'"\)]+)[\'"]?\)', html)
        for bg in bg_matches:
            if not bg.startswith("data:"):
                full_bg = urljoin(page, bg)
                ext = os.path.splitext(urlparse(full_bg).path)[1].lower()
                if ext in [".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif", ".ico", ".avif"]:
                    all_images.add(full_bg)

        # Queue new internal pages
        for link in parser.links:
            parsed = urlparse(link)
            if parsed.netloc == urlparse(BASE_URL).netloc:
                clean_link = link.split("?")[0].split("#")[0]
                ext = os.path.splitext(parsed.path)[1].lower()
                if clean_link not in visited_pages and clean_link not in pages_to_visit:
                    if ext not in [".pdf", ".jpg", ".png", ".webp", ".mp4", ".zip", ".css", ".js"]:
                        pages_to_visit.append(clean_link)

    print(f"\nDiscovered {len(all_images)} unique images.")

    downloaded = 0
    os.makedirs(PUBLIC_DIR, exist_ok=True)
    
    for img_url in sorted(all_images):
        try:
            parsed = urlparse(img_url)
            filename = os.path.basename(parsed.path)
            if not filename:
                continue
            if "?" in filename:
                filename = filename.split("?")[0]
            
            dest_file = os.path.join(PUBLIC_DIR, filename)
            req = urllib.request.Request(img_url, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=15) as resp, open(dest_file, "wb") as f:
                f.write(resp.read())
            print(f"[✓] Saved: {filename}")
            downloaded += 1
        except Exception as e:
            print(f"[✗] Failed {img_url}: {e}")

    print(f"\nSuccessfully downloaded {downloaded} image files into {PUBLIC_DIR}")

if __name__ == "__main__":
    crawl()
