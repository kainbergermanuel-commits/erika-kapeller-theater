# Erzeugt die Kopfbilder der Unterseiten: dieselbe Bühne, je ein Requisit im Scheinwerfer.
# Aufruf: python3 werkzeuge/kopfbilder.py   (schreibt site/assets/img/kopf-*.svg)
import random, math
W,H,F=1600,1000,720
X=1180  # Position des Requisits
ST='#2c221b'; HI='#6a5440'

def basis(inhalt, staub_y=520):
    random.seed(3)
    o=[f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" preserveAspectRatio="xMidYMid slice">',
    f'''<defs>
<radialGradient id="wand" cx="{X}" cy="520" r="720" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#33251d"/><stop offset=".4" stop-color="#1b1410"/><stop offset="1" stop-color="#0d0a09"/></radialGradient>
<linearGradient id="boden" x1="0" y1="{F}" x2="0" y2="{H}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#1c1410"/><stop offset="1" stop-color="#0e0a08"/></linearGradient>
<linearGradient id="kegel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe9bf" stop-opacity=".22"/><stop offset=".7" stop-color="#d6a75a" stop-opacity=".08"/><stop offset="1" stop-color="#d6a75a" stop-opacity="0"/></linearGradient>
<radialGradient id="pfuetze" cx="{X}" cy="790" r="300" gradientTransform="translate(0 592.5) scale(1 .25)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#f0d199" stop-opacity=".45"/><stop offset=".5" stop-color="#d6a75a" stop-opacity=".14"/><stop offset="1" stop-color="#d6a75a" stop-opacity="0"/></radialGradient>
<linearGradient id="falten" x1="0" y1="0" x2="46" y2="0" gradientUnits="userSpaceOnUse" spreadMethod="repeat"><stop offset="0" stop-color="#22060a"/><stop offset=".3" stop-color="#4e1216"/><stop offset=".5" stop-color="#7a2224"/><stop offset=".7" stop-color="#4a1014"/><stop offset="1" stop-color="#22060a"/></linearGradient>
<linearGradient id="schatten" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".75"/><stop offset="1" stop-color="#000" stop-opacity=".15"/></linearGradient>
<radialGradient id="birne" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fffaf0"/><stop offset=".35" stop-color="#ffe6b0" stop-opacity=".9"/><stop offset="1" stop-color="#d6a75a" stop-opacity="0"/></radialGradient>
<linearGradient id="spiegel" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2a2420"/><stop offset=".45" stop-color="#4a4038"/><stop offset=".5" stop-color="#5a4e44"/><stop offset="1" stop-color="#1d1915"/></linearGradient>
<filter id="weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="18"/></filter>
<filter id="hauch" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.5"/></filter>
</defs>
<style>.flimmern{{animation:flimmern 8s ease-in-out 2}}@keyframes flimmern{{0%,100%{{opacity:1}}40%{{opacity:.88}}44%{{opacity:.96}}48%{{opacity:.84}}}}
.staub circle{{fill:#f0d199;animation:schweben linear 2}}@keyframes schweben{{0%{{transform:translate(0,0);opacity:0}}15%{{opacity:.7}}85%{{opacity:.5}}100%{{transform:translate(14px,-140px);opacity:0}}}}
@media (prefers-reduced-motion:reduce){{.flimmern,.staub circle{{animation:none}}}}</style>''',
    f'<rect width="{W}" height="{H}" fill="url(#wand)"/>',
    f'<polygon points="-200,{F} 1800,{F} 2300,{H} -700,{H}" fill="url(#boden)"/>']
    vx,vy=X,260
    for i in range(-26,27):
        xb=X+i*58; t=(F-vy)/(H-vy); xf=vx+(xb-vx)/t
        o.append(f'<line x1="{xb}" y1="{F}" x2="{xf:.0f}" y2="{H}" stroke="#d6a75a" stroke-opacity="{max(.02,.07-abs(i)*.0018):.3f}"/>')
    o.append(f'<line x1="-100" y1="{F}" x2="1700" y2="{F}" stroke="#d6a75a" stroke-opacity=".12"/>')
    # Scheinwerferkegel von oben
    o.append(f'<polygon class="flimmern" points="{X-50},-40 {X+50},-40 {X+290},800 {X-290},800" fill="url(#kegel)" filter="url(#weich)"/>')
    o.append(f'<ellipse class="flimmern" cx="{X}" cy="790" rx="330" ry="80" fill="url(#pfuetze)"/>')
    o.append(inhalt)
    o.append('<g class="staub">')
    for k in range(26):
        x=X+random.uniform(-200,200); y=random.uniform(150,staub_y+180)
        o.append(f'<circle cx="{x:.0f}" cy="{y:.0f}" r="{random.choice([1,1.2,1.5,1.9])}" style="animation-duration:{random.uniform(10,18):.1f}s;animation-delay:{-random.uniform(0,18):.1f}s"/>')
    o.append('</g>')
    # rechter Vorhang
    p='M1600 0 H1450 C1435 230 1465 470 1530 626 C1490 730 1465 870 1455 1000 H1600 Z'
    o.append(f'<path d="{p}" fill="url(#falten)"/><path d="{p}" fill="url(#schatten)"/>')
    o.append('<path d="M1522 620 Q1561 630 1600 620" stroke="#7a5a30" stroke-width="7" fill="none"/><path d="M1536 626 v32" stroke="#7a5a30" stroke-width="2"/><path d="M1529 658 h14 l5 32 h-24 Z" fill="#6a4c28"/>')
    o.append('</svg>')
    return '\n'.join(o)

