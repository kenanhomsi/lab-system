import urllib.request
import urllib.parse
import re

urls = [
    "https://metwalilabs.com/%d8%ae%d8%af%d9%85%d8%a7%d8%aa-%d8%a7%d9%84%d9%85%d8%b1%d8%b6%d9%89/",
    "https://metwalilabs.com/%d8%ae%d8%af%d9%85%d8%a7%d8%aa-%d8%a7%d9%84%d8%a7%d8%b7%d8%a8%d8%a7%d8%a1/",
    "https://metwalilabs.com/%d8%ae%d8%af%d9%85%d8%a7%d8%aa-%d8%a7%d9%84%d9%85%d8%ae%d8%a7%d8%a8%d8%b1/",
    "https://metwalilabs.com/%d8%ae%d8%af%d9%85%d8%a7%d8%aa-%d8%a7%d9%84%d8%b4%d8%b1%d9%83%d8%a7%d8%aa/"
]

for u in urls:
    try:
        req = urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0'})
        html = urllib.request.urlopen(req).read().decode('utf-8')
        imgs = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', html)
        print(f"URL: {u}")
        for img in imgs:
            if "uploads" in img:
                print("  ", img)
    except Exception as e:
        print(e)
