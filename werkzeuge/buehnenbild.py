# Erzeugt site/assets/img/buehne.svg (Hero der Startseite: leere Bühne mit Geisterlicht).
# Aufruf: python3 werkzeuge/buehnenbild.py site/assets/img/buehne.svg
import random, sys
random.seed(7)
W,H=1600,1000
LX,LY=1120,430   # Glühbirne des Geisterlichts
FLOOR=720        # Hinterkante der Bühne

o=[]
o.append(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" preserveAspectRatio="xMidYMid slice">')
o.append('''<defs>
<radialGradient id="wand" cx="1030" cy="470" r="760" gradientUnits="userSpaceOnUse">
 <stop offset="0" stop-color="#3a2a20"/><stop offset=".35" stop-color="#1f1612"/><stop offset="1" stop-color="#0d0a09"/>
</radialGradient>
<linearGradient id="boden" x1="0" y1="720" x2="0" y2="1000" gradientUnits="userSpaceOnUse">
 <stop offset="0" stop-color="#1c1410"/><stop offset="1" stop-color="#0e0a08"/>
</linearGradient>
<radialGradient id="pfuetze" cx="1120" cy="800" r="460" gradientTransform="translate(0 600) scale(1 .25)" gradientUnits="userSpaceOnUse">
 <stop offset="0" stop-color="#f0d199" stop-opacity=".42"/><stop offset=".45" stop-color="#d6a75a" stop-opacity=".12"/><stop offset="1" stop-color="#d6a75a" stop-opacity="0"/>
</radialGradient>
<radialGradient id="hof" cx="1120" cy="430" r="330" gradientUnits="userSpaceOnUse">
 <stop offset="0" stop-color="#ffe9bf" stop-opacity=".6"/><stop offset=".25" stop-color="#d6a75a" stop-opacity=".26"/><stop offset="1" stop-color="#d6a75a" stop-opacity="0"/>
</radialGradient>
<radialGradient id="kern" cx="1120" cy="430" r="60" gradientUnits="userSpaceOnUse">
 <stop offset="0" stop-color="#fffaf0"/><stop offset=".4" stop-color="#ffe6b0" stop-opacity=".85"/><stop offset="1" stop-color="#d6a75a" stop-opacity="0"/>
</radialGradient>
<linearGradient id="falten" x1="0" y1="0" x2="46" y2="0" gradientUnits="userSpaceOnUse" spreadMethod="repeat">
 <stop offset="0" stop-color="#22060a"/><stop offset=".3" stop-color="#4e1216"/><stop offset=".5" stop-color="#7a2224"/><stop offset=".7" stop-color="#4a1014"/><stop offset="1" stop-color="#22060a"/>
</linearGradient>
<linearGradient id="faltenQuer" x1="0" y1="0" x2="0" y2="1" >
 <stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset=".55" stop-color="#000" stop-opacity=".1"/><stop offset="1" stop-color="#000" stop-opacity=".7"/>
</linearGradient>
<linearGradient id="vorhangLinks" x1="0" y1="0" x2="1" y2="0">
 <stop offset="0" stop-color="#000" stop-opacity=".85"/><stop offset=".7" stop-color="#000" stop-opacity=".35"/><stop offset="1" stop-color="#000" stop-opacity=".1"/>
</linearGradient>
<linearGradient id="vorhangRechts" x1="1" y1="0" x2="0" y2="0">
 <stop offset="0" stop-color="#000" stop-opacity=".7"/><stop offset=".7" stop-color="#000" stop-opacity=".2"/><stop offset="1" stop-color="#d6a75a" stop-opacity=".08"/>
</linearGradient>
<linearGradient id="stange" x1="0" y1="0" x2="1" y2="0">
 <stop offset="0" stop-color="#1b1411"/><stop offset=".5" stop-color="#4a3a2c"/><stop offset="1" stop-color="#1b1411"/>
</linearGradient>
<filter id="weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14"/></filter>
<filter id="hauch" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.2"/></filter>
</defs>
<style>
 .flimmern{animation:flimmern 7s ease-in-out infinite}
 @keyframes flimmern{0%,100%{opacity:1}38%{opacity:.9}41%{opacity:.97}44%{opacity:.86}60%{opacity:.95}}
 .staub circle{fill:#f0d199;animation:schweben linear infinite}
 @keyframes schweben{0%{transform:translate(0,0);opacity:0}15%{opacity:.8}85%{opacity:.6}100%{transform:translate(18px,-150px);opacity:0}}
 @media (prefers-reduced-motion:reduce){.flimmern,.staub circle{animation:none}}
</style>''')

# Rückwand + Boden
o.append(f'<rect width="{W}" height="{H}" fill="url(#wand)"/>')
o.append(f'<polygon points="-200,{FLOOR} 1800,{FLOOR} 2300,{H} -700,{H}" fill="url(#boden)"/>')
# Dielen, perspektivisch zum Fluchtpunkt
vx,vy=1120,260
for i in range(-26,27):
    xb=1120+i*58
    t=(FLOOR-vy)/(H-vy)
    # Punkt an der Vorderkante so, dass die Linie durch den Fluchtpunkt läuft
    xf=vx+(xb-vx)/t
    op=max(.02,.075-abs(i)*.0018)
    o.append(f'<line x1="{xb}" y1="{FLOOR}" x2="{xf:.0f}" y2="{H}" stroke="#d6a75a" stroke-opacity="{op:.3f}" stroke-width="1"/>')
for y,op in [(758,.05),(812,.045),(886,.04),(978,.035)]:
    o.append(f'<line x1="-100" y1="{y}" x2="1700" y2="{y}" stroke="#000" stroke-opacity=".35" stroke-width="1"/>')
o.append(f'<line x1="-100" y1="{FLOOR}" x2="1700" y2="{FLOOR}" stroke="#d6a75a" stroke-opacity=".12"/>')
# Lichtpfütze am Boden
o.append('<g transform="translate(-90 0)">')
o.append('<ellipse class="flimmern" cx="1120" cy="800" rx="520" ry="120" fill="url(#pfuetze)"/>')

# Geisterlicht: Schatten, Stativ, Stange, Käfig, Birne
o.append('<ellipse cx="1132" cy="786" rx="70" ry="7" fill="#000" opacity=".35" filter="url(#hauch)"/>')
st='#2c221b'; hi='#5a4634'
o.append(f'<g stroke-linecap="round">'
         f'<line x1="1120" y1="700" x2="1066" y2="786" stroke="{st}" stroke-width="5"/>'
         f'<line x1="1120" y1="700" x2="1176" y2="784" stroke="{st}" stroke-width="5"/>'
         f'<line x1="1120" y1="700" x2="1128" y2="770" stroke="{st}" stroke-width="5"/>'
         f'<circle cx="1066" cy="789" r="5" fill="{st}"/><circle cx="1176" cy="787" r="5" fill="{st}"/><circle cx="1128" cy="773" r="5" fill="{st}"/>'
         f'<rect x="1116.5" y="478" width="7" height="226" fill="{st}"/>'
         f'<rect x="1119" y="478" width="2" height="226" fill="{hi}" opacity=".7"/>'
         f'<rect x="1112" y="640" width="16" height="12" rx="2" fill="{st}"/>'
         f'</g>')
# Hof hinter der Birne
o.append('<g class="flimmern"><circle cx="1120" cy="430" r="330" fill="url(#hof)"/></g>')
# Fassung
o.append(f'<rect x="1111" y="452" width="18" height="26" rx="3" fill="{st}"/>')
# Birne
o.append('<g class="flimmern"><circle cx="1120" cy="430" r="60" fill="url(#kern)"/>'
         '<ellipse cx="1120" cy="428" rx="15" ry="20" fill="#fff7e6"/>'
         '<ellipse cx="1115" cy="421" rx="5" ry="8" fill="#fff" opacity=".8"/></g>')
# Drahtkäfig
cg='#3b2d23'
o.append(f'<g fill="none" stroke="{cg}" stroke-width="2">'
         f'<ellipse cx="1120" cy="428" rx="30" ry="38"/>'
         f'<path d="M1120 390 V466 M1100 396 Q1092 428 1100 460 M1140 396 Q1148 428 1140 460"/>'
         f'<ellipse cx="1120" cy="428" rx="30" ry="6"/>'
         f'</g><circle cx="1120" cy="388" r="5" fill="{cg}"/>')

# Staub im Licht
o.append('<g class="staub">')
for k in range(34):
    a=random.uniform(0,6.283); r=random.uniform(30,260)
    import math
    x=LX+math.cos(a)*r*1.1; y=LY+60+math.sin(a)*r*.9
    rad=random.choice([1,1.2,1.4,1.8,2.2])
    d=random.uniform(9,18); dl=-random.uniform(0,18)
    o.append(f'<circle cx="{x:.0f}" cy="{y:.0f}" r="{rad}" style="animation-duration:{d:.1f}s;animation-delay:{dl:.1f}s"/>')
o.append('</g>')

o.append('</g>')
# Vorhänge: links und rechts gerafft, mit Kordel
def vorhang(seite):
    if seite=='r':
        p='M1600 0 H1420 C1405 230 1440 470 1515 626 C1470 730 1440 870 1430 1000 H1600 Z'
        ko=(1532,628); sh='url(#vorhangRechts)'
    else:
        p='M0 0 H190 C205 230 170 470 95 626 C140 730 170 870 180 1000 H0 Z'
        ko=(78,628); sh='url(#vorhangLinks)'
    s=f'<path d="{p}" fill="url(#falten)"/><path d="{p}" fill="url(#faltenQuer)"/><path d="{p}" fill="{sh}"/>'
    # Kordel: Band, das sich um den gerafften Stoff legt, dazu eine Quaste
    if seite=='r': x0,x1=1508,1600
    else: x0,x1=0,102
    y=ko[1]
    s+=f'<path d="M{x0} {y-6} Q{(x0+x1)/2} {y+4} {x1} {y-6}" stroke="#7a5a30" stroke-width="7" fill="none"/>'
    s+=f'<path d="M{x0} {y-8} Q{(x0+x1)/2} {y+2} {x1} {y-8}" stroke="#d6a75a" stroke-opacity=".5" stroke-width="2" fill="none"/>'
    qx=x0+14 if seite=='r' else x1-14
    s+=f'<line x1="{qx}" y1="{y}" x2="{qx}" y2="{y+34}" stroke="#7a5a30" stroke-width="2"/>'
    s+=f'<path d="M{qx-7} {y+34} h14 l5 34 h-24 Z" fill="#6a4c28"/><path d="M{qx-7} {y+34} h14 l1 6 h-16 Z" fill="#d6a75a" opacity=".55"/>'
    return s
o.append(vorhang('l')); o.append(vorhang('r'))

# Querbehang (Soffitte) mit Bögen und Messingborte
pts='M0 0 H1600 V70'
x=1600
while x>0:
    pts+=f' Q{x-50} 112 {x-100} 70'; x-=100
pts+=' Z'
o.append(f'<path d="{pts}" fill="url(#falten)"/><path d="{pts}" fill="#000" opacity=".5"/>')
bor='M1600 70'
x=1600
while x>0:
    bor+=f' Q{x-50} 112 {x-100} 70'; x-=100
o.append(f'<path d="{bor}" fill="none" stroke="#d6a75a" stroke-opacity=".45" stroke-width="2"/>')
o.append(f'<path d="{bor}" transform="translate(0 7)" fill="none" stroke="#d6a75a" stroke-opacity=".18" stroke-width="5" stroke-dasharray="1 5"/>')

o.append('</svg>')
open(sys.argv[1],'w').write('\n'.join(o))
