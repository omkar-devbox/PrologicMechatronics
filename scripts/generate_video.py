#!/usr/bin/env python3
import os
import math
import wave
import struct
import subprocess
from PIL import Image, ImageDraw, ImageFont

# Output paths
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(SCRIPT_DIR, ".."))
PUBLIC_DIR = os.path.join(PROJECT_ROOT, "public")
OUTPUT_MP4 = os.path.join(PUBLIC_DIR, "valves-showcase.mp4")
OUTPUT_WEBM = os.path.join(PUBLIC_DIR, "valves-showcase.webm")

IMG_BE20 = os.path.join(PUBLIC_DIR, "BE20-Pneumatic-Double-Offset-Butterfly-Damper-Valve.png")
IMG_BE200 = os.path.join(PUBLIC_DIR, "BE200-Manual-Straight-Pattern-Inline-Valve.png")
IMG_MOTORIZED = os.path.join(PUBLIC_DIR, "Motorized-Double-Disc-Gate-Valve-main-image.webp")

WIDTH = 1920
HEIGHT = 1080
FPS = 30
DURATION = 22.0 # seconds total
TOTAL_FRAMES = int(FPS * DURATION) # 660 frames

# Fonts
FONT_BOLD_PATH = "/usr/share/fonts/open-sans/OpenSans-Bold.ttf"
FONT_REG_PATH = "/usr/share/fonts/open-sans/OpenSans-Regular.ttf"

font_logo = ImageFont.truetype(FONT_BOLD_PATH, 34)
font_badge = ImageFont.truetype(FONT_BOLD_PATH, 16)
font_title_hero = ImageFont.truetype(FONT_BOLD_PATH, 56)
font_title = ImageFont.truetype(FONT_BOLD_PATH, 36)
font_subtitle = ImageFont.truetype(FONT_REG_PATH, 21)
font_section = ImageFont.truetype(FONT_BOLD_PATH, 24)
font_body = ImageFont.truetype(FONT_REG_PATH, 18)
font_body_bold = ImageFont.truetype(FONT_BOLD_PATH, 18)
font_footer = ImageFont.truetype(FONT_REG_PATH, 16)
font_card_title = ImageFont.truetype(FONT_BOLD_PATH, 20)

# Colors
BG_DARK = (9, 14, 26)
BG_TOP = (15, 23, 42)
CYAN_ACCENT = (56, 189, 248)
INDIGO_ACCENT = (129, 140, 248)
EMERALD_ACCENT = (52, 211, 153)
AMBER_ACCENT = (251, 191, 36)
WHITE = (255, 255, 255)
SLATE_200 = (226, 232, 240)
SLATE_400 = (148, 163, 184)
SLATE_600 = (71, 85, 105)
CARD_BG = (17, 26, 47)
BORDER_COLOR = (45, 62, 98)

raw_be20 = Image.open(IMG_BE20).convert("RGBA")
raw_be200 = Image.open(IMG_BE200).convert("RGBA")
raw_motorized = Image.open(IMG_MOTORIZED).convert("RGBA")

# Pre-render background base image
def create_base_bg():
    bg = Image.new("RGB", (WIDTH, HEIGHT), BG_DARK)
    draw = ImageDraw.Draw(bg)
    for y in range(HEIGHT):
        fac = y / HEIGHT
        r = int(15 * (1 - fac) + 6 * fac)
        g = int(23 * (1 - fac) + 10 * fac)
        b = int(42 * (1 - fac) + 20 * fac)
        draw.line([(0, y), (WIDTH, y)], fill=(r, g, b))
    
    # Technical blueprint grid lines
    for x in range(0, WIDTH, 80):
        draw.line([(x, 0), (x, HEIGHT)], fill=(22, 33, 58), width=1)
    for y in range(0, HEIGHT, 80):
        draw.line([(0, y), (WIDTH, y)], fill=(22, 33, 58), width=1)
        
    return bg

