import sys, subprocess, re, html
sys.stdout.reconfigure(encoding='utf-8')
import base64, urllib.parse
from html.parser import HTMLParser
class Text(HTMLParser):
    def __init__(self): super().__init__(); self.skip=0
    def handle_starttag(self,t,a):
        if t in ('script','style'): self.skip+=1
        if t=='a':
            u=dict(a).get('href','')
            if 'bing.com/ck/a' in u:
                v=urllib.parse.parse_qs(urllib.parse.urlparse(u).query).get('u',[''])[0]
                if v.startswith('a1'):
                    try: u=base64.urlsafe_b64decode(v[2:]+'===').decode()
                    except: pass
            if u.startswith('http'): print('\nLINK',html.unescape(u))
        if t in ('p','div','h1','h2','h3','li','br'): print()
    def handle_endtag(self,t):
        if t in ('script','style'): self.skip=max(0,self.skip-1)
    def handle_data(self,d):
        if not self.skip and d.strip(): print(d.strip(),end=' ')
data=subprocess.run(['curl.exe','-sL','--max-time','35',sys.argv[1]],capture_output=True).stdout.decode('utf-8','replace')
Text().feed(data)
