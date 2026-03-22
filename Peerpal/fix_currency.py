import re
import glob

def run():
    files = glob.glob('c:/Users/MVP/Downloads/PeerPal/Peerpal/src/**/*.jsx', recursive=True)
    
    # 1. R followed by { (e.g. R{tutor.rate})
    pattern1 = re.compile(r'\bR\{')
    
    # 2. R followed by space then digits maybe comma (R 245,000)
    pattern2 = re.compile(r'\bR\s+([0-9,]+)')
    
    # 3. R followed by digits (R150, R100)
    pattern3 = re.compile(r'\bR([0-9,]+)')
    
    for f in files:
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
            
        new_content = content
        new_content = pattern1.sub(r'₦{', new_content)
        new_content = pattern2.sub(r'₦\1', new_content)
        new_content = pattern3.sub(r'₦\1', new_content)
        
        if new_content != content:
            with open(f, 'w', encoding='utf-8') as file:
                file.write(new_content)
            print("Updated:", f)

if __name__ == '__main__':
    run()