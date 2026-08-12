# MELMAN & CO — ogledni premium web

Statička višestranična web stranica spremna za GitHub + Cloudflare Pages.

## Glavne stranice
- index.html
- nadstresnice.html
- projekti.html
- o-nama.html
- kontakt.html
- privatnost.html

## SEO landing stranice
- metalne-nadstresnice-zagreb.html
- metalne-nadstresnice-zagrebacka-zupanija.html
- metalne-nadstresnice-varazdin.html
- metalne-nadstresnice-medimurje.html
- metalne-nadstresnice-cakovec.html

## Cloudflare Pages
Nije potreban build command. Kao output/root koristite korijen repozitorija.

## Kontakt obrazac
U ovoj oglednoj verziji obrazac otvara korisnikovu e-mail aplikaciju s unaprijed pripremljenim upitom na info.melman@gmail.com. Za produkcijsku verziju preporučuje se spojiti Resend, Web3Forms ili Cloudflare Worker kako bi poruke išle izravno u inbox bez otvaranja mail aplikacije.

## Domena i sitemap
Kada bude poznata konačna domena:
1. u `sitemap-template.xml` zamijeniti `https://YOUR-DOMAIN.HR/` pravom domenom,
2. preimenovati datoteku u `sitemap.xml`,
3. u `robots.txt` dodati red `Sitemap: https://VASADOMENA.HR/sitemap.xml`,
4. po želji dodati apsolutne canonical URL-ove u `<head>` svake stranice.

Fotografije su optimizirane u AVIF i WebP formatima.

## Update 2026-08-12
- Novi, jasno vidljiv vektorski Melman & Co logo u navigaciji i footeru.
- Nova oštra premium hero fotografija s desktop i mobile varijantom.
- Hero se učitava prioritetno (`fetchpriority=high`) i bez grain sloja koji je ranije mogao smanjiti dojam oštrine.