BASE_BG = create_base_bg()

def draw_header(draw, active_idx=0):
    # Top bar glowing indicator dot
    draw.ellipse([(80, 48), (92, 60)], fill=CYAN_ACCENT)
    draw.text((106, 38), "BELLATOR ENGINEERS", fill=WHITE, font=font_logo)
    draw.text((495, 47), "INDUSTRIAL FLOW CONTROL SYSTEMS", fill=SLATE_400, font=font_subtitle)
    
    # Step indicators on top right
    labels = ["OVERVIEW", "BE20 DAMPER", "BE200 INLINE", "MOTORIZED GATE", "SUMMARY"]
    x_pos = 1100
    for idx, label in enumerate(labels):
        is_active = (idx == active_idx)
        color = CYAN_ACCENT if is_active else SLATE_600
        text_color = WHITE if is_active else SLATE_400
        
        draw.rounded_rectangle([(x_pos, 42), (x_pos + 140, 68)], radius=12, 
                               fill=(23, 37, 70) if is_active else (15, 23, 42), 
                               outline=color, width=1)
        bbox = font_badge.getbbox(label)
        tw = bbox[2] - bbox[0]
        draw.text((x_pos + (140 - tw)//2, 46), label, fill=text_color, font=font_badge)
        x_pos += 150
        
    draw.line([(80, 85), (WIDTH - 80, 85)], fill=BORDER_COLOR, width=1)

def draw_footer(draw, frame_idx):
    draw.line([(80, HEIGHT - 70), (WIDTH - 80, HEIGHT - 70)], fill=BORDER_COLOR, width=1)
    # Animated progress bar
    progress = min(1.0, frame_idx / TOTAL_FRAMES)
    bar_w = int((WIDTH - 160) * progress)
    draw.rectangle([(80, HEIGHT - 70), (80 + bar_w, HEIGHT - 68)], fill=CYAN_ACCENT)
    
    draw.text((80, HEIGHT - 55), "HIGH INTEGRITY VALVE ENGINEERING  •  ISO 9001:2015 CERTIFIED STANDARDS", fill=SLATE_400, font=font_footer)
    draw.text((WIDTH - 380, HEIGHT - 55), "WWW.BELLATORENGINEERS.IN", fill=CYAN_ACCENT, font=font_footer)

def draw_product_card(frame, img_raw, zoom, center_x, center_y, box_w=660, box_h=720, badge_text=""):
    x0 = center_x - box_w // 2
    y0 = center_y - box_h // 2
    x1 = center_x + box_w // 2
    y1 = center_y + box_h // 2
    
    draw = ImageDraw.Draw(frame)
    # White showcase stage
    draw.rounded_rectangle([(x0, y0), (x1, y1)], radius=24, fill=(255, 255, 255), outline=BORDER_COLOR, width=2)
    draw.rounded_rectangle([(x0-2, y0-2), (x1+2, y1+2)], radius=26, outline=(40, 60, 95), width=2)
    
    # Scale image with Ken Burns zoom
    target_h = int((box_h - 110) * zoom)
    scale = target_h / img_raw.height
    target_w = int(img_raw.width * scale)
    if target_w > box_w - 60:
        target_w = int((box_w - 60) * zoom)
        scale = target_w / img_raw.width
        target_h = int(img_raw.height * scale)
        
    resized = img_raw.resize((target_w, target_h), Image.Resampling.LANCZOS)
    
    # Center image
    paste_x = center_x - target_w // 2
    paste_y = center_y - target_h // 2 + 15
    frame.paste(resized, (paste_x, paste_y), resized)
    
    # Dynamic width badge inside card
    if badge_text:
        bbox = font_badge.getbbox(badge_text)
        bw = bbox[2] - bbox[0] + 36
        draw.rounded_rectangle([(x0 + 30, y0 + 25), (x0 + 30 + bw, y0 + 25 + 36)], radius=18, fill=(15, 23, 42))
        draw.text((x0 + 48, y0 + 33), badge_text, fill=CYAN_ACCENT, font=font_badge)

def render_scene_intro(frame_idx, local_frame, total_scene_frames):
    im = BASE_BG.copy()
    draw = ImageDraw.Draw(im)
    draw_header(draw, active_idx=0)
    draw_footer(draw, frame_idx)
    
    # Pill Tag
    draw.rounded_rectangle([(WIDTH//2 - 180, 160), (WIDTH//2 + 180, 196)], radius=18, 
                           fill=(23, 37, 70), outline=CYAN_ACCENT, width=1)
    tag_txt = "ENGINEERED VALVES & FLOW AUTOMATION"
    bbox = font_badge.getbbox(tag_txt)
    draw.text((WIDTH//2 - (bbox[2]-bbox[0])//2, 168), tag_txt, fill=CYAN_ACCENT, font=font_badge)
    
    # Hero Title
    title1 = "PRECISION INDUSTRIAL VALVES"
    bbox = font_title_hero.getbbox(title1)
    draw.text((WIDTH//2 - (bbox[2]-bbox[0])//2, 220), title1, fill=WHITE, font=font_title_hero)
    
    sub = "High-integrity butterfly dampers, inline isolation valves, and motorized gate systems"
    bbox = font_subtitle.getbbox(sub)
    draw.text((WIDTH//2 - (bbox[2]-bbox[0])//2, 295), sub, fill=SLATE_200, font=font_subtitle)
    
    # 3 Product Cards Preview
    cards_data = [
        (raw_be20, "BE20 Butterfly Damper", "Pneumatic Control", 400),
        (raw_be200, "BE200 Inline Valve", "Manual High-Pressure", 960),
        (raw_motorized, "Motorized Gate Valve", "Double Disc Automated", 1520)
    ]
    
    for img, title, subtitle, cx in cards_data:
        cw, ch = 380, 430
        cy = 600
        x0, y0 = cx - cw//2, cy - ch//2
        x1, y1 = cx + cw//2, cy + ch//2
        
        draw.rounded_rectangle([(x0, y0), (x1, y1)], radius=20, fill=(255, 255, 255), outline=BORDER_COLOR, width=2)
        
        max_ih = 270
        ratio = min(300 / img.width, max_ih / img.height)
        iw, ih = int(img.width * ratio), int(img.height * ratio)
        res = img.resize((iw, ih), Image.Resampling.LANCZOS)
        im.paste(res, (cx - iw//2, cy - ih//2 - 20), res)
        
        draw.rounded_rectangle([(x0+15, y1 - 85), (x1-15, y1 - 15)], radius=12, fill=(15, 23, 42))
        t_bbox = font_card_title.getbbox(title)
        draw.text((cx - (t_bbox[2]-t_bbox[0])//2, y1 - 76), title, fill=WHITE, font=font_card_title)
        s_bbox = font_badge.getbbox(subtitle)
        draw.text((cx - (s_bbox[2]-s_bbox[0])//2, y1 - 48), subtitle, fill=CYAN_ACCENT, font=font_badge)
        
    return im

def render_product_scene(frame_idx, local_frame, total_scene_frames, scene_idx, 
                         raw_img, model_code, category, full_title, desc, specs):
    im = BASE_BG.copy()
    draw = ImageDraw.Draw(im)
    draw_header(draw, active_idx=scene_idx)
    draw_footer(draw, frame_idx)
    
    # Ken Burns smooth zoom
    progress = local_frame / total_scene_frames
    zoom = 0.96 + 0.08 * math.sin(progress * math.pi / 2)
    
    # Left: Showcase Product Card
    draw_product_card(im, raw_img, zoom=zoom, center_x=490, center_y=540, box_w=660, box_h=720, badge_text=f"SERIES: {model_code}")
    
    # Right: Specifications & Features Panel
    rx0 = 890
    ry0 = 175
    
    # Category / Model Badge
    badge_label = f"{category}  •  {model_code}"
    bbox = font_badge.getbbox(badge_label)
    bw = bbox[2] - bbox[0] + 36
    draw.rounded_rectangle([(rx0, ry0), (rx0 + bw, ry0 + 36)], radius=18, fill=(23, 37, 70), outline=CYAN_ACCENT, width=1)
    draw.text((rx0 + 18, ry0 + 9), badge_label, fill=CYAN_ACCENT, font=font_badge)
    
    # Product Title (fitting nicely)
    draw.text((rx0, ry0 + 52), full_title, fill=WHITE, font=font_title)
    
    # Description
    draw.text((rx0, ry0 + 115), desc, fill=SLATE_200, font=font_subtitle)
    
    # Specs Cards (Grid of 4 technical highlights)
    card_y = ry0 + 175
    for i, spec in enumerate(specs):
        spec_y = card_y + i * 115
        
        draw.rounded_rectangle([(rx0, spec_y), (rx0 + 950, spec_y + 95)], radius=16, 
                               fill=CARD_BG, outline=BORDER_COLOR, width=1)
        
        accent_color = [CYAN_ACCENT, INDIGO_ACCENT, EMERALD_ACCENT, AMBER_ACCENT][i % 4]
        draw.rounded_rectangle([(rx0, spec_y), (rx0 + 8, spec_y + 95)], radius=4, fill=accent_color)
        
        draw.text((rx0 + 32, spec_y + 16), spec["title"], fill=accent_color, font=font_body_bold)
        draw.text((rx0 + 32, spec_y + 48), spec["detail"], fill=SLATE_200, font=font_body)
        
    return im

def render_scene_summary(frame_idx, local_frame, total_scene_frames):
    im = BASE_BG.copy()
    draw = ImageDraw.Draw(im)
    draw_header(draw, active_idx=4)
    draw_footer(draw, frame_idx)
    
    tag_txt = "COMPLETE INDUSTRIAL CATALOGUE"
    draw.rounded_rectangle([(WIDTH//2 - 160, 135), (WIDTH//2 + 160, 169)], radius=17, 
                           fill=(23, 37, 70), outline=CYAN_ACCENT, width=1)
    bbox = font_badge.getbbox(tag_txt)
    draw.text((WIDTH//2 - (bbox[2]-bbox[0])//2, 143), tag_txt, fill=CYAN_ACCENT, font=font_badge)
    
    title = "ENGINEERED FOR CRITICAL INDUSTRIAL APPLICATIONS"
    bbox = font_title.getbbox(title)
    draw.text((WIDTH//2 - (bbox[2]-bbox[0])//2, 185), title, fill=WHITE, font=font_title)
    
    cards = [
        {
            "img": raw_be20,
            "title": "BE20 Butterfly Damper",
            "type": "Pneumatic Double Offset",
            "pts": ["Low Operating Torque", "High-Temp Gas Exhaust", "Pneumatic Quarter-Turn"],
            "cx": 380
        },
        {
            "img": raw_be200,
            "title": "BE200 Inline Valve",
            "type": "Manual Straight Pattern",
            "pts": ["High-Pressure Pipeline Isolation", "Cast Carbon & SS Body", "Bubble-Tight Stem Seal"],
            "cx": 960
        },
        {
            "img": raw_motorized,
            "title": "Motorized Double Disc",
            "type": "Electric Gate Valve",
            "pts": ["Expanding Bi-Directional Seal", "Intelligent SCADA Actuation", "Zero Seat Wear Travel"],
            "cx": 1540
        }
    ]
    
    for c in cards:
        cx = c["cx"]
        cw, ch = 480, 560
        cy = 560
        x0, y0 = cx - cw//2, cy - ch//2
        x1, y1 = cx + cw//2, cy + ch//2
        
        draw.rounded_rectangle([(x0, y0), (x1, y1)], radius=20, fill=(255, 255, 255), outline=BORDER_COLOR, width=2)
        
        max_ih = 270
        ratio = min(360 / c["img"].width, max_ih / c["img"].height)
        iw, ih = int(c["img"].width * ratio), int(c["img"].height * ratio)
        res = c["img"].resize((iw, ih), Image.Resampling.LANCZOS)
        im.paste(res, (cx - iw//2, y0 + 20), res)
        
        draw.rounded_rectangle([(x0 + 15, y0 + 310), (x1 - 15, y1 - 15)], radius=14, fill=(15, 23, 42))
        
        t_bbox = font_card_title.getbbox(c["title"])
        draw.text((cx - (t_bbox[2]-t_bbox[0])//2, y0 + 325), c["title"], fill=WHITE, font=font_card_title)
        
        s_bbox = font_badge.getbbox(c["type"])
        draw.text((cx - (s_bbox[2]-s_bbox[0])//2, y0 + 355), c["type"], fill=CYAN_ACCENT, font=font_badge)
        
        py = y0 + 395
        for pt in c["pts"]:
            draw.ellipse([(x0 + 40, py + 6), (x0 + 48, py + 14)], fill=CYAN_ACCENT)
            draw.text((x0 + 60, py), pt, fill=SLATE_200, font=font_body)
            py += 35
            
    # Bottom Call To Action Banner
    draw.rounded_rectangle([(WIDTH//2 - 400, 880), (WIDTH//2 + 400, 950)], radius=25, 
                           fill=(23, 37, 70), outline=CYAN_ACCENT, width=2)
    cta = "CONTACT OUR ENGINEERING TEAM FOR CUSTOM SPECIFICATIONS & RFQ"
    c_bbox = font_body_bold.getbbox(cta)
    draw.text((WIDTH//2 - (c_bbox[2]-c_bbox[0])//2, 898), cta, fill=WHITE, font=font_body_bold)
    
    contact = "sales@bellatorengineers.in  •  www.bellatorengineers.in"
    ct_bbox = font_badge.getbbox(contact)
    draw.text((WIDTH//2 - (ct_bbox[2]-ct_bbox[0])//2, 924), contact, fill=CYAN_ACCENT, font=font_badge)
    
    return im

def generate_ambient_audio(wav_path, duration=22.0, sample_rate=44100):
    total_samples = int(sample_rate * duration)
    with wave.open(wav_path, 'w') as wav_file:
        wav_file.setnchannels(2)
        wav_file.setsampwidth(2)
        wav_file.setframerate(sample_rate)
        
        # Elegant atmospheric industrial chord progression:
        freqs = [87.31, 130.81, 196.00, 207.65, 311.13, 466.16]
        
        frames = bytearray()
        for i in range(total_samples):
            t = i / sample_rate
            env = min(1.0, t / 2.0) * min(1.0, (duration - t) / 2.5)
            
            sample_val = 0.0
            for idx, f in enumerate(freqs):
                lfo = 1.0 + 0.18 * math.sin(2 * math.pi * 0.2 * t + idx * 0.8)
                sub_oct = math.sin(2 * math.pi * (f * 0.5) * t) * 0.15 if idx == 0 else 0
                sample_val += (math.sin(2 * math.pi * f * t) + sub_oct) * lfo * (0.16 / len(freqs))
            
            val = int(sample_val * env * 32767.0)
            val = max(-32768, min(32767, val))
            frames.extend(struct.pack('<hh', val, val))
            
        wav_file.writeframes(frames)

specs_be20 = [
    {"title": "PNEUMATIC ACTUATION", "detail": "Quarter-turn high-cycle rack & pinion actuator with position indicator"},
    {"title": "DOUBLE OFFSET GEOMETRY", "detail": "Eccentric disc design minimizes seat friction and extends seal life"},
    {"title": "HIGH TEMPERATURE RATING", "detail": "Engineered for thermal exhaust, flue gas, and chemical vapors up to 450°C"},
    {"title": "LOW OPERATING TORQUE", "detail": "Balanced aerodynamic disc profile delivers rapid and smooth throttle response"}
]

specs_be200 = [
    {"title": "STRAIGHT PATTERN INLINE DESIGN", "detail": "Streamlined body cavity ensures high flow coefficient (Cv) and minimal pressure drop"},
    {"title": "BUBBLE-TIGHT ISOLATION", "detail": "Precision machined metal-to-metal seating for critical fluid & steam isolation"},
    {"title": "RISING STEM MANUAL CONTROL", "detail": "Precision bronze/SS stem bushing with reinforced low-emission packing gland"},
    {"title": "FORGED & CAST INDUSTRIAL GRADE", "detail": "Available in WCB carbon steel, CF8M stainless steel & alloy configurations"}
]

specs_motorized = [
    {"title": "MULTI-TURN ELECTRIC ACTUATOR", "detail": "Intelligent actuator unit with smart digital status feedback and local controls"},
    {"title": "PARALLEL DOUBLE DISC SEALING", "detail": "Internal mechanical wedge forces discs firmly against seats for bi-directional shutoff"},
    {"title": "SCADA / PLC INTEGRATION READY", "detail": "4-20mA positioning, Modbus/Profibus industrial automation fieldbus protocol"},
    {"title": "ZERO SEAT WEAR TRAVEL", "detail": "Discs release before stroke begins, preventing scraping wear and extending lifespan"}
]

def render_frame(frame_idx):
    # Total frames: 660 (22.0 seconds at 30 fps)
    # Scene 0 (Intro): 0 to 120 (4s)
    # Scene 1 (BE20): 120 to 255 (4.5s)
    # Scene 2 (BE200): 255 to 390 (4.5s)
    # Scene 3 (Motorized Gate): 390 to 525 (4.5s)
    # Scene 4 (Summary & CTA): 525 to 660 (4.5s)
    
    TRANSITION_FRAMES = 15 # 0.5s smooth crossfade
    
    if frame_idx < 120:
        img = render_scene_intro(frame_idx, frame_idx, 120)
        if frame_idx >= 120 - TRANSITION_FRAMES:
            next_img = render_product_scene(frame_idx, 0, 135, 1, raw_be20, "BE20", 
                                            "BUTTERFLY DAMPER VALVE", 
                                            "BE20 Pneumatic Double Offset Butterfly Damper",
                                            "Engineered for high-temperature gas, ventilation, and industrial flow throttling",
                                            specs_be20)
            alpha = (frame_idx - (120 - TRANSITION_FRAMES)) / TRANSITION_FRAMES
            img = Image.blend(img, next_img, alpha)
        return img
        
    elif frame_idx < 255:
        local_idx = frame_idx - 120
        img = render_product_scene(frame_idx, local_idx, 135, 1, raw_be20, "BE20", 
                                  "BUTTERFLY DAMPER VALVE", 
                                  "BE20 Pneumatic Double Offset Butterfly Damper",
                                  "Engineered for high-temperature gas, ventilation, and industrial flow throttling",
                                  specs_be20)
        if frame_idx >= 255 - TRANSITION_FRAMES:
            next_img = render_product_scene(frame_idx, 0, 135, 2, raw_be200, "BE200", 
                                            "STRAIGHT PATTERN INLINE", 
                                            "BE200 Manual Straight Pattern Inline Valve",
                                            "Precision inline high-pressure pipeline isolation for steam, liquids, and process fluids",
                                            specs_be200)
            alpha = (frame_idx - (255 - TRANSITION_FRAMES)) / TRANSITION_FRAMES
            img = Image.blend(img, next_img, alpha)
        return img
        
    elif frame_idx < 390:
        local_idx = frame_idx - 255
        img = render_product_scene(frame_idx, local_idx, 135, 2, raw_be200, "BE200", 
                                  "STRAIGHT PATTERN INLINE", 
                                  "BE200 Manual Straight Pattern Inline Valve",
                                  "Precision inline high-pressure pipeline isolation for steam, liquids, and process fluids",
                                  specs_be200)
        if frame_idx >= 390 - TRANSITION_FRAMES:
            next_img = render_product_scene(frame_idx, 0, 135, 3, raw_motorized, "MOTORIZED", 
                                            "AUTOMATED GATE VALVE", 
                                            "Motorized Double Disc Gate Valve",
                                            "Heavy-duty expanding double disc gate valve with automated multi-turn electric actuation",
                                            specs_motorized)
            alpha = (frame_idx - (390 - TRANSITION_FRAMES)) / TRANSITION_FRAMES
            img = Image.blend(img, next_img, alpha)
        return img
        
    elif frame_idx < 525:
        local_idx = frame_idx - 390
        img = render_product_scene(frame_idx, local_idx, 135, 3, raw_motorized, "MOTORIZED", 
                                  "AUTOMATED GATE VALVE", 
                                  "Motorized Double Disc Gate Valve",
                                  "Heavy-duty expanding double disc gate valve with automated multi-turn electric actuation",
                                  specs_motorized)
        if frame_idx >= 525 - TRANSITION_FRAMES:
            next_img = render_scene_summary(frame_idx, 0, 135)
            alpha = (frame_idx - (525 - TRANSITION_FRAMES)) / TRANSITION_FRAMES
            img = Image.blend(img, next_img, alpha)
        return img
        
    else:
        local_idx = frame_idx - 525
        img = render_scene_summary(frame_idx, local_idx, 135)
        # Fade to black on the last 15 frames
        if frame_idx >= 660 - 15:
            alpha = (frame_idx - (660 - 15)) / 15.0
            black = Image.new("RGB", (WIDTH, HEIGHT), (0, 0, 0))
            img = Image.blend(img, black, alpha)
        return img

def main():
    import sys
    print("Generating ambient audio track...")
    wav_path = "/tmp/ambient_track.wav"
    generate_ambient_audio(wav_path, duration=DURATION)
    
    print("Exporting sample poster image...")
    poster = render_scene_intro(60, 60, 120)
    poster.save(os.path.join(PUBLIC_DIR, "valves-showcase-poster.jpg"), quality=95)
    print("Poster saved to public/valves-showcase-poster.jpg")
    
    print(f"Streaming {TOTAL_FRAMES} frames into FFmpeg for MP4 generation...")
    cmd = [
        "ffmpeg", "-y",
        "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{WIDTH}x{HEIGHT}", "-r", str(FPS),
        "-i", "-", # Stdin raw video
        "-i", wav_path, # Audio track
        "-c:v", "libopenh264", "-b:v", "6M", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "192k",
        "-shortest",
        OUTPUT_MP4
    ]
    
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    for i in range(TOTAL_FRAMES):
        if i % 60 == 0:
            print(f"Rendered frame {i}/{TOTAL_FRAMES} ({i/FPS:.1f}s)")
        frame_img = render_frame(i)
        proc.stdin.write(frame_img.tobytes())
        
    proc.stdin.close()
    out, err = proc.communicate()
    if proc.returncode != 0:
        print("FFmpeg error:", err.decode("utf-8", errors="ignore"))
        sys.exit(proc.returncode)
        
    print(f"Successfully created {OUTPUT_MP4}!")
    
    # Also create WebM version
    print(f"Creating WebM version at {OUTPUT_WEBM}...")
    webm_cmd = [
        "ffmpeg", "-y",
        "-i", OUTPUT_MP4,
        "-c:v", "libvpx-vp9", "-b:v", "2M", "-crf", "30",
        "-c:a", "libvorbis", "-b:a", "128k",
        OUTPUT_WEBM
    ]
    subprocess.run(webm_cmd, check=True)
    print(f"Successfully created {OUTPUT_WEBM}!")

if __name__ == "__main__":
    main()
