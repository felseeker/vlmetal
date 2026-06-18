from playwright.sync_api import sync_playwright
import os

html_path = r'C:\Users\Михаил\Desktop\vlmetal\index.html'
output_path = r'C:\Users\Михаил\Desktop\vlmetal\current-screenshot.png'

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={'width': 1440, 'height': 900})
    file_url = 'file:///' + os.path.abspath(html_path).replace('\\', '/')
    page.goto(file_url)
    page.wait_for_timeout(2000)
    page.screenshot(path=output_path, full_page=True)
    browser.close()
    print('Done: ' + output_path)