def schatten(x,rx=90):
    return f'<ellipse cx="{x+20}" cy="786" rx="{rx}" ry="8" fill="#000" opacity=".4" filter="url(#hauch)"/>'

def stuhl(x, s=1.0, y=790):
    def P(dx,dy): return f'{x+dx*s:.1f},{y+dy*s:.1f}'
    g=[schatten(x,80*s)]
    w=6*s
    # hintere Beine + Lehne
    g.append(f'<line x1="{x-46*s}" y1="{y-235*s}" x2="{x-46*s}" y2="{y-20*s}" stroke="{ST}" stroke-width="{w}" stroke-linecap="round"/>')
    g.append(f'<line x1="{x+38*s}" y1="{y-235*s}" x2="{x+38*s}" y2="{y-20*s}" stroke="{ST}" stroke-width="{w}" stroke-linecap="round"/>')
    for yy in (235,200,165):
        g.append(f'<rect x="{x-50*s}" y="{y-yy*s}" width="{92*s}" height="{(10 if yy==235 else 6)*s}" rx="{2*s}" fill="{ST}"/>')
    # Sitz
    g.append(f'<polygon points="{P(-54,-120)} {P(42,-120)} {P(60,-100)} {P(-36,-100)}" fill="#3a2b21"/>')
    g.append(f'<polygon points="{P(-36,-100)} {P(60,-100)} {P(60,-92)} {P(-36,-92)}" fill="{ST}"/>')
    g.append(f'<line x1="{x-54*s}" y1="{y-120*s}" x2="{x+42*s}" y2="{y-120*s}" stroke="{HI}" stroke-opacity=".7" stroke-width="{1.5*s}"/>')
    # vordere Beine
    g.append(f'<line x1="{x-36*s}" y1="{y-94*s}" x2="{x-36*s}" y2="{y}" stroke="{ST}" stroke-width="{w}" stroke-linecap="round"/>')
    g.append(f'<line x1="{x+60*s}" y1="{y-94*s}" x2="{x+60*s}" y2="{y}" stroke="{ST}" stroke-width="{w}" stroke-linecap="round"/>')
    g.append(f'<line x1="{x-36*s}" y1="{y-40*s}" x2="{x+60*s}" y2="{y-40*s}" stroke="{ST}" stroke-width="{3*s}"/>')
    return ''.join(g)

def buch(x):
    g=[schatten(x-10,150)]
    y=770
    g.append(f'<path d="M{x-150} {y+6} Q{x-70} {y-14} {x} {y+8} Q{x+70} {y-14} {x+150} {y+6} L{x+150} {y+16} Q{x+70} {y-4} {x} {y+18} Q{x-70} {y-4} {x-150} {y+16} Z" fill="#3a2414"/>')
    g.append(f'<path d="M{x-146} {y} Q{x-70} {y-60} {x} {y+2} Q{x+70} {y-60} {x+146} {y} L{x+146} {y+8} Q{x+70} {y-22} {x} {y+10} Q{x-70} {y-22} {x-146} {y+8} Z" fill="#cdbb98"/>')
    g.append(f'<path d="M{x-140} {y-6} Q{x-70} {y-66} {x} {y-4} L{x} {y+4} Q{x-70} {y-30} {x-140} {y+2} Z" fill="#f1e5cc"/>')
    g.append(f'<path d="M{x+140} {y-6} Q{x+70} {y-66} {x} {y-4} L{x} {y+4} Q{x+70} {y-30} {x+140} {y+2} Z" fill="#e6d7b8"/>')
    for k in range(6):
        t=k*7
        g.append(f'<path d="M{x-120} {y-14-t*.1} Q{x-66} {y-48-t} {x-18} {y-12-t*.6}" stroke="#8a7a60" stroke-opacity=".35" stroke-width="1.4" fill="none" transform="translate(0 {k*5})"/>')
        g.append(f'<path d="M{x+18} {y-12-t*.6} Q{x+66} {y-48-t} {x+120} {y-14-t*.1}" stroke="#8a7a60" stroke-opacity=".3" stroke-width="1.4" fill="none" transform="translate(0 {k*5})"/>')
    g.append(f'<path d="M{x} {y-4} V{y+10}" stroke="#7a6248" stroke-width="2"/>')
    # Lesezeichen
    g.append(f'<path d="M{x+6} {y+8} q4 26 -6 46" stroke="#9b3330" stroke-width="5" fill="none"/>')
    return ''.join(g)

def mikro(x):
    g=[schatten(x,60)]
    g.append(f'<ellipse cx="{x}" cy="784" rx="44" ry="9" fill="{ST}"/><ellipse cx="{x}" cy="781" rx="40" ry="6" fill="#3a2d23"/>')
    g.append(f'<rect x="{x-4}" y="470" width="8" height="312" fill="{ST}"/><rect x="{x-1.5}" y="470" width="2" height="312" fill="{HI}" opacity=".6"/>')
    g.append(f'<rect x="{x-8}" y="600" width="16" height="14" rx="3" fill="{ST}"/>')
    g.append(f'<path d="M{x} 470 L{x-58} 410" stroke="{ST}" stroke-width="7" stroke-linecap="round"/>')
    g.append(f'<g transform="rotate(-38 {x-70} 396)"><rect x="{x-86}" y="352" width="32" height="64" rx="16" fill="#4a3e34"/><rect x="{x-86}" y="352" width="32" height="34" rx="16" fill="#8f8172"/>')
    for k in range(5): g.append(f'<line x1="{x-84}" y1="{358+k*6}" x2="{x-56}" y2="{358+k*6}" stroke="#2a221c" stroke-width="1.4"/>')
    g.append(f'<rect x="{x-80}" y="356" width="5" height="24" rx="2.5" fill="#fff" opacity=".35"/></g>')
    return ''.join(g)

def spiegel(x):
    g=[]
    l,r,t,b=x-150,x+150,330,600
    g.append(f'<rect x="{l-20}" y="{t-20}" width="{r-l+40}" height="{b-t+40}" rx="6" fill="#241a14"/>')
    g.append(f'<rect x="{l}" y="{t}" width="{r-l}" height="{b-t}" fill="url(#spiegel)"/>')
    g.append(f'<path d="M{l+40} {b} L{l+150} {t} L{l+190} {t} L{l+80} {b} Z" fill="#fff" opacity=".05"/>')
    bulbs=[(l-10+i*(r-l+20)/6, t-10) for i in range(7)]+[(l-10, t+40+i*(b-t-30)/4) for i in range(5)]+[(r+10, t+40+i*(b-t-30)/4) for i in range(5)]
    g.append('<g class="flimmern">')
    for bx,by in bulbs:
        g.append(f'<circle cx="{bx:.0f}" cy="{by:.0f}" r="34" fill="url(#birne)" opacity=".55"/>')
    g.append('</g>')
    for bx,by in bulbs:
        g.append(f'<circle cx="{bx:.0f}" cy="{by:.0f}" r="8" fill="#fff4dc"/>')
    # Schminktisch
    g.append(schatten(x,170))
    g.append(f'<rect x="{x-190}" y="640" width="380" height="14" fill="#3a2b21"/><rect x="{x-190}" y="640" width="380" height="2" fill="{HI}" opacity=".7"/>')
    g.append(f'<rect x="{x-180}" y="654" width="8" height="130" fill="{ST}"/><rect x="{x+172}" y="654" width="8" height="130" fill="{ST}"/>')
    # Puderdose, Pinsel, Rose
    g.append(f'<ellipse cx="{x-90}" cy="636" rx="26" ry="7" fill="#7a5a30"/><rect x="{x-116}" y="626" width="52" height="10" fill="#8a6a3a"/><ellipse cx="{x-90}" cy="626" rx="26" ry="6" fill="#d6a75a" opacity=".7"/>')
    g.append(f'<line x1="{x+40}" y1="638" x2="{x+110}" y2="618" stroke="#5a4634" stroke-width="5" stroke-linecap="round"/>')
    g.append(f'<path d="M{x-20} 638 q30 -6 60 -30" stroke="#3d4a2c" stroke-width="3" fill="none"/><circle cx="{x+42}" cy="606" r="10" fill="#9b3330"/><circle cx="{x+40}" cy="604" r="5" fill="#b8453f"/>')
    return ''.join(g)

motive={
 'stuecke': stuhl(X),
 'buch': buch(X),
 'workshops': stuhl(X-190,.78,770)+stuhl(X+170,.78,770)+stuhl(X-10,.9,800),
 'buehne': mikro(X),
 'ueber-mich': spiegel(X),
}
for name,inhalt in motive.items():
    open(f'site/assets/img/kopf-{name}.svg','w').write(basis(inhalt))
    print('kopf-'+name)
